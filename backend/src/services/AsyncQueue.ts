interface QueuedFunction<T> {
  (): Promise<T>
  resolve: (value: T) => void
  reject: (reason?: unknown) => void
}

export interface QueueOptions {
  length: number
  rateLimitPerMinute?: number
}

const MS_PER_MINUTE = 60 * 1000

export class AsyncQueue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private queue: QueuedFunction<any>[] = []
  private processing = 0
  private lastCalled = 0
  private length: number
  private minTimeElapsed = 0

  constructor(options: QueueOptions) {
    this.length = options.length
    if (options.rateLimitPerMinute) {
      this.minTimeElapsed = MS_PER_MINUTE / options.rateLimitPerMinute
    }
  }

  enqueue<T>(fn: () => Promise<T>): Promise<T> {
    const wrapped = (() => fn()) as QueuedFunction<T>
    this.queue.push(wrapped)

    return new Promise((resolve, reject) => {
      wrapped.resolve = resolve
      wrapped.reject = reject
      this.dequeue()
    })
  }

  private dequeue() {
    if (this.processing >= this.length || this.queue.length === 0) {
      return
    }

    const now = Date.now()
    const elapsedTime = now - this.lastCalled
    if (elapsedTime < this.minTimeElapsed) {
      setTimeout(() => this.dequeue(), this.minTimeElapsed - elapsedTime)
      return
    }
    this.lastCalled = now

    const item = this.queue.shift()
    if (!item) {
      return
    }
    this.processing += 1

    Promise.resolve(item())
      .then((res) => item.resolve(res))
      .catch((err) => item.reject(err))
      .finally(() => {
        this.processing -= 1
        this.dequeue()
      })
  }
}
