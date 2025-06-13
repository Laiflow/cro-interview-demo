import { describe, it, expect, vi, afterEach } from 'vitest'
import { SocketClient, createSocketClient } from '../socket'

vi.mock('socket.io-client', () => {
  const listeners = {}
  return {
    io: vi.fn(() => ({
      on: vi.fn((event, cb) => {
        listeners[event] = cb
      }),
      off: vi.fn((event, cb) => {
        if (listeners[event] === cb) delete listeners[event]
      }),
      emit: vi.fn(),
      close: vi.fn(),
      connected: true,
    })),
  }
})

// 直接 import io mock
import { io } from 'socket.io-client'

const socketUrl = 'ws://localhost:1234'

describe('SocketClient', () => {
  let client: SocketClient

  afterEach(() => {
    if (client) client.close()
    vi.clearAllMocks()
  })

  it('should connect and call onOpen', () => {
    const onOpen = vi.fn()
    client = new SocketClient(socketUrl, { onOpen })
    // 模拟 connect 事件
    const socket = (io as any).mock.results[0].value
    socket.on.mock.calls.find(([event]: any[]) => event === 'connect')[1]()
    expect(onOpen).toHaveBeenCalled()
  })

  it('should call onClose and reconnect on disconnect', () => {
    const onClose = vi.fn()
    client = new SocketClient(socketUrl, { onClose, reconnectLimit: 1, reconnectInterval: 1 })
    const socket = (io as any).mock.results[0].value
    socket.on.mock.calls.find(([event]: any[]) => event === 'disconnect')[1]()
    expect(onClose).toHaveBeenCalled()
  })

  it('should call onError and reconnect on connect_error', () => {
    const onError = vi.fn()
    client = new SocketClient(socketUrl, { onError, reconnectLimit: 1, reconnectInterval: 1 })
    const socket = (io as any).mock.results[0].value
    const error = new Error('fail')
    socket.on.mock.calls.find(([event]: any[]) => event === 'connect_error')[1](error)
    expect(onError).toHaveBeenCalledWith(error, expect.anything())
  })

  it('should subscribe and unsubscribe to events', () => {
    client = new SocketClient(socketUrl)
    const socket = (io as any).mock.results[0].value
    const cb = vi.fn()
    const unsub = client.on('foo', cb)
    expect(socket.on).toHaveBeenCalledWith('foo', expect.any(Function))
    unsub()
    expect(socket.off).toHaveBeenCalledWith('foo', expect.any(Function))
  })

  it('should close and cleanup timers', () => {
    client = new SocketClient(socketUrl)
    const socket = (io as any).mock.results[0].value
    client.close()
    expect(socket.close).toHaveBeenCalled()
  })

  it('should createSocketClient as a factory', () => {
    const c = createSocketClient(socketUrl)
    expect(c).toBeInstanceOf(SocketClient)
  })
})
