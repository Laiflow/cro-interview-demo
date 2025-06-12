import { useRef, useState, useEffect, useCallback } from 'react'

export interface WebWorkerOptions {
  /**
   * 是否在组件卸载时终止 Worker
   */
  terminateOnUnmount?: boolean
}

/**
 * 创建并使用 Web Worker
 * @param workerFunction Worker 函数体字符串，或者Worker文件URL
 * @param options 配置项
 * @returns Worker 控制器
 */
export const useWebWorker = <TData = unknown, TResult = unknown>(
  workerFunction: string | (() => void) | URL,
  options: WebWorkerOptions = {}
) => {
  const workerRef = useRef<Worker | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const { terminateOnUnmount = true } = options

  // 创建 Worker
  const createWorker = useCallback(() => {
    try {
      if (workerRef.current) {
        return
      }

      // 如果是函数，需要转换为 URL
      if (typeof workerFunction === 'function') {
        const fnString = `(${workerFunction.toString()})()`
        const blob = new Blob([fnString], { type: 'application/javascript' })
        workerRef.current = new Worker(URL.createObjectURL(blob))
      }
      // 如果是字符串
      else if (typeof workerFunction === 'string') {
        // 检查是否是内联代码还是URL
        if (
          workerFunction.startsWith('http') ||
          workerFunction.startsWith('/') ||
          workerFunction.startsWith('./')
        ) {
          // 作为URL处理
          workerRef.current = new Worker(workerFunction)
        } else {
          // 作为内联代码处理
          const blob = new Blob([workerFunction], {
            type: 'application/javascript',
          })
          workerRef.current = new Worker(URL.createObjectURL(blob))
        }
      }
      // 如果是URL对象
      else if (workerFunction instanceof URL) {
        workerRef.current = new Worker(workerFunction)
      }

      // 清除错误
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }, [workerFunction])

  // 终止 Worker
  const terminateWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
      setIsRunning(false)
    }
  }, [])

  // 发送消息给 Worker，并返回Promise
  const postMessage = useCallback(
    (data: TData): Promise<TResult> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          createWorker()
        }

        if (!workerRef.current) {
          reject(new Error('Failed to create Worker'))
          return
        }

        setIsRunning(true)

        // 创建单次消息处理程序
        const messageHandler = (e: MessageEvent) => {
          workerRef.current?.removeEventListener('message', messageHandler)
          workerRef.current?.removeEventListener('error', errorHandler)
          setIsRunning(false)
          resolve(e.data as TResult)
        }

        // 创建单次错误处理程序
        const errorHandler = (e: ErrorEvent) => {
          workerRef.current?.removeEventListener('message', messageHandler)
          workerRef.current?.removeEventListener('error', errorHandler)
          setIsRunning(false)
          const error = new Error(e.message)
          setError(error)
          reject(error)
        }

        // 添加事件处理程序
        workerRef.current.addEventListener('message', messageHandler)
        workerRef.current.addEventListener('error', errorHandler)

        // 发送消息
        workerRef.current.postMessage(data)
      })
    },
    [createWorker]
  )

  // 组件挂载时创建 Worker，卸载时终止 Worker
  useEffect(() => {
    createWorker()

    return () => {
      if (terminateOnUnmount) {
        terminateWorker()
      }
    }
  }, [createWorker, terminateOnUnmount, terminateWorker])

  return {
    postMessage,
    terminate: terminateWorker,
    isRunning,
    error,
    worker: workerRef.current,
  }
}
