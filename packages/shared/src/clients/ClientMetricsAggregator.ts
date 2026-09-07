import {
  MetricsAggregator,
  type MetricsAggregatorOptions,
  type RateLimiter,
} from '@l2beat/backend-tools'

export interface ClientMetric {
  duration: number
  size: number
  /** Consumer attribution, e.g. the RPC metrics `coreFeature`. */
  label: string
}

export interface AggregatedClientMetric {
  label: string
  count: number
  durationTotal: number
  durationAvg: number
  sizeTotal: number
  sizeAvg: number
  /** Rate limiter enqueue → dispatch wait for this label, in ms. */
  waitTotal?: number
  waitAvg?: number
  waitMax?: number
  /** Largest limiter queue length observed when enqueueing this label. */
  queueDepthMax?: number
  /** Largest number of concurrently running calls across all labels of the limiter. */
  limiterInFlightMax?: number
}

export interface ClientMetricsAggregatorOptions
  extends MetricsAggregatorOptions {
  /** When provided, its statistics are merged into the per-label output on every flush. */
  rateLimiter?: RateLimiter
}

export class ClientMetricsAggregator extends MetricsAggregator<ClientMetric> {
  constructor(private readonly options: ClientMetricsAggregatorOptions) {
    super(options)
  }

  public aggregate(metrics: ClientMetric[]): AggregatedClientMetric[] {
    const byLabel = new Map<string, AggregatedClientMetric>()
    const entryFor = (label: string) => {
      let entry = byLabel.get(label)
      if (!entry) {
        entry = {
          label,
          count: 0,
          durationTotal: 0,
          durationAvg: 0,
          sizeTotal: 0,
          sizeAvg: 0,
        }
        byLabel.set(label, entry)
      }
      return entry
    }

    for (const metric of metrics) {
      const entry = entryFor(metric.label)
      entry.count++
      entry.durationTotal += metric.duration
      entry.sizeTotal += metric.size
    }

    const limiter = this.options.rateLimiter?.takeStats()
    if (limiter) {
      for (const [label, stats] of Object.entries(limiter.labels)) {
        const entry = entryFor(label)
        entry.waitTotal = stats.waitMsTotal
        entry.waitAvg =
          stats.dispatched > 0
            ? Math.floor(stats.waitMsTotal / stats.dispatched)
            : 0
        entry.waitMax = stats.waitMsMax
        entry.queueDepthMax = stats.queueDepthMax
      }
    }

    const result = [...byLabel.values()]
    for (const entry of result) {
      if (entry.count > 0) {
        entry.durationAvg = Math.floor(entry.durationTotal / entry.count)
        entry.sizeAvg = Math.floor(entry.sizeTotal / entry.count)
      }
      if (limiter) {
        entry.limiterInFlightMax = limiter.inFlightMax
      }
    }
    return result
  }
}
