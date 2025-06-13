import { useEffect, useRef, useState, useCallback } from 'react'
import { useWebWorker } from './useWebWorker'
import { SocketOptions } from '../utils/socket'

// Inline code for the Socket.IO Web Worker
const SOCKET_WORKER_CODE = `
  importScripts('https://cdn.socket.io/4.6.1/socket.io.min.js');
  
  let socket = null;
  let options = null;
  let reconnectTimer = null;
  let reconnectCount = 0;
  let messageQueue = new Map();
  let queueTimer = null;
  
  // 处理重连 (handle reconnect)
  function handleReconnect() {
    if (reconnectTimer || !options || (options.reconnectLimit && reconnectCount >= options.reconnectLimit)) {
      return;
    }
    
    reconnectCount++;
    
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      // 关闭旧连接 (close old connection)
      if (socket) {
        socket.close();
        socket = null;
      }
      // 重新连接 (reconnect)
      connectSocket();
    }, options.reconnectInterval || 3000);
  }
  
  // 处理消息队列 (handle message queue)
  function startQueueProcessor() {
    if (queueTimer) {
      return;
    }
    
    queueTimer = setInterval(() => {
      const now = Date.now();
      
      messageQueue.forEach((eventQueue, event) => {
        if (
          eventQueue.queue.length > 0 && 
          now - eventQueue.lastSent >= (options.throttleInterval || 1000)
        ) {
          // 从队列取出最新消息 (pop latest message from queue)
          const data = eventQueue.queue.pop();
          // 清空队列 (clear queue)
          eventQueue.queue = [];
          
          // 发送消息 (send message)
          if (socket && socket.connected) {
            socket.emit(event, data);
            eventQueue.lastSent = now;
          }
        }
      });
    }, 100);
  }
  
  // 连接Socket (connect socket)
  function connectSocket() {
    if (!options || !options.url || socket) {
      return;
    }
    
    try {
      socket = io(options.url, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: false,
        protocols: options.protocols
      });
      
      // 连接成功 (on connect success)
      socket.on('connect', () => {
        reconnectCount = 0;
        self.postMessage({ type: 'SOCKET_OPEN' });
      });
      
      // 断开连接 (on disconnect)
      socket.on('disconnect', () => {
        self.postMessage({ type: 'SOCKET_CLOSE' });
        handleReconnect();
      });
      
      // 连接错误 (on connect error)
      socket.on('connect_error', (error) => {
        self.postMessage({ 
          type: 'SOCKET_ERROR', 
          payload: { message: error.message } 
        });
        handleReconnect();
      });
      
      // 启动队列处理 (start queue processor)
      startQueueProcessor();
      
    } catch (err) {
      self.postMessage({ 
        type: 'SOCKET_ERROR', 
        payload: { message: err.message || 'Unknown error' } 
      });
    }
  }
  
  // 关闭Socket (close socket)
  function closeSocket() {
    if (socket) {
      socket.close();
      socket = null;
    }
    
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    
    if (queueTimer) {
      clearInterval(queueTimer);
      queueTimer = null;
    }
    
    self.postMessage({ type: 'SOCKET_CLOSED' });
  }
  
  // 监听 Worker 消息 (listen to worker messages)
  self.addEventListener('message', (event) => {
    const { action, payload } = event.data;
    
    switch (action) {
      case 'CONNECT':
        options = payload;
        connectSocket();
        break;
        
      case 'DISCONNECT':
        closeSocket();
        break;
        
      case 'SUBSCRIBE':
        if (socket) {
          const { event: eventName } = payload;
          socket.on(eventName, (data) => {
            self.postMessage({ 
              type: 'SOCKET_MESSAGE', 
              payload: { event: eventName, data } 
            });
          });
          
          self.postMessage({ 
            type: 'SOCKET_SUBSCRIBED', 
            payload: { event: eventName } 
          });
        }
        break;
        
      case 'UNSUBSCRIBE':
        if (socket) {
          const { event: eventName } = payload;
          socket.off(eventName);
          
          self.postMessage({ 
            type: 'SOCKET_UNSUBSCRIBED', 
            payload: { event: eventName } 
          });
        }
        break;
        
      case 'EMIT':
        if (!socket) {
          self.postMessage({ 
            type: 'SOCKET_ERROR', 
            payload: { message: 'Socket not connected' } 
          });
          return;
        }
        
        const { event: emitEvent, data } = payload;
        
        // 使用事件名称作为队列名 (use event name as queue name)
        if (!messageQueue.has(emitEvent)) {
          messageQueue.set(emitEvent, {
            lastSent: 0,
            queue: [],
          });
        }
        
        // 添加到队列 (add to queue)
        const eventQueue = messageQueue.get(emitEvent);
        eventQueue.queue.push(data);
        
        self.postMessage({ 
          type: 'SOCKET_EMIT_QUEUED', 
          payload: { event: emitEvent } 
        });
        break;
        
      default:
        self.postMessage({ 
          type: 'WORKER_ERROR', 
          payload: { message: 'Unknown action: ' + action } 
        });
    }
  });
`

// Extend SocketOptions to add URL
interface SocketWorkerOptions extends SocketOptions {
  /**
   * webSocket address
   */
  url: string
}

// Return type for the hook
interface UseSocketWithWorkerResult {
  /** Is connected */
  isConnected: boolean
  /** Is loading */
  isLoading: boolean
  /** Connection error */
  error: Error | null
  /** Subscribe to event */
  subscribe: <T = any>(event: string, callback: (data: T) => void) => () => void
  /** Emit message */
  emit: <T = any>(event: string, data: T) => void
  /** Disconnect */
  disconnect: () => void
  /** Connect */
  connect: () => void
}

/**
 * Manage Socket.IO connection with WebWorker
 * @param socketUrl Socket.IO server URL
 * @param options options
 * @returns Socket controller
 */
export const useSocketWithWorker = (
  socketUrl: string,
  options: Omit<SocketWorkerOptions, 'url'> = {}
): UseSocketWithWorkerResult => {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Store event listeners
  const eventListeners = useRef<Map<string, Set<(data: any) => void>>>(new Map())

  // Create WebWorker
  const {
    postMessage,
    error: workerError,
    isRunning,
  } = useWebWorker<unknown, unknown>(SOCKET_WORKER_CODE, {
    terminateOnUnmount: true,
  })

  // Handle messages from Worker
  const handleWorkerMessage = useCallback((message: any) => {
    const { type, payload } = message

    switch (type) {
      case 'SOCKET_OPEN':
        setIsConnected(true)
        setIsLoading(false)
        setError(null)
        break
      case 'SOCKET_CLOSE':
        setIsConnected(false)
        break
      case 'SOCKET_ERROR':
        setError(new Error(payload.message))
        setIsLoading(false)
        break
      case 'SOCKET_MESSAGE': {
        // Trigger registered event listeners
        const listeners = eventListeners.current.get(payload.event)
        if (listeners) {
          listeners.forEach((callback) => {
            try {
              callback(payload.data)
            } catch (err) {
              console.error(`Error in event listener for ${payload.event}:`, err)
            }
          })
        }
        break
      }
      case 'SOCKET_CLOSED':
        setIsConnected(false)
        setIsLoading(false)
        break
      case 'WORKER_ERROR':
        setError(new Error(payload.message))
        setIsLoading(false)
        break
    }
  }, [])

  // Connect socket
  const connect = useCallback(() => {
    setIsLoading(true)
    setError(null)
    postMessage({
      action: 'CONNECT',
      payload: {
        url: socketUrl,
        ...options,
      },
    })
      .then(handleWorkerMessage)
      .catch((err) => {
        setError(err)
        setIsLoading(false)
      })
  }, [socketUrl, options, postMessage, handleWorkerMessage])

  // Disconnect socket
  const disconnect = useCallback(() => {
    postMessage({
      action: 'DISCONNECT',
      payload: {},
    })
      .then(handleWorkerMessage)
      .catch((err) => {
        setError(err)
      })
  }, [postMessage, handleWorkerMessage])

  // Subscribe to event
  const subscribe = useCallback(
    <T = any>(event: string, callback: (data: T) => void) => {
      // Add to local listeners
      if (!eventListeners.current.has(event)) {
        eventListeners.current.set(event, new Set())
      }
      const listeners = eventListeners.current.get(event)!
      listeners.add(callback as any)
      // Tell Worker to subscribe
      postMessage({
        action: 'SUBSCRIBE',
        payload: { event },
      })
        .then(handleWorkerMessage)
        .catch((err) => {
          setError(err)
        })
      // Return unsubscribe function
      return () => {
        const listeners = eventListeners.current.get(event)
        if (listeners) {
          listeners.delete(callback as any)
          // If no listeners left, tell Worker to unsubscribe
          if (listeners.size === 0) {
            eventListeners.current.delete(event)
            postMessage({
              action: 'UNSUBSCRIBE',
              payload: { event },
            })
              .then(handleWorkerMessage)
              .catch((err) => {
                setError(err)
              })
          }
        }
      }
    },
    [postMessage, handleWorkerMessage]
  )

  // Emit message
  const emit = useCallback(
    <T = any>(event: string, data: T) => {
      postMessage({
        action: 'EMIT',
        payload: { event, data },
      })
        .then(handleWorkerMessage)
        .catch((err) => {
          setError(err)
        })
    },
    [postMessage, handleWorkerMessage]
  )

  // Connect on mount unless manual
  useEffect(() => {
    if (!options.manual) {
      connect()
    }
    return () => {
      disconnect()
    }
  }, [connect, disconnect, options.manual])

  // Handle Worker error
  useEffect(() => {
    if (workerError) {
      setError(workerError)
      setIsLoading(false)
    }
  }, [workerError])

  return {
    isConnected,
    isLoading: isLoading || isRunning,
    error,
    subscribe,
    emit,
    disconnect,
    connect,
  }
}
