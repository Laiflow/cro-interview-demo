import { useEffect, useRef, useState, useCallback } from 'react'
import { useWebWorker } from './useWebWorker'
import { SocketOptions } from '../utils/socket'

// Socket.IO Web Worker 内联代码
const SOCKET_WORKER_CODE = `
  importScripts('https://cdn.socket.io/4.6.1/socket.io.min.js');
  
  let socket = null;
  let options = null;
  let reconnectTimer = null;
  let reconnectCount = 0;
  let messageQueue = new Map();
  let queueTimer = null;
  
  // 处理重连
  function handleReconnect() {
    if (reconnectTimer || !options || (options.reconnectLimit && reconnectCount >= options.reconnectLimit)) {
      return;
    }
    
    reconnectCount++;
    
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      // 关闭旧连接
      if (socket) {
        socket.close();
        socket = null;
      }
      // 重新连接
      connectSocket();
    }, options.reconnectInterval || 3000);
  }
  
  // 处理消息队列
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
          // 从队列取出最新消息
          const data = eventQueue.queue.pop();
          // 清空队列
          eventQueue.queue = [];
          
          // 发送消息
          if (socket && socket.connected) {
            socket.emit(event, data);
            eventQueue.lastSent = now;
          }
        }
      });
    }, 100);
  }
  
  // 连接Socket
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
      
      // 连接成功
      socket.on('connect', () => {
        reconnectCount = 0;
        self.postMessage({ type: 'SOCKET_OPEN' });
      });
      
      // 断开连接
      socket.on('disconnect', () => {
        self.postMessage({ type: 'SOCKET_CLOSE' });
        handleReconnect();
      });
      
      // 连接错误
      socket.on('connect_error', (error) => {
        self.postMessage({ 
          type: 'SOCKET_ERROR', 
          payload: { message: error.message } 
        });
        handleReconnect();
      });
      
      // 启动队列处理
      startQueueProcessor();
      
    } catch (err) {
      self.postMessage({ 
        type: 'SOCKET_ERROR', 
        payload: { message: err.message || 'Unknown error' } 
      });
    }
  }
  
  // 关闭Socket
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
  
  // 监听 Worker 消息
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
        
        // 使用事件名称作为队列名
        if (!messageQueue.has(emitEvent)) {
          messageQueue.set(emitEvent, {
            lastSent: 0,
            queue: [],
          });
        }
        
        // 添加到队列
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

// 扩展Socket选项，添加URL
interface SocketWorkerOptions extends SocketOptions {
  /**
   * webSocket 地址
   */
  url: string
}

// 钩子返回值
interface UseSocketWithWorkerResult {
  /**
   * 是否已连接
   */
  isConnected: boolean
  /**
   * 是否正在加载
   */
  isLoading: boolean
  /**
   * 连接错误
   */
  error: Error | null
  /**
   * 订阅事件
   * @param event 事件名
   * @param callback 回调函数
   * @returns 解除订阅函数
   */
  subscribe: <T = any>(event: string, callback: (data: T) => void) => () => void
  /**
   * 发送消息
   * @param event 事件名
   * @param data 消息数据
   */
  emit: <T = any>(event: string, data: T) => void
  /**
   * 断开连接
   */
  disconnect: () => void
  /**
   * 连接
   */
  connect: () => void
}

/**
 * 使用WebWorker管理Socket.IO连接
 * @param socketUrl Socket.IO服务器地址
 * @param options 选项
 * @returns Socket控制器
 */
export const useSocketWithWorker = (
  socketUrl: string,
  options: Omit<SocketWorkerOptions, 'url'> = {}
): UseSocketWithWorkerResult => {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // 保存事件监听器
  const eventListeners = useRef<Map<string, Set<(data: any) => void>>>(new Map())

  // 创建 WebWorker
  const {
    postMessage,
    error: workerError,
    isRunning,
  } = useWebWorker<unknown, unknown>(SOCKET_WORKER_CODE, {
    terminateOnUnmount: true,
  })

  // 统一处理来自Worker的消息
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

      case 'SOCKET_MESSAGE':
        // 触发注册的事件监听器
        const { event, data } = payload
        const listeners = eventListeners.current.get(event)

        if (listeners) {
          listeners.forEach((callback) => {
            try {
              callback(data)
            } catch (err) {
              console.error(`Error in event listener for ${event}:`, err)
            }
          })
        }
        break

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

  // 连接Socket
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

  // 断开连接
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

  // 订阅事件
  const subscribe = useCallback(
    <T = any>(event: string, callback: (data: T) => void) => {
      // 添加到本地监听器
      if (!eventListeners.current.has(event)) {
        eventListeners.current.set(event, new Set())
      }

      const listeners = eventListeners.current.get(event)!
      listeners.add(callback as any)

      // 告诉Worker订阅此事件
      postMessage({
        action: 'SUBSCRIBE',
        payload: { event },
      })
        .then(handleWorkerMessage)
        .catch((err) => {
          setError(err)
        })

      // 返回取消订阅函数
      return () => {
        const listeners = eventListeners.current.get(event)
        if (listeners) {
          listeners.delete(callback as any)

          // 如果没有监听器了，告诉Worker取消订阅
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

  // 发送消息
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

  // 组件挂载时连接，除非设置了manual
  useEffect(() => {
    if (!options.manual) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [connect, disconnect, options.manual])

  // 处理Worker错误
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
