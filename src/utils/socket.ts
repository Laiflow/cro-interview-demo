import { Socket, io } from 'socket.io-client'

export interface SocketOptions {
  /**
   * Callback when webSocket connects successfully
   */
  onOpen?: (socket: Socket) => void
  /**
   * Callback when webSocket closes
   */
  onClose?: (socket: Socket) => void
  /**
   * Callback when webSocket receives a message
   */
  onMessage?: (data: any, event: string, socket: Socket) => void
  /**
   * Callback when webSocket encounters an error
   */
  onError?: (error: Error, socket: Socket) => void
  /**
   * Retry count
   */
  reconnectLimit?: number
  /**
   * Retry interval (ms)
   */
  reconnectInterval?: number
  /**
   * Manual connection start
   */
  manual?: boolean
  /**
   * Subprotocol
   */
  protocols?: string | string[]
  /**
   * Message throttle interval (ms)
   */
  throttleInterval?: number
}

export class SocketClient {
  private socket: Socket | null = null
  private url: string
  private options: SocketOptions
  private reconnectCount = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private messageQueue: Map<string, { lastSent: number; queue: any[] }> = new Map()
  private processQueueTimer: NodeJS.Timeout | null = null

  constructor(socketUrl: string, options: SocketOptions = {}) {
    this.url = socketUrl
    this.options = {
      reconnectLimit: 3,
      reconnectInterval: 3000,
      manual: false,
      throttleInterval: 1000, // 默认限制每秒1次
      ...options,
    }

    if (!this.options.manual) {
      this.connect()
    }
  }

  /**
   * Establish connection
   */
  connect() {
    if (this.socket) {
      return
    }

    // Create Socket.IO instance
    this.socket = io(this.url, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: false, // 禁用内置重连，使用自定义重连
      protocols: this.options.protocols,
    })

    // Listen for successful connection
    this.socket.on('connect', () => {
      this.reconnectCount = 0
      if (this.options.onOpen) {
        this.options.onOpen(this.socket!)
      }
    })

    // Listen for disconnect
    this.socket.on('disconnect', () => {
      if (this.options.onClose) {
        this.options.onClose(this.socket!)
      }
      this.reconnect()
    })

    // Listen for error
    this.socket.on('connect_error', (error) => {
      if (this.options.onError) {
        this.options.onError(error, this.socket!)
      }
      this.reconnect()
    })

    // Set default message handler
    this.startQueueProcessor()
  }

  /**
   * Try to reconnect
   */
  private reconnect() {
    if (
      this.reconnectTimer ||
      (this.options.reconnectLimit && this.reconnectCount >= this.options.reconnectLimit)
    ) {
      return
    }

    this.reconnectCount += 1
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      // Close existing connection
      if (this.socket) {
        this.socket.close()
        this.socket = null
      }
      // Reconnect
      this.connect()
    }, this.options.reconnectInterval)
  }

  /**
   * Close connection
   */
  close() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.processQueueTimer) {
      clearInterval(this.processQueueTimer)
      this.processQueueTimer = null
    }
  }

  /**
   * Subscribe to events
   */
  on(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      return () => {} // Return empty function as unsubscribe function
    }

    const wrappedCallback = (data: any) => {
      if (this.options.onMessage) {
        this.options.onMessage(data, event, this.socket!)
      }
      callback(data)
    }

    this.socket.on(event, wrappedCallback)

    // Return unsubscribe function
    return () => {
      if (this.socket) {
        this.socket.off(event, wrappedCallback)
      }
    }
  }

  /**
   * Send message (with throttling)
   */
  emit(event: string, data: any) {
    if (!this.socket) {
      // If not connected, try to reconnect
      this.connect()
      return false
    }

    // Use event name as queue name
    if (!this.messageQueue.has(event)) {
      this.messageQueue.set(event, {
        lastSent: 0,
        queue: [],
      })
    }

    // Add to queue
    const eventQueue = this.messageQueue.get(event)!
    eventQueue.queue.push(data)

    return true
  }

  /**
   * Start queue processor
   */
  private startQueueProcessor() {
    if (this.processQueueTimer) {
      return
    }

    // Process queue every 100ms
    this.processQueueTimer = setInterval(() => {
      const now = Date.now()

      this.messageQueue.forEach((eventQueue, event) => {
        // Check if message can be sent
        if (
          eventQueue.queue.length > 0 &&
          now - eventQueue.lastSent >= this.options.throttleInterval!
        ) {
          // Pop latest message from queue
          const data = eventQueue.queue.pop()
          // Clear queue, send only latest
          eventQueue.queue = []

          // Send message
          if (this.socket) {
            this.socket.emit(event, data)
            eventQueue.lastSent = now
          }
        }
      })
    }, 100)
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return !!this.socket?.connected
  }
}

/**
 * Create Socket.IO client
 */
export const createSocketClient = (socketUrl: string, options?: SocketOptions): SocketClient => {
  return new SocketClient(socketUrl, options)
}
