import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createAnomaliesRouter } from './anomalies'

describe(createAnomaliesRouter.name, () => {
  it('returns flagged routes with interpretation text', async () => {
    const flatHistoryDay = (offsetDays: number) => ({
      day: UnixTime.toStartOf(
        UnixTime(1_700_000_000) + offsetDays * UnixTime.DAY,
        'day',
      ),
      id: 'across',
      bridgeType: 'nonMinting' as const,
      srcChain: 'ethereum',
      dstChain: 'arbitrum',
      transferCount: 100,
      identifiedCount: 95,
      totalSrcValueUsd: 1_000_000,
      totalDstValueUsd: 1_000_000,
    })
    const getDailySeries = mockFn().resolvesTo(
      Array.from({ length: 14 }, (_, i) => flatHistoryDay(-13 + i)),
    )
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
    const row = result.aggregatedItems[0]
    expect(row?.id).toEqual('across')
    expect(row?.bridgeType).toEqual('nonMinting')
    expect(row?.srcChain).toEqual('ethereum')
    expect(row?.dstChain).toEqual('arbitrum')
    expect(row?.interpretation.length).toBeGreaterThan(0)
    expect(result.aggregateSideMismatchDiffPercent).toEqual(30)
    expect(result.aggregateSideMismatchMinVolumeUsd).toEqual(500_000)
  })

  it('returns aggregate details for a selected route', async () => {
    const getDailySeriesByGroup = mockFn().resolvesTo([
      {
        timestamp: UnixTime(1_700_000_000),
        id: 'stargate',
        bridgeType: 'nonMinting',
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        transferCount: 4,
        identifiedCount: 4,
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
        getDailySeriesByGroup,
      }),
      interopTransfer: mockObject<Database['interopTransfer']>({}),
    })

    const callerFactory = createCallerFactory(createAnomaliesRouter())
    const caller = callerFactory({
      headers: new Headers(),
      db,
      session: { email: 'dev@l2beat.com' },
    })

    const result = await caller.aggregateDetails({
      id: 'stargate',
      bridgeType: 'nonMinting',
      srcChain: 'ethereum',
      dstChain: 'arbitrum',
    })

    expect(getDailySeriesByGroup).toHaveBeenCalledWith(
      'stargate',
      'nonMinting',
      'ethereum',
      'arbitrum',
    )
    expect(result.id).toEqual('stargate')
    expect(result.bridgeType).toEqual('nonMinting')
    expect(result.items[0]?.avgDuration).toEqual(60)
    expect(result.items[0]?.day).toEqual('2023-11-14')
  })
})
