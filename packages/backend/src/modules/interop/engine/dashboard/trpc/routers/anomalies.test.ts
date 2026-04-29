import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createAnomaliesRouter } from './anomalies'

describe(createAnomaliesRouter.name, () => {
  it('returns the anomalies summary payload', async () => {
    const getDailySeries = mockFn().resolvesTo([
      pointAt(-2),
      pointAt(-1),
      pointAt(0),
    ])
    const db = mockObject<Database>({
      aggregatedInteropTransfer: mockObject<
        Database['aggregatedInteropTransfer']
      >({
        getDailySeries,
      }),
      interopTransfer: mockObject<Database['interopTransfer']>({}),
    })

    const callerFactory = createCallerFactory(createAnomaliesRouter())
    const caller = callerFactory({
      headers: new Headers(),
      db,
      session: { email: 'dev@l2beat.com' },
    })

    const result = await caller.summary()

    expect(getDailySeries).toHaveBeenCalledTimes(1)
    expect(result.aggregatedItems).toHaveLength(1)
    expect(result.aggregatedItems[0]?.id).toEqual('across')
    expect(
      result.aggregatedItems[0]?.interpretation.includes('Flat line'),
    ).toEqual(true)
    expect(result.aggregateValueDiffAlertThresholdPercent).toEqual(5)
  })

  it('returns aggregate details for a selected id', async () => {
    const getDailySeriesById = mockFn().resolvesTo([
      {
        timestamp: UnixTime(1_700_000_000),
        id: 'stargate',
        transferCount: 4,
        transfersWithDurationCount: 2,
        totalDurationSum: 120,
        totalSrcValueUsd: 250,
        totalDstValueUsd: 240,
      },
    ])
    const db = mockObject<Database>({
      aggregatedInteropTransfer: mockObject<
        Database['aggregatedInteropTransfer']
      >({
        getDailySeriesById,
      }),
      interopTransfer: mockObject<Database['interopTransfer']>({}),
    })

    const callerFactory = createCallerFactory(createAnomaliesRouter())
    const caller = callerFactory({
      headers: new Headers(),
      db,
      session: { email: 'dev@l2beat.com' },
    })

    const result = await caller.aggregateDetails({ id: 'stargate' })

    expect(getDailySeriesById).toHaveBeenCalledWith('stargate')
    expect(result.id).toEqual('stargate')
    expect(result.items[0]?.avgDuration).toEqual(60)
    expect(result.items[0]?.day).toEqual('2023-11-14')
  })
})

function pointAt(offsetDays: number) {
  const day = UnixTime.toStartOf(
    UnixTime(1_700_000_000) + offsetDays * UnixTime.DAY,
    'day',
  )

  return {
    day,
    id: 'across',
    transferCount: 10,
    totalSrcValueUsd: 1_000,
    totalDstValueUsd: 1_000,
  }
}
