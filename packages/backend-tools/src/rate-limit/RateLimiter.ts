interface QueuedFunction<T> {
  (): Promise<T>
  resolve: (value: T) => void
  reject: (reason?: unknown) => void
  label: string
  enqueuedAt: number
}

export interface RateLimiterOptions {
  callsPerMinute: number
  /**
   * Share of the rate given up when the provider refuses a call, at most
   * once a minute, only once a call has got through since the last step,
   * and down to a tenth of `callsPerMinute`. The rate stays down until the
   * process restarts: it never climbs back by itself, so a limiter that
   * has settled no longer draws refusals. Zero, the default, keeps the
   * rate fixed.
   */
  stepDownOnThrottle?: number
  /**
   * Called on every step. A rate that never moved was never tested, so the
   * steps, not the rate alone, say whether it was found.
   */
  onStepDown?: (step: RateLimiterStepDown) => void
}

export interface RateLimiterStepDown {
  from: number
  to: number
  /** At the floor the refusals are not about the rate, or not only. */
  atFloor: boolean
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
/**
 * A burst of calls is refused together, and each refusal reports in. One
 * step a minute lets the lower rate show its effect before the next.
 */
const STEP_DOWN_INTERVAL_MS = MS_PER_MINUTE
/** Refusals that are not about the rate must not grind a client to a halt. */
const LOWEST_SHARE_OF_RATE = 0.1

export class RateLimiter {
  /** The configured rate, which the effective one never exceeds. */
  readonly callsPerMinute: number
  // biome-ignore lint/suspicious/noExplicitAny: generic type
  private queue: QueuedFunction<any>[] = []
  private lastCalled = 0
  private effective: number
  private readonly stepDownOnThrottle: number
  private readonly onStepDown?: (step: RateLimiterStepDown) => void
  private steppedDownAt = Number.NEGATIVE_INFINITY
  /**
   * Whether a call has succeeded since the last step. A provider that
   * locks an address out refuses every call for minutes, whatever the
   * rate, so until one gets through more refusals say nothing new.
   */
  private gotThrough = true
  private wakeUpTimer: ReturnType<typeof setTimeout> | undefined
  private labelStats = new Map<string, RateLimiterLabelStats>()
  private inFlight = 0
  private inFlightMax = 0

  constructor(options: RateLimiterOptions) {
    this.callsPerMinute = options.callsPerMinute
    this.effective = options.callsPerMinute
    this.stepDownOnThrottle = options.stepDownOnThrottle ?? 0
    this.onStepDown = options.onStepDown
  }

  /**
   * The rate dispatch is paced at. Below `callsPerMinute` once refusals
   * have stepped it down: that is the rate the provider was seen to take.
   */
  get effectiveCallsPerMinute(): number {
    return this.effective
  }

  private get minTimeElapsed(): number {
    return MS_PER_MINUTE / this.effective
  }

  /**
   * Reports that the provider refused a call for the rate (HTTP 429).
   * Does nothing unless `stepDownOnThrottle` is set.
   */
  throttled(): void {
    if (!this.mayStepDown()) {
      return
    }
    const from = this.effective
    const floor = this.callsPerMinute * LOWEST_SHARE_OF_RATE
    const to = Math.max(floor, from * (1 - this.stepDownOnThrottle))
    if (to === from) {
      return
    }
    this.steppedDownAt = Date.now()
    this.gotThrough = false
    this.effective = to
    this.onStepDown?.({ from, to, atFloor: to === floor })
  }

  private mayStepDown(): boolean {
    return (
      this.stepDownOnThrottle !== 0 &&
      this.gotThrough &&
      Date.now() - this.steppedDownAt >= STEP_DOWN_INTERVAL_MS
    )
  }

  clear(): void {
    this.queue = []
    if (this.wakeUpTimer !== undefined) {
      clearTimeout(this.wakeUpTimer)
      this.wakeUpTimer = undefined
    }
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
    if (this.queue.length === 0 || this.wakeUpTimer !== undefined) {
      return
    }

    const now = Date.now()
    const elapsedTime = now - this.lastCalled
    if (elapsedTime < this.minTimeElapsed) {
      this.scheduleNextCall()
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
      .then((res) => {
        this.gotThrough = true
        item.resolve(res)
      })
      .catch((err) => item.reject(err))
      .finally(() => {
        this.inFlight--
        this.execute()
      })

    // Pace queued calls independently of when in-flight calls finish.
    this.scheduleNextCall()
  }

  private scheduleNextCall(): void {
    if (this.queue.length === 0 || this.wakeUpTimer !== undefined) {
      return
    }

    const delay = Math.max(
      0,
      this.minTimeElapsed - (Date.now() - this.lastCalled),
    )
    this.wakeUpTimer = setTimeout(() => {
      this.wakeUpTimer = undefined
      this.execute()
    }, delay)
  }
}
