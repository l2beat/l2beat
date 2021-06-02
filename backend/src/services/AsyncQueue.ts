interface QueuedFunction {
  (): Promise<any>
  resolve: (value: any) => void
  reject: (reason?: any) => void
}

export class AsyncQueue {
  private queue: QueuedFunction[] = []
  private processing = 0

  constructor(private length: number = 1) {}

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
