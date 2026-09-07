import { Logger, type RateLimiter } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import { ClientMetricsAggregator } from './ClientMetricsAggregator'

describe(ClientMetricsAggregator.name, () => {
  it('aggregates pushed metrics per label', () => {
    const aggregator = new ClientMetricsAggregator({ logger: Logger.SILENT })

    const result = aggregator.aggregate([
      { duration: 10, size: 100, label: 'a' },
      { duration: 30, size: 300, label: 'a' },
      { duration: 5, size: 50, label: 'b' },
    ])

    expect(result).toEqual([
      {
        label: 'a',
        count: 2,
        durationTotal: 40,
        durationAvg: 20,
        sizeTotal: 400,
        sizeAvg: 200,
      },
      {
        label: 'b',
        count: 1,
        durationTotal: 5,
        durationAvg: 5,
        sizeTotal: 50,
        sizeAvg: 50,
      },
    ])
  })

  it('merges rate limiter statistics, including labels without completed calls', () => {
    const rateLimiter = mockObject<RateLimiter>({
      takeStats: () => ({
        labels: {
          a: {
            enqueued: 3,
            dispatched: 2,
            waitMsTotal: 300,
            waitMsMax: 200,
            queueDepthMax: 4,
          },
          queued: {
            enqueued: 1,
            dispatched: 0,
            waitMsTotal: 0,
            waitMsMax: 0,
            queueDepthMax: 5,
          },
        },
        inFlight: 1,
        inFlightMax: 7,
        queueLength: 1,
      }),
      callsPerMinute: 120,
    })
    const aggregator = new ClientMetricsAggregator({
      logger: Logger.SILENT,
      rateLimiter,
    })

    const result = aggregator.aggregate([
      { duration: 10, size: 100, label: 'a' },
    ])

    expect(result).toEqual([
      {
        label: 'a',
        count: 1,
        durationTotal: 10,
        durationAvg: 10,
        sizeTotal: 100,
        sizeAvg: 100,
        waitTotal: 300,
        waitAvg: 150,
        waitMax: 200,
        queueDepthMax: 4,
        limiterInFlightMax: 7,
        callsPerMinute: 120,
      },
      {
        label: 'queued',
        count: 0,
        durationTotal: 0,
        durationAvg: 0,
        sizeTotal: 0,
        sizeAvg: 0,
        waitTotal: 0,
        waitAvg: 0,
        waitMax: 0,
        queueDepthMax: 5,
        limiterInFlightMax: 7,
        callsPerMinute: 120,
      },
    ])
    expect(rateLimiter.takeStats).toHaveBeenCalledTimes(1)
  })

  it('returns nothing when there is no data', () => {
    const aggregator = new ClientMetricsAggregator({ logger: Logger.SILENT })
    expect(aggregator.aggregate([])).toEqual([])
  })
})
