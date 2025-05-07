import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSocketWithWorker } from "../useSocketWithWorker";
import { useWebWorker } from "../useWebWorker";

// 模拟 useWebWorker hook
vi.mock("../useWebWorker", () => ({
  useWebWorker: vi.fn(),
}));

describe("useSocketWithWorker", () => {
  // 模拟 worker 通信
  const mockWorkerMessages = vi.fn();
  let messageHandlers: Record<string, (payload: any) => void> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    messageHandlers = {};

    // 模拟 useWebWorker 返回值
    (useWebWorker as any).mockReturnValue({
      postMessage: (message: any) => {
        mockWorkerMessages(message);
        return new Promise((resolve) => {
          // 连接消息的处理
          if (message.action === "CONNECT") {
            // 模拟连接成功
            setTimeout(() => {
              messageHandlers["message"]?.({
                data: { type: "SOCKET_OPEN" },
              });
              resolve({ type: "SOCKET_OPEN" });
            }, 50);
          }

          // 订阅消息的处理
          if (message.action === "SUBSCRIBE") {
            setTimeout(() => {
              messageHandlers["message"]?.({
                data: {
                  type: "SOCKET_SUBSCRIBED",
                  payload: { event: message.payload.event },
                },
              });
              resolve({
                type: "SOCKET_SUBSCRIBED",
                payload: { event: message.payload.event },
              });
            }, 50);
          }

          // 发送消息的处理
          if (message.action === "EMIT") {
            setTimeout(() => {
              messageHandlers["message"]?.({
                data: {
                  type: "SOCKET_EMIT_QUEUED",
                  payload: {
                    event: message.payload.event,
                    data: message.payload.data,
                  },
                },
              });
              resolve({
                type: "SOCKET_EMIT_QUEUED",
                payload: {
                  event: message.payload.event,
                  data: message.payload.data,
                },
              });
            }, 50);
          }

          // 断开连接的处理
          if (message.action === "DISCONNECT") {
            setTimeout(() => {
              messageHandlers["message"]?.({
                data: { type: "SOCKET_CLOSED" },
              });
              resolve({ type: "SOCKET_CLOSED" });
            }, 50);
          }
        });
      },
      terminate: vi.fn(),
      isRunning: false,
      error: 'test',
      worker: {},
    });

    // 模拟监听 worker 消息的函数
    global.addEventListener = vi.fn((event, handler) => {
      if (event === "message") {
        messageHandlers[event] = handler;
      }
    });

    global.removeEventListener = vi.fn((event) => {
      if (event === "message") {
        delete messageHandlers[event];
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should connect to socket on init", async () => {
    // 渲染 hook
    const { result } = renderHook(() =>
      useSocketWithWorker("wss://example.com/socket", {
        reconnectLimit: 3,
        reconnectInterval: 1000,
        throttleInterval: 1000,
      }),
    );

    // 验证是否发送了 CONNECT 消息
    expect(mockWorkerMessages).toHaveBeenCalledWith({
      action: "CONNECT",
      payload: {
        url: "wss://example.com/socket",
        reconnectLimit: 3,
        reconnectInterval: 1000,
        throttleInterval: 1000,
      },
    });

    // 等待socket连接成功
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
  });

  it("should emit messages", async () => {
    const { result } = renderHook(() =>
      useSocketWithWorker("wss://example.com/socket"),
    );

    // 等待连接成功
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    // 发送消息
    await act(async () => {
      result.current.emit("test_event", { foo: "bar" });
    });

    // 验证是否发送了 EMIT 消息
    expect(mockWorkerMessages).toHaveBeenCalledWith({
      action: "EMIT",
      payload: {
        event: "test_event",
        data: { foo: "bar" },
      },
    });
  });


  it("should handle manual option (not auto connect)", async () => {
    renderHook(() =>
      useSocketWithWorker("wss://example.com/socket", { manual: true }),
    );
    // manual为true时不会自动连接
    expect(mockWorkerMessages).not.toHaveBeenCalledWith(
      expect.objectContaining({ action: "CONNECT" }),
    );
  });

 

  // it("should handle SOCKET_ERROR and WORKER_ERROR from worker", async () => {
  //   const { result } = renderHook(() =>
  //     useSocketWithWorker("wss://example.com/socket"),
  //   );

  //   // SOCKET_ERROR
  //   act(() => {
  //     messageHandlers["message"]?.({
  //       data: {
  //         type: "SOCKET_ERROR",
  //         payload: { message: "socket error" },
  //       },
  //     });
  //   });
  //   expect(result.current.error?.message).toBe("socket error");

  //   // WORKER_ERROR
  //   act(() => {
  //     messageHandlers["message"]?.({
  //       data: {
  //         type: "WORKER_ERROR",
  //         payload: { message: "worker error" },
  //       },
  //     });
  //   });
  //   expect(result.current.error).toBeInstanceOf(Error);
  //   expect(result.current.error?.message).toBe("worker error");
  // });

  it("should handle isLoading state", async () => {
    const { result } = renderHook(() =>
      useSocketWithWorker("wss://example.com/socket"),
    );
    // 连接时 isLoading 应为 true
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
  });

  it("should handle connect and disconnect manually", async () => {
    const { result } = renderHook(() =>
      useSocketWithWorker("wss://example.com/socket", { manual: true }),
    );

    // 手动连接
    await act(async () => {
      await result.current.connect();
    });
    expect(mockWorkerMessages).toHaveBeenCalledWith(
      expect.objectContaining({ action: "CONNECT" }),
    );

    // 手动断开
    await act(async () => {
      await result.current.disconnect();
    });
    expect(mockWorkerMessages).toHaveBeenCalledWith(
      expect.objectContaining({ action: "DISCONNECT" }),
    );
  });

 

  it("should handle reconnection with provided options", async () => {
    const { result } = renderHook(() =>
      useSocketWithWorker("wss://example.com/socket", {
        reconnectLimit: 2,
        reconnectInterval: 500,
        throttleInterval: 1000,
      }),
    );

    // 等待连接成功
    await waitFor(() => {
      expect(result.current.isConnected).toBe(false);
    });

    // 模拟连接断开
    await act(async () => {
      messageHandlers["message"]?.({
        data: { type: "SOCKET_CLOSE" },
      });
    });

    // 等待断开连接状态
    await waitFor(() => {
      expect(result.current.isConnected).toBe(false);
    });

    // 等待重连成功
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
  });


  it("should handle worker runtime errors", async () => {
    // 模拟运行时的 worker 错误
    (useWebWorker as any).mockReturnValue(({
      postMessage: vi.fn(() => Promise.reject(new Error("Worker runtime error"))),
      terminate: vi.fn(),
      isRunning: false,
      error: null,
      worker: {},
    }));

    const { result } = renderHook(() =>
      useSocketWithWorker("wss://runtime-error.example.com")
    );

    
    await waitFor(() => {
      console.log('mylog-result',result)
      expect(result.current.error).toEqual(new Error("Worker runtime error"));
      expect(result.current.isLoading).toBe(false);
    });
  });

});
