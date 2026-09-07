interface QueuedFunction<T> {
  (): Promise<T>
  resolve: (value: T) => void
  reject: (reason?: unknown) => void
  label: string
  enqueuedAt: number
}

export interface RateLimiterOptions {
  callsPerMinute: number
}

export interface RateLimiterLabelStats {
  /** Calls accepted by `call()` since the last `takeStats()`. */
  enqueued: number
  /** Calls whose function was started since the last `takeStats()`. */
  dispatched: number
  /** Sum of enqueue → dispatch wait in ms over dispatched calls. */
  waitMsTotal: number
  /** Largest enqueue → dispatch wait in ms over dispatched calls. */
  waitMsMax: number
  /** Largest queue length observed right after enqueueing a call with this label. */
  queueDepthMax: number
}

export interface RateLimiterStats {
  /**
   * Per-label counters. A call enqueued in one snapshot window can be
   * dispatched in the next, so `enqueued` and `dispatched` need not balance
   * within a single snapshot.
   */
  labels: Record<string, RateLimiterLabelStats>
  /** Calls started and not yet settled at the time of the snapshot. */
  inFlight: number
  /** Largest in-flight count since the last `takeStats()`. */
  inFlightMax: number
  /** Calls waiting for dispatch at the time of the snapshot. */
  queueLength: number
}

export const DEFAULT_RATE_LIMITER_LABEL = 'default'

const MS_PER_MINUTE = 60 * 1000

export class RateLimiter {
  // biome-ignore lint/suspicious/noExplicitAny: generic type
  private queue: QueuedFunction<any>[] = []
  private lastCalled = 0
  private readonly minTimeElapsed: number
  private labelStats = new Map<string, RateLimiterLabelStats>()
  private inFlight = 0
  private inFlightMax = 0

  constructor(options: RateLimiterOptions) {
    this.minTimeElapsed = MS_PER_MINUTE / options.callsPerMinute
  }

  clear(): void {
    this.queue = []
  }

  get queueLength(): number {
    return this.queue.length
  }

  /**
   * @param label Attributes wait and queue statistics to a consumer (for
   * example the RPC metrics `coreFeature`). It does not affect dispatch
   * order or spacing.
   */
  call<T>(
    fn: () => T | Promise<T>,
    label: string = DEFAULT_RATE_LIMITER_LABEL,
  ): Promise<T> {
    const wrapped = (async () => fn()) as QueuedFunction<T>
    wrapped.label = label
    wrapped.enqueuedAt = Date.now()
    this.queue.push(wrapped)

    const stats = this.statsFor(label)
    stats.enqueued++
    stats.queueDepthMax = Math.max(stats.queueDepthMax, this.queue.length)

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

  /** Returns the statistics collected since the previous call and resets them. */
  takeStats(): RateLimiterStats {
    const labels: Record<string, RateLimiterLabelStats> = {}
    for (const [label, stats] of this.labelStats) {
      labels[label] = stats
    }
    this.labelStats = new Map()

    const result: RateLimiterStats = {
      labels,
      inFlight: this.inFlight,
      inFlightMax: this.inFlightMax,
      queueLength: this.queue.length,
    }
    this.inFlightMax = this.inFlight
    return result
  }

  private statsFor(label: string): RateLimiterLabelStats {
    let stats = this.labelStats.get(label)
    if (!stats) {
      stats = {
        enqueued: 0,
        dispatched: 0,
        waitMsTotal: 0,
        waitMsMax: 0,
        queueDepthMax: 0,
      }
      this.labelStats.set(label, stats)
    }
    return stats
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

    const stats = this.statsFor(item.label)
    const waitMs = now - item.enqueuedAt
    stats.dispatched++
    stats.waitMsTotal += waitMs
    stats.waitMsMax = Math.max(stats.waitMsMax, waitMs)

    this.inFlight++
    this.inFlightMax = Math.max(this.inFlightMax, this.inFlight)

    item()
      .then((res) => item.resolve(res))
      .catch((err) => item.reject(err))
      .finally(() => {
        this.inFlight--
        this.execute()
      })
  }
}
