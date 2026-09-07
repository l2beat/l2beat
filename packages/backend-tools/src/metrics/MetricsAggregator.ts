import type { Logger } from '../logger/Logger'

export interface MetricsAggregatorOptions {
  logger: Logger
  flushInterval?: number
}

export abstract class MetricsAggregator<T> {
  buffer: T[] = []

  static metricsEnabled = true
  static setMetricsEnabled(value: boolean) {
    MetricsAggregator.metricsEnabled = value
  }

  constructor(private readonly $: MetricsAggregatorOptions) {
    if (MetricsAggregator.metricsEnabled) {
      this.start()
    }
  }

  public push(metric: T): void {
    this.buffer.push(metric)
  }

  private start(): void {
    const interval = setInterval(
      () => this.flush(),
      this.$.flushInterval ?? 30_000,
    )
    // object will not require the Node.js event loop to remain active
    // nodejs.org/api/timers.html#timers_timeout_unref
    interval.unref()
  }

  private flush() {
    const metrics = [...this.buffer]

    //clear buffer
    this.buffer.splice(0)

    // `aggregate` is called even for an empty buffer so implementations can
    // report state that is not derived from pushed metrics (e.g. queue waits).
    const aggregated = this.aggregate(metrics)
    const entries = Array.isArray(aggregated) ? aggregated : [aggregated]

    for (const entry of entries) {
      this.$.logger.info('Http metrics', { ...entry })
    }
  }

  /**
   * Returns one object per log line to emit. Return an empty array to emit
   * nothing.
   */
  protected abstract aggregate(metrics: T[]): object | object[]
}
