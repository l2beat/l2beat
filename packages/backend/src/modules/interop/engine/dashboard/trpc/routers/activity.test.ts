import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createActivityRouter } from './activity'

describe(createActivityRouter.name, () => {
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
      // Flat at 300/day so the flat-line signal clears the count relevance
      // floor (250) and the route stays flagged.
      transferCount: 300,
      identifiedCount: 285,
      totalSrcValueUsd: 1_000_000,
      totalDstValueUsd: 1_000_000,
    })
    const getDailySeries = vi
      .fn()
      .mockResolvedValue(
        Array.from({ length: 14 }, (_, i) => flatHistoryDay(-13 + i)),
      )
    const db = {
      aggregatedInteropTransfer: {
        getDailySeries,
      } as unknown as Database['aggregatedInteropTransfer'],
      interopTransfer: {} as unknown as Database['interopTransfer'],
    } as unknown as Database

    const callerFactory = createCallerFactory(createActivityRouter())
    const caller = callerFactory({
      headers: new Headers(),
      db,
      session: { email: 'dev@l2beat.com' },
    })

    const result = await caller.summary()

    expect(getDailySeries).toHaveBeenCalledTimes(1)
    expect(result.aggregatedItems).toHaveLength(1)
    const row = result.aggregatedItems[0]
    expect(row?.id).toStrictEqual('across')
    expect(row?.bridgeType).toStrictEqual('nonMinting')
    expect(row?.srcChain).toStrictEqual('ethereum')
    expect(row?.dstChain).toStrictEqual('arbitrum')
    expect(row?.interpretation.length).toBeGreaterThan(0)
    expect(result.aggregateSideMismatchDiffPercent).toStrictEqual(50)
    expect(result.aggregateSideMismatchMinVolumeUsd).toStrictEqual(2_000_000)
  })

  it('returns aggregate details for a selected route', async () => {
    const getDailySeriesByGroup = vi.fn().mockResolvedValue([
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
    const db = {
      aggregatedInteropTransfer: {
        getDailySeriesByGroup,
      } as unknown as Database['aggregatedInteropTransfer'],
      interopTransfer: {} as unknown as Database['interopTransfer'],
    } as unknown as Database

    const callerFactory = createCallerFactory(createActivityRouter())
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
    expect(result.id).toStrictEqual('stargate')
    expect(result.bridgeType).toStrictEqual('nonMinting')
    expect(result.items[0]?.avgDuration).toStrictEqual(60)
    expect(result.items[0]?.day).toStrictEqual('2023-11-14')
  })
})
