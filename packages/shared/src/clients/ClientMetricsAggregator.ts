import { MetricsAggregator } from '@l2beat/backend-tools'

type ClientMetric = {
  duration: number
  size: number
}

type AggregatedClientMetric = {
  sizeAvg: number
  sizeTotal: number
  durationAvg: number
  durationTotal: number
  count: number
}

export class ClientMetricsAggregator extends MetricsAggregator<ClientMetric> {
  public aggregate(metrics: ClientMetric[]): AggregatedClientMetric {
    return metrics.reduce(
      (acc: AggregatedClientMetric, curr, index) => {
        if (index === metrics.length - 1) {
          return {
            sizeAvg: Math.floor((acc.sizeAvg + curr.size) / metrics.length),
            sizeTotal: acc.sizeTotal + curr.size,
            durationAvg: Math.floor(
              (acc.durationAvg + curr.duration) / metrics.length,
            ),
            durationTotal: acc.durationTotal + curr.duration,
            count: acc.count + 1,
          }
        }

        return {
          sizeAvg: acc.sizeAvg + curr.size,
          sizeTotal: acc.sizeTotal + curr.size,
          durationAvg: acc.durationAvg + curr.duration,
          durationTotal: acc.durationTotal + curr.duration,
          count: acc.count + 1,
        }
      },
      { sizeAvg: 0, sizeTotal: 0, durationAvg: 0, durationTotal: 0, count: 0 },
    )
  }
}
