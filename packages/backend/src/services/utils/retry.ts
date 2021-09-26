export interface RetryOptions {
  minTimeout: number
  maxTimeout?: number
  maxRetryCount: number
  onError?: (error: unknown) => void
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let callCount = 0
    const asyncFn = async () => fn()
    const call = () => asyncFn().then(resolve, onError)
    const onError = (e: unknown) => {
      options.onError?.(e)
      callCount++
      if (callCount > options.maxRetryCount) {
        reject(e)
      } else {
        const ms = Math.min(
          options.maxTimeout ?? Infinity,
          options.minTimeout * 2 ** (callCount - 1)
        )
        setTimeout(call, ms)
      }
    }
    call()
  })
}
