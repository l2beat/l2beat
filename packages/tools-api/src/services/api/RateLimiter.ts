export class RateLimiter {
  private intervalMs: number
  private lastCall = 0

  constructor(options: { requestsPerSecond: number }) {
    this.intervalMs = 1000 / options.requestsPerSecond
  }

  async wait() {
    const now = Date.now()
    const remaining = this.lastCall + this.intervalMs - now
    this.lastCall = now
    if (remaining > 0) {
      await new Promise((r) => setTimeout(r, remaining))
    }
  }
}
