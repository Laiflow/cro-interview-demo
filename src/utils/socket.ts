import { Socket, io } from 'socket.io-client'

export interface SocketOptions {
  /**
   * webSocket 连接成功回调
   */
  onOpen?: (socket: Socket) => void
  /**
   * webSocket 关闭回调
   */
  onClose?: (socket: Socket) => void
  /**
   * webSocket 收到消息回调
   */
  onMessage?: (data: any, event: string, socket: Socket) => void
  /**
   * webSocket 错误回调
   */
  onError?: (error: Error, socket: Socket) => void
  /**
   * 重试次数
   */
  reconnectLimit?: number
  /**
   * 重试时间间隔（ms）
   */
  reconnectInterval?: number
  /**
   * 手动启动连接
   */
  manual?: boolean
  /**
   * 子协议
   */
  protocols?: string | string[]
  /**
   * 消息限频间隔（ms）
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
   * 建立连接
   */
  connect() {
    if (this.socket) {
      return
    }

    // 创建Socket.IO实例
    this.socket = io(this.url, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: false, // 禁用内置重连，使用自定义重连
      protocols: this.options.protocols,
    })

    // 监听连接成功
    this.socket.on('connect', () => {
      this.reconnectCount = 0
      if (this.options.onOpen) {
        this.options.onOpen(this.socket!)
      }
    })

    // 监听断开连接
    this.socket.on('disconnect', () => {
      if (this.options.onClose) {
        this.options.onClose(this.socket!)
      }
      this.reconnect()
    })

    // 监听错误
    this.socket.on('connect_error', (error) => {
      if (this.options.onError) {
        this.options.onError(error, this.socket!)
      }
      this.reconnect()
    })

    // 设置默认消息处理程序
    this.startQueueProcessor()
  }

  /**
   * 尝试重新连接
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
      // 关闭现有连接
      if (this.socket) {
        this.socket.close()
        this.socket = null
      }
      // 重新连接
      this.connect()
    }, this.options.reconnectInterval)
  }

  /**
   * 关闭连接
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
   * 订阅事件
   */
  on(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      return () => {} // 返回空函数作为取消订阅函数
    }

    const wrappedCallback = (data: any) => {
      if (this.options.onMessage) {
        this.options.onMessage(data, event, this.socket!)
      }
      callback(data)
    }

    this.socket.on(event, wrappedCallback)

    // 返回取消订阅函数
    return () => {
      if (this.socket) {
        this.socket.off(event, wrappedCallback)
      }
    }
  }

  /**
   * 发送消息（带限频）
   */
  emit(event: string, data: any) {
    if (!this.socket) {
      // 如果没有连接，尝试重新连接
      this.connect()
      return false
    }

    // 使用事件名称作为队列名
    if (!this.messageQueue.has(event)) {
      this.messageQueue.set(event, {
        lastSent: 0,
        queue: [],
      })
    }

    // 添加到队列
    const eventQueue = this.messageQueue.get(event)!
    eventQueue.queue.push(data)

    return true
  }

  /**
   * 启动队列处理程序
   */
  private startQueueProcessor() {
    if (this.processQueueTimer) {
      return
    }

    // 每100ms处理一次队列
    this.processQueueTimer = setInterval(() => {
      const now = Date.now()

      this.messageQueue.forEach((eventQueue, event) => {
        // 检查是否可以发送
        if (
          eventQueue.queue.length > 0 &&
          now - eventQueue.lastSent >= this.options.throttleInterval!
        ) {
          // 从队列中取出最新消息
          const data = eventQueue.queue.pop()
          // 清空队列，只发送最新的
          eventQueue.queue = []

          // 发送消息
          if (this.socket) {
            this.socket.emit(event, data)
            eventQueue.lastSent = now
          }
        }
      })
    }, 100)
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return !!this.socket?.connected
  }
}

/**
 * 创建Socket.IO客户端
 */
export const createSocketClient = (socketUrl: string, options?: SocketOptions): SocketClient => {
  return new SocketClient(socketUrl, options)
}
