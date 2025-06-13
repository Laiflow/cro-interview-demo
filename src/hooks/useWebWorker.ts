import { useRef, useState, useEffect, useCallback } from 'react'

export interface WebWorkerOptions {
  /**
   * Whether to terminate the Worker when the component unmounts
   */
  terminateOnUnmount?: boolean
}

/**
 * Create and use Web Worker
 * @param workerFunction Worker function string or Worker file URL
 * @param options Options
 * @returns Worker controller
 */
export const useWebWorker = <TData = unknown, TResult = unknown>(
  workerFunction: string | (() => void) | URL,
  options: WebWorkerOptions = {}
) => {
  const workerRef = useRef<Worker | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const { terminateOnUnmount = true } = options

  // Create Worker
  const createWorker = useCallback(() => {
    try {
      if (workerRef.current) {
        return
      }

      // If function, convert to URL
      if (typeof workerFunction === 'function') {
        const fnString = `(${workerFunction.toString()})()`
        const blob = new Blob([fnString], { type: 'application/javascript' })
        workerRef.current = new Worker(URL.createObjectURL(blob))
      }
      // If string
      else if (typeof workerFunction === 'string') {
        // Check if inline code or URL
        if (
          workerFunction.startsWith('http') ||
          workerFunction.startsWith('/') ||
          workerFunction.startsWith('./')
        ) {
          // Treat as URL
          workerRef.current = new Worker(workerFunction)
        } else {
          // Treat as inline code
          const blob = new Blob([workerFunction], {
            type: 'application/javascript',
          })
          workerRef.current = new Worker(URL.createObjectURL(blob))
        }
      }
      // If URL object
      else if (workerFunction instanceof URL) {
        workerRef.current = new Worker(workerFunction)
      }

      // Clear error
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }, [workerFunction])

  // Terminate Worker
  const terminateWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
      setIsRunning(false)
    }
  }, [])

  // Send message to Worker, and return Promise
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

        // Create single message handler
        const messageHandler = (e: MessageEvent) => {
          workerRef.current?.removeEventListener('message', messageHandler)
          workerRef.current?.removeEventListener('error', errorHandler)
          setIsRunning(false)
          resolve(e.data as TResult)
        }

        // Create single error handler
        const errorHandler = (e: ErrorEvent) => {
          workerRef.current?.removeEventListener('message', messageHandler)
          workerRef.current?.removeEventListener('error', errorHandler)
          setIsRunning(false)
          const error = new Error(e.message)
          setError(error)
          reject(error)
        }

        // Add event handler
        workerRef.current.addEventListener('message', messageHandler)
        workerRef.current.addEventListener('error', errorHandler)

        // Send message
        workerRef.current.postMessage(data)
      })
    },
    [createWorker]
  )

  // Create Worker when component mounts, terminate when component unmounts
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
