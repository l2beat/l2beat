interface QueuedFunction {
  (): Promise<any>
  resolve: (value: any) => void
  reject: (reason?: any) => void
}

export interface QueueOptions {
  length: number
  rateLimitPerMinute?: number
}

const MS_PER_MINUTE = 60 * 1000

export class AsyncQueue {
  private queue: QueuedFunction[] = []
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
    const wrapped = (() => fn()) as QueuedFunction
    this.queue.push(wrapped)

    return new Promise((resolve, reject) => {
      wrapped.resolve = resolve
      wrapped.reject = reject
      this.dequeue()
    })
  }

  private dequeue() {
    if (this.processing > this.length) {
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
