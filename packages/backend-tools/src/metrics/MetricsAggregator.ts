import type { Logger } from '../logger/Logger'

export interface MetricsAggregatorOptions {
  logger: Logger
  flushInterval?: number
}

export abstract class MetricsAggregator<T> {
  buffer: T[] = []

  constructor(private readonly $: MetricsAggregatorOptions) {
    if ($.logger.metricsEnabled) {
      this.start()
    }
  }

  public push(metric: T): void {
    this.buffer.push(metric)
  }

  private start(): void {
    const interval = setInterval(async () => {
      await this.flush()
    }, this.$.flushInterval ?? 30_000)

    // object will not require the Node.js event loop to remain active
    // nodejs.org/api/timers.html#timers_timeout_unref
    interval.unref()
  }

  private flush() {
    if (!this.buffer.length) {
      return
    }

    const metrics = [...this.buffer]

    //clear buffer
    this.buffer.splice(0)

    const aggregatedMetrics = this.aggregate(metrics)

    this.$.logger.metric('Http metrics', { ...aggregatedMetrics })
  }

  protected abstract aggregate(metrics: T[]): object
}
