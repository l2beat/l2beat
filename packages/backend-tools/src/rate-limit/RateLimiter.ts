interface QueuedFunction<T> {
  (): Promise<T>
  resolve: (value: T) => void
  reject: (reason?: unknown) => void
}

export interface RateLimiterOptions {
  callsPerMinute: number
}

const MS_PER_MINUTE = 60 * 1000

export class RateLimiter {
  // biome-ignore lint/suspicious/noExplicitAny: generic type
  private queue: QueuedFunction<any>[] = []
  private lastCalled = 0
  private readonly minTimeElapsed: number

  constructor(options: RateLimiterOptions) {
    this.minTimeElapsed = MS_PER_MINUTE / options.callsPerMinute
  }

  clear(): void {
    this.queue = []
  }

  call<T>(fn: () => T | Promise<T>): Promise<T> {
    const wrapped = (async () => fn()) as QueuedFunction<T>
    this.queue.push(wrapped)

    return new Promise((resolve, reject) => {
      wrapped.resolve = resolve
      wrapped.reject = reject
      this.execute()
    })
  }

  // biome-ignore lint/suspicious/noExplicitAny: generic type
  wrap<A extends any[], R>(fn: (...args: A) => R | Promise<R>) {
    return (...args: A) => this.call(() => fn(...args))
  }

  private execute(): void {
    if (this.queue.length === 0) {
      return
    }

    const now = Date.now()
    const elapsedTime = now - this.lastCalled
    if (elapsedTime < this.minTimeElapsed) {
      setTimeout(() => this.execute(), this.minTimeElapsed - elapsedTime)
      return
    }
    this.lastCalled = now

    const item = this.queue.shift()
    if (!item) {
      return
    }

    item()
      .then((res) => item.resolve(res))
      .catch((err) => item.reject(err))
      .finally(() => this.execute())
  }
}
