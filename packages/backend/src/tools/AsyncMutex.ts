// Mutex creates a critical section:
// only one caller may run inside it, while others either wait or skip.
export class AsyncMutex {
  private locked = false
  private waiters: Array<() => void> = []

  // Runs the callback exclusively, waiting for earlier callers to finish.
  // Use this when the work must happen and must not overlap with other work.
  async runExclusive<T>(fn: () => Promise<T> | T): Promise<T> {
    const release = this.tryAcquire() ?? (await this.acquire())
    try {
      return await fn()
    } finally {
      release()
    }
  }

  // Tries to run the callback exclusively, but returns immediately if another
  // caller already holds the mutex. Use this for skippable work.
  async tryRunExclusive<T>(fn: () => Promise<T> | T): Promise<T | undefined> {
    const release = this.tryAcquire()
    if (!release) {
      return undefined
    }

    try {
      return await fn()
    } finally {
      release()
    }
  }

  private tryAcquire(): (() => void) | undefined {
    if (this.locked) {
      return undefined
    }
    this.locked = true
    return () => this.release()
  }

  private async acquire(): Promise<() => void> {
    const release = this.tryAcquire()
    if (release) {
      return release
    }

    await new Promise<void>((resolve) => {
      this.waiters.push(resolve)
    })
    return () => this.release()
  }

  private release() {
    const next = this.waiters.shift()
    if (next) {
      next()
      return
    }
    this.locked = false
  }
}
