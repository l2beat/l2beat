import type {
  ActivityRecord,
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
  Database,
  TokenValueRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import type { TokenDbClient } from '@l2beat/token-backend'
import { describe, expect, it, type Mock, vi } from 'vitest'
import { createCallerFactory } from '../../../../../../trpc/init'
import {
  getLargestProtocolVolumeIncrease,
  getLargestSourceChainVolumeIncrease,
  getLargestTokenVolumeIncrease,
  getLargestTvsIncrease,
  getLargestUopsCountIncrease,
  getTopDestinationChainByInflowAtTimestamp,
  getTopPathByVolumeAtTimestamp,
} from '../../impls/highlights/highlightsCalculations'
import { createHighlightsRouter } from './highlights'

const DEFAULT_CHAINS = [
  { id: 'ethereum', type: 'evm' },
  { id: 'optimism', type: 'evm' },
] as const

describe(createHighlightsRouter.name, () => {
  it('returns highlights for the latest aggregate snapshot', async () => {
    const latestTimestamp = UnixTime(1_700_000_000)
    const previousTimestamp = latestTimestamp - UnixTime.DAY
    const olderTimestamp = previousTimestamp - UnixTime.DAY

    const currentTransfers = [
      transferRecord({
        id: 'across',
        timestamp: latestTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        transferCount: 100,
        srcValueUsd: 900_000,
        dstValueUsd: 1_000_000,
      }),
      transferRecord({
        id: 'stargate',
        timestamp: latestTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        transferCount: 23,
        srcValueUsd: 200_000,
      }),
      transferRecord({
        id: 'across',
        timestamp: latestTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        transferCount: 200,
        srcValueUsd: 1_500_000,
        dstValueUsd: 1_500_000,
      }),
      transferRecord({
        id: 'hop',
        timestamp: latestTimestamp,
        srcChain: 'base',
        dstChain: 'arbitrum',
        transferCount: 200,
        dstValueUsd: 300_000,
      }),
      transferRecord({
        id: 'layerzero',
        timestamp: latestTimestamp,
        srcChain: 'optimism',
        dstChain: 'arbitrum',
        transferCount: 200,
        dstValueUsd: 300_000,
      }),
      transferRecord({
        id: 'across',
        timestamp: latestTimestamp,
        srcChain: 'ethereum',
        dstChain: 'base',
        transferCount: 1,
        srcValueUsd: 2_000_000,
        dstValueUsd: 2_000_000,
      }),
    ]
    const previousTransfers = [
      transferRecord({
        id: 'across',
        timestamp: previousTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        transferCount: 1,
        srcValueUsd: 900_000,
      }),
      transferRecord({
        id: 'across',
        timestamp: previousTimestamp,
        srcChain: 'ethereum',
        dstChain: 'base',
        transferCount: 1,
        srcValueUsd: 1_100_000,
        dstValueUsd: 1_100_000,
      }),
    ]
    const currentTokens = [
      tokenRecord({
        id: 'across',
        timestamp: latestTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        abstractTokenId: '9HN5PN',
        volume: 3_000_000,
      }),
    ]
    const previousTokens = [
      tokenRecord({
        id: 'across',
        timestamp: previousTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        abstractTokenId: '9HN5PN',
        volume: 1_000_000,
      }),
    ]
    const currentActivity = [activityRecord('ethereum', latestTimestamp, 50)]
    const previousActivity = [activityRecord('ethereum', previousTimestamp, 20)]
    const olderActivity = [activityRecord('ethereum', olderTimestamp, 18)]
    const currentTvs = [tvsRecord('optimism', latestTimestamp, 5_000_000_000)]
    const previousTvs = [
      tvsRecord('optimism', previousTimestamp, 4_500_000_000),
    ]
    const olderTvs = [tvsRecord('optimism', olderTimestamp, 4_000_000_000)]

    const getAbstractTokenById = vi.fn().mockResolvedValue({
      id: '9HN5PN',
      symbol: 'USDC',
      issuer: 'circle',
      iconUrl: 'https://example.com/usdc.png',
    })
    const getTransferByTimestamp = vi
      .fn()
      .mockResolvedValueOnce(currentTransfers)
      .mockResolvedValueOnce(previousTransfers)
      .mockResolvedValue([])
    const getTransferMaxTimestampAtOrBefore = vi
      .fn()
      .mockResolvedValue(previousTimestamp)
    const getTokenByTimestamp = vi
      .fn()
      .mockResolvedValueOnce(currentTokens)
      .mockResolvedValueOnce(previousTokens)
      .mockResolvedValue([])
    const getActivityMaxTimestampAtOrBeforeForProjects = vi
      .fn()
      .mockResolvedValue(latestTimestamp)
    const getActivityByTimestamp = vi
      .fn()
      .mockResolvedValueOnce(currentActivity)
      .mockResolvedValueOnce(previousActivity)
      .mockResolvedValueOnce(olderActivity)
      .mockResolvedValue([])
    const getTvsMaxTimestampAtOrBeforeForProjects = vi
      .fn()
      .mockResolvedValueOnce(latestTimestamp)
      .mockResolvedValueOnce(previousTimestamp)
      .mockResolvedValueOnce(olderTimestamp)
    const getTvsByTimestamp = vi
      .fn()
      .mockResolvedValueOnce(currentTvs)
      .mockResolvedValueOnce(previousTvs)
      .mockResolvedValueOnce(olderTvs)
      .mockResolvedValue([])

    const caller = createCaller({
      latestTimestamp,
      getTransferByTimestamp,
      getTransferMaxTimestampAtOrBefore,
      getTokenByTimestamp,
      getActivityMaxTimestampAtOrBeforeForProjects,
      getActivityByTimestamp,
      getTvsMaxTimestampAtOrBeforeForProjects,
      getTvsByTimestamp,
      getAbstractTokenById,
    })

    const result = await caller.latest()
    const interopWindow = {
      windowStart: latestTimestamp - UnixTime.DAY,
      windowEnd: latestTimestamp,
      previousWindowStart: latestTimestamp - 2 * UnixTime.DAY,
      previousWindowEnd: latestTimestamp - UnixTime.DAY,
    }
    const comparisonWindow = interopWindow
    const activityWindow = {
      windowStart: latestTimestamp,
      windowEnd: latestTimestamp + UnixTime.DAY,
      previousWindowStart: latestTimestamp - UnixTime.DAY,
      previousWindowEnd: latestTimestamp,
    }
    const topPath = getTopPathByVolumeAtTimestamp(
      currentTransfers,
      latestTimestamp,
    )
    const topChainByInflow = getTopDestinationChainByInflowAtTimestamp(
      currentTransfers,
      latestTimestamp,
    )
    const chainIncrease = getLargestSourceChainVolumeIncrease(
      currentTransfers,
      previousTransfers,
      latestTimestamp,
    )
    const tokenIncrease = getLargestTokenVolumeIncrease(
      currentTokens,
      previousTokens,
      latestTimestamp,
    )
    const protocolIncrease = getLargestProtocolVolumeIncrease(
      currentTransfers,
      previousTransfers,
      latestTimestamp,
    )
    const interopProjectIds = DEFAULT_CHAINS.map((chain) => chain.id)
    const uopsIncrease = getLargestUopsCountIncrease(
      currentActivity,
      previousActivity,
      olderActivity,
      latestTimestamp,
      interopProjectIds,
    )
    const tvsIncrease = getLargestTvsIncrease(
      currentTvs,
      previousTvs,
      olderTvs,
      latestTimestamp,
      interopProjectIds,
    )

    expect(getTransferByTimestamp).toHaveBeenCalledTimes(2)
    expect(getTransferMaxTimestampAtOrBefore).toHaveBeenCalledWith(
      previousTimestamp,
    )
    expect(getTokenByTimestamp).toHaveBeenCalledTimes(2)
    expect(getActivityByTimestamp).toHaveBeenCalledTimes(3)
    expect(getTvsByTimestamp).toHaveBeenCalledTimes(3)
    expect(getActivityByTimestamp).toHaveBeenCalledWith(latestTimestamp)
    expect(getActivityByTimestamp).toHaveBeenCalledWith(previousTimestamp)
    expect(getActivityByTimestamp).toHaveBeenCalledWith(olderTimestamp)
    expect(getTvsByTimestamp).toHaveBeenCalledWith(latestTimestamp)
    expect(getAbstractTokenById).toHaveBeenCalledWith('9HN5PN')
    expect(result).toStrictEqual({
      topPathByVolume: topPath
        ? {
            windowStart: comparisonWindow.windowStart,
            windowEnd: comparisonWindow.windowEnd,
            srcChain: topPath.srcChain,
            dstChain: topPath.dstChain,
            volumeUsd: topPath.volumeUsd,
            transferCount: topPath.transferCount,
            protocolCount: topPath.protocolCount,
          }
        : null,
      topChainByInflow: topChainByInflow
        ? {
            windowStart: comparisonWindow.windowStart,
            windowEnd: comparisonWindow.windowEnd,
            chain: topChainByInflow.chain,
            volumeUsd: topChainByInflow.volumeUsd,
            transferCount: topChainByInflow.transferCount,
            protocolCount: topChainByInflow.protocolCount,
          }
        : null,
      largestVolumeIncreaseByChain: chainIncrease
        ? {
            ...comparisonWindow,
            chain: chainIncrease.chain,
            currentVolumeUsd: chainIncrease.currentVolumeUsd,
            previousVolumeUsd: chainIncrease.previousVolumeUsd,
            increaseUsd: chainIncrease.increaseUsd,
          }
        : null,
      largestVolumeIncreaseByToken: tokenIncrease
        ? {
            ...comparisonWindow,
            token: {
              id: tokenIncrease.abstractTokenId,
              symbol: 'USDC',
              issuer: 'circle',
              iconUrl: 'https://example.com/usdc.png',
            },
            currentVolumeUsd: tokenIncrease.currentVolumeUsd,
            previousVolumeUsd: tokenIncrease.previousVolumeUsd,
            increaseUsd: tokenIncrease.increaseUsd,
          }
        : null,
      largestVolumeIncreaseByProtocol: protocolIncrease
        ? {
            ...comparisonWindow,
            id: protocolIncrease.id,
            currentVolumeUsd: protocolIncrease.currentVolumeUsd,
            previousVolumeUsd: protocolIncrease.previousVolumeUsd,
            increaseUsd: protocolIncrease.increaseUsd,
          }
        : null,
      largestUopsIncreaseByChain: uopsIncrease
        ? {
            ...activityWindow,
            chain: uopsIncrease.projectId.toString(),
            currentCount: uopsIncrease.currentUopsCount,
            previousCount: uopsIncrease.previousUopsCount,
            increase: uopsIncrease.increase,
            increasePercent: uopsIncrease.increasePercent,
          }
        : null,
      largestTvsIncreaseByChain: tvsIncrease
        ? {
            ...comparisonWindow,
            chain: tvsIncrease.projectId,
            currentVolumeUsd: tvsIncrease.currentTvsUsd,
            previousVolumeUsd: tvsIncrease.previousTvsUsd,
            increaseUsd: tvsIncrease.increaseUsd,
          }
        : null,
    })
  })

  it('uses configured interop chains for UOPS and TVS highlights', async () => {
    const latestTimestamp = UnixTime(1_700_000_000)
    const previousTimestamp = latestTimestamp - UnixTime.DAY
    const olderTimestamp = previousTimestamp - UnixTime.DAY

    const getActivityByTimestamp = vi
      .fn()
      .mockResolvedValueOnce([
        activityRecord('optimism', latestTimestamp, 2000),
        activityRecord('ethereum', latestTimestamp, 50),
      ])
      .mockResolvedValueOnce([
        activityRecord('optimism', previousTimestamp, 1000),
        activityRecord('ethereum', previousTimestamp, 20),
      ])
      .mockResolvedValueOnce([
        activityRecord('optimism', olderTimestamp, 900),
        activityRecord('ethereum', olderTimestamp, 18),
      ])
      .mockResolvedValue([])
    const getTvsByTimestamp = vi
      .fn()
      .mockResolvedValueOnce([
        tvsRecord('optimism', latestTimestamp, 9_000_000_000),
      ])
      .mockResolvedValueOnce([
        tvsRecord('optimism', previousTimestamp, 1_000_000_000),
      ])
      .mockResolvedValueOnce([
        tvsRecord('optimism', olderTimestamp, 900_000_000),
      ])
      .mockResolvedValue([])

    const caller = createCaller({
      latestTimestamp,
      getTransferByTimestamp: vi.fn().mockResolvedValue([]),
      getTokenByTimestamp: vi.fn().mockResolvedValue([]),
      getActivityMaxTimestampAtOrBeforeForProjects: vi
        .fn()
        .mockResolvedValue(latestTimestamp),
      getActivityByTimestamp,
      getTvsMaxTimestampAtOrBeforeForProjects: vi
        .fn()
        .mockResolvedValueOnce(latestTimestamp)
        .mockResolvedValueOnce(previousTimestamp)
        .mockResolvedValueOnce(olderTimestamp),
      getTvsByTimestamp,
      chains: [{ id: 'ethereum', type: 'evm' }],
    })

    const result = await caller.latest()

    expect(result.largestUopsIncreaseByChain).toStrictEqual({
      windowStart: latestTimestamp,
      windowEnd: latestTimestamp + UnixTime.DAY,
      previousWindowStart: latestTimestamp - UnixTime.DAY,
      previousWindowEnd: latestTimestamp,
      chain: 'ethereum',
      currentCount: 50,
      previousCount: 20,
      increase: 30,
      increasePercent: 150,
    })
    expect(result.largestTvsIncreaseByChain).toStrictEqual(null)
  })

  it('uses configured interop projects when selecting UOPS timestamp', async () => {
    const latestTimestamp = UnixTime(1_700_000_000)
    const currentActivityTimestamp = latestTimestamp - UnixTime.DAY
    const previousActivityTimestamp = latestTimestamp - 2 * UnixTime.DAY
    const olderActivityTimestamp = latestTimestamp - 3 * UnixTime.DAY

    const activityByTimestamp = new Map<number, ActivityRecord[]>([
      [latestTimestamp, [activityRecord('unrelated', latestTimestamp, 10_000)]],
      [
        currentActivityTimestamp,
        [activityRecord('ethereum', currentActivityTimestamp, 50)],
      ],
      [
        previousActivityTimestamp,
        [activityRecord('ethereum', previousActivityTimestamp, 20)],
      ],
      [
        olderActivityTimestamp,
        [activityRecord('ethereum', olderActivityTimestamp, 18)],
      ],
    ])
    const getActivityMaxTimestampAtOrBeforeForProjects = vi.fn(
      (_timestamp: UnixTime, projectIds: readonly string[]) => {
        return Promise.resolve(
          projectIds.includes('ethereum')
            ? currentActivityTimestamp
            : latestTimestamp,
        )
      },
    )
    const getActivityByTimestamp = vi.fn((timestamp: UnixTime) =>
      Promise.resolve(activityByTimestamp.get(timestamp) ?? []),
    )

    const caller = createCaller({
      latestTimestamp,
      getTransferByTimestamp: vi.fn().mockResolvedValue([]),
      getTokenByTimestamp: vi.fn().mockResolvedValue([]),
      getActivityMaxTimestampAtOrBeforeForProjects,
      getActivityByTimestamp,
      chains: [{ id: 'ethereum', type: 'evm' }],
    })

    const result = await caller.latest()

    expect(getActivityMaxTimestampAtOrBeforeForProjects).toHaveBeenCalledWith(
      latestTimestamp,
      ['ethereum'],
    )
    expect(result.largestUopsIncreaseByChain).toStrictEqual({
      windowStart: currentActivityTimestamp,
      windowEnd: currentActivityTimestamp + UnixTime.DAY,
      previousWindowStart: previousActivityTimestamp,
      previousWindowEnd: currentActivityTimestamp,
      chain: 'ethereum',
      currentCount: 50,
      previousCount: 20,
      increase: 30,
      increasePercent: 150,
    })
  })

  it('uses configured interop projects when selecting TVS timestamps', async () => {
    const latestTimestamp = UnixTime(1_700_000_000)
    const currentTvsTimestamp = latestTimestamp - UnixTime.DAY
    const previousTvsTimestamp = latestTimestamp - 2 * UnixTime.DAY
    const olderTvsTimestamp = latestTimestamp - 3 * UnixTime.DAY

    const tvsByTimestamp = new Map<number, TokenValueRecord[]>([
      [latestTimestamp, [tvsRecord('unrelated', latestTimestamp, 100)]],
      [
        currentTvsTimestamp,
        [tvsRecord('ethereum', currentTvsTimestamp, 5_000_000_000)],
      ],
      [
        previousTvsTimestamp,
        [tvsRecord('ethereum', previousTvsTimestamp, 4_000_000_000)],
      ],
      [
        olderTvsTimestamp,
        [tvsRecord('ethereum', olderTvsTimestamp, 3_000_000_000)],
      ],
    ])
    const getTvsMaxTimestampAtOrBeforeForProjects = vi.fn(
      (timestamp: UnixTime, projectIds: readonly string[]) => {
        if (projectIds.includes('ethereum')) {
          if (timestamp >= currentTvsTimestamp) {
            return Promise.resolve(currentTvsTimestamp)
          }
          if (timestamp >= previousTvsTimestamp) {
            return Promise.resolve(previousTvsTimestamp)
          }
          if (timestamp >= olderTvsTimestamp) {
            return Promise.resolve(olderTvsTimestamp)
          }
          return Promise.resolve(undefined)
        }

        return Promise.resolve(undefined)
      },
    )
    const getTvsByTimestamp = vi.fn((timestamp: UnixTime) =>
      Promise.resolve(tvsByTimestamp.get(timestamp) ?? []),
    )

    const caller = createCaller({
      latestTimestamp,
      getTransferByTimestamp: vi.fn().mockResolvedValue([]),
      getTokenByTimestamp: vi.fn().mockResolvedValue([]),
      getTvsMaxTimestampAtOrBeforeForProjects,
      getTvsByTimestamp,
      chains: [{ id: 'ethereum', type: 'evm' }],
    })

    const result = await caller.latest()

    expect(getTvsMaxTimestampAtOrBeforeForProjects).toHaveBeenCalledWith(
      latestTimestamp,
      ['ethereum'],
    )
    expect(getTvsMaxTimestampAtOrBeforeForProjects).toHaveBeenCalledWith(
      currentTvsTimestamp - UnixTime.DAY,
      ['ethereum'],
    )
    expect(getTvsMaxTimestampAtOrBeforeForProjects).toHaveBeenCalledWith(
      previousTvsTimestamp - UnixTime.DAY,
      ['ethereum'],
    )
    expect(result.largestTvsIncreaseByChain).toStrictEqual({
      windowStart: currentTvsTimestamp - UnixTime.DAY,
      windowEnd: currentTvsTimestamp,
      previousWindowStart: previousTvsTimestamp - UnixTime.DAY,
      previousWindowEnd: previousTvsTimestamp,
      chain: 'ethereum',
      currentVolumeUsd: 5_000_000_000,
      previousVolumeUsd: 4_000_000_000,
      increaseUsd: 1_000_000_000,
    })
  })

  it('rewinds UOPS when the latest activity snapshot is the current day bucket', async () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')
    const currentActivityTimestamp = today - UnixTime.DAY
    const previousActivityTimestamp = today - 2 * UnixTime.DAY
    const olderActivityTimestamp = today - 3 * UnixTime.DAY

    const getActivityByTimestamp = vi
      .fn()
      .mockResolvedValueOnce([
        activityRecord('ethereum', currentActivityTimestamp, 50),
      ])
      .mockResolvedValueOnce([
        activityRecord('ethereum', previousActivityTimestamp, 20),
      ])
      .mockResolvedValueOnce([
        activityRecord('ethereum', olderActivityTimestamp, 18),
      ])
      .mockResolvedValue([])

    const caller = createCaller({
      latestTimestamp: today,
      getTransferByTimestamp: vi.fn().mockResolvedValue([]),
      getTokenByTimestamp: vi.fn().mockResolvedValue([]),
      getActivityMaxTimestampAtOrBeforeForProjects: vi
        .fn()
        .mockResolvedValue(today),
      getActivityByTimestamp,
    })

    const result = await caller.latest()

    expect(getActivityByTimestamp).toHaveBeenCalledWith(
      currentActivityTimestamp,
    )
    expect(getActivityByTimestamp).toHaveBeenCalledWith(
      previousActivityTimestamp,
    )
    expect(getActivityByTimestamp).toHaveBeenCalledWith(olderActivityTimestamp)
    expect(getActivityByTimestamp).not.toHaveBeenCalledWith(today)
    expect(result.largestUopsIncreaseByChain).toStrictEqual({
      windowStart: currentActivityTimestamp,
      windowEnd: today,
      previousWindowStart: previousActivityTimestamp,
      previousWindowEnd: currentActivityTimestamp,
      chain: 'ethereum',
      currentCount: 50,
      previousCount: 20,
      increase: 30,
      increasePercent: 150,
    })
  })

  it('maps configured chain ids to project ids for UOPS and TVS highlights', async () => {
    const latestTimestamp = UnixTime(1_700_000_000)
    const previousTimestamp = latestTimestamp - UnixTime.DAY
    const olderTimestamp = previousTimestamp - UnixTime.DAY

    const getActivityByTimestamp = vi
      .fn()
      .mockResolvedValueOnce([
        activityRecord('polygon-pos', latestTimestamp, 90),
      ])
      .mockResolvedValueOnce([
        activityRecord('polygon-pos', previousTimestamp, 30),
      ])
      .mockResolvedValueOnce([
        activityRecord('polygon-pos', olderTimestamp, 20),
      ])
      .mockResolvedValue([])
    const getTvsByTimestamp = vi
      .fn()
      .mockResolvedValueOnce([
        tvsRecord('polygon-pos', latestTimestamp, 5_000_000_000),
      ])
      .mockResolvedValueOnce([
        tvsRecord('polygon-pos', previousTimestamp, 4_000_000_000),
      ])
      .mockResolvedValueOnce([
        tvsRecord('polygon-pos', olderTimestamp, 3_000_000_000),
      ])
      .mockResolvedValue([])

    const caller = createCaller({
      latestTimestamp,
      getTransferByTimestamp: vi.fn().mockResolvedValue([]),
      getTokenByTimestamp: vi.fn().mockResolvedValue([]),
      getActivityMaxTimestampAtOrBeforeForProjects: vi
        .fn()
        .mockResolvedValue(latestTimestamp),
      getActivityByTimestamp,
      getTvsMaxTimestampAtOrBeforeForProjects: vi
        .fn()
        .mockResolvedValueOnce(latestTimestamp)
        .mockResolvedValueOnce(previousTimestamp)
        .mockResolvedValueOnce(olderTimestamp),
      getTvsByTimestamp,
      chains: [{ id: 'polygonpos', type: 'evm' }],
    })

    const result = await caller.latest()

    expect(result.largestUopsIncreaseByChain).toStrictEqual({
      windowStart: latestTimestamp,
      windowEnd: latestTimestamp + UnixTime.DAY,
      previousWindowStart: latestTimestamp - UnixTime.DAY,
      previousWindowEnd: latestTimestamp,
      chain: 'polygonpos',
      currentCount: 90,
      previousCount: 30,
      increase: 60,
      increasePercent: 200,
    })
    expect(result.largestTvsIncreaseByChain).toStrictEqual({
      windowStart: latestTimestamp - UnixTime.DAY,
      windowEnd: latestTimestamp,
      previousWindowStart: latestTimestamp - 2 * UnixTime.DAY,
      previousWindowEnd: latestTimestamp - UnixTime.DAY,
      chain: 'polygonpos',
      currentVolumeUsd: 5_000_000_000,
      previousVolumeUsd: 4_000_000_000,
      increaseUsd: 1_000_000_000,
    })
  })

  it('uses the latest available previous TVS snapshot in comparison windows', async () => {
    const latestTimestamp = UnixTime(1_700_000_000)
    const fallbackPreviousTimestamp =
      latestTimestamp - UnixTime.DAY - UnixTime.HOUR
    const olderTimestamp = fallbackPreviousTimestamp - UnixTime.DAY

    const getTvsByTimestamp = vi
      .fn()
      .mockResolvedValueOnce([
        tvsRecord('optimism', latestTimestamp, 5_000_000_000),
      ])
      .mockResolvedValueOnce([
        tvsRecord('optimism', fallbackPreviousTimestamp, 4_000_000_000),
      ])
      .mockResolvedValueOnce([
        tvsRecord('optimism', olderTimestamp, 3_000_000_000),
      ])
      .mockResolvedValue([])

    const caller = createCaller({
      latestTimestamp,
      getTransferByTimestamp: vi.fn().mockResolvedValue([]),
      getTokenByTimestamp: vi.fn().mockResolvedValue([]),
      getTvsMaxTimestampAtOrBeforeForProjects: vi
        .fn()
        .mockResolvedValueOnce(latestTimestamp)
        .mockResolvedValueOnce(fallbackPreviousTimestamp)
        .mockResolvedValueOnce(olderTimestamp),
      getTvsByTimestamp,
    })

    const result = await caller.latest()

    expect(result.largestTvsIncreaseByChain).toStrictEqual({
      windowStart: latestTimestamp - UnixTime.DAY,
      windowEnd: latestTimestamp,
      previousWindowStart: fallbackPreviousTimestamp - UnixTime.DAY,
      previousWindowEnd: fallbackPreviousTimestamp,
      chain: 'optimism',
      currentVolumeUsd: 5_000_000_000,
      previousVolumeUsd: 4_000_000_000,
      increaseUsd: 1_000_000_000,
    })
  })

  it('returns empty metrics when no snapshots exist', async () => {
    const getTransferByTimestamp = vi.fn()
    const getTokenByTimestamp = vi.fn()
    const getActivityByTimestamp = vi.fn()
    const getTvsByTimestamp = vi.fn()
    const caller = createCaller({
      latestTimestamp: undefined,
      getTransferByTimestamp,
      getTokenByTimestamp,
      getActivityByTimestamp,
      getTvsByTimestamp,
    })

    const result = await caller.latest()

    expect(getTransferByTimestamp).not.toHaveBeenCalled()
    expect(getTokenByTimestamp).not.toHaveBeenCalled()
    expect(getActivityByTimestamp).not.toHaveBeenCalled()
    expect(getTvsByTimestamp).not.toHaveBeenCalled()
    expect(result).toStrictEqual({
      topPathByVolume: null,
      topChainByInflow: null,
      largestVolumeIncreaseByChain: null,
      largestVolumeIncreaseByToken: null,
      largestVolumeIncreaseByProtocol: null,
      largestUopsIncreaseByChain: null,
      largestTvsIncreaseByChain: null,
    })
  })

  it('uses the latest available previous interop snapshot for volume deltas', async () => {
    const latestTimestamp = UnixTime(1_700_000_000)
    const fallbackPreviousTimestamp =
      latestTimestamp - UnixTime.DAY - UnixTime.HOUR

    const currentTransfers = [
      transferRecord({
        id: 'across',
        timestamp: latestTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        srcValueUsd: 100,
      }),
      transferRecord({
        id: 'stargate',
        timestamp: latestTimestamp,
        srcChain: 'base',
        dstChain: 'arbitrum',
        srcValueUsd: 150,
      }),
    ]
    const previousTransfers = [
      transferRecord({
        id: 'across',
        timestamp: fallbackPreviousTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        srcValueUsd: 20,
      }),
      transferRecord({
        id: 'stargate',
        timestamp: fallbackPreviousTimestamp,
        srcChain: 'base',
        dstChain: 'arbitrum',
        srcValueUsd: 140,
      }),
    ]
    const currentTokens = [
      tokenRecord({
        id: 'across',
        timestamp: latestTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        abstractTokenId: 'ETH',
        volume: 100,
      }),
      tokenRecord({
        id: 'stargate',
        timestamp: latestTimestamp,
        srcChain: 'base',
        dstChain: 'arbitrum',
        abstractTokenId: 'USDC',
        volume: 150,
      }),
    ]
    const previousTokens = [
      tokenRecord({
        id: 'across',
        timestamp: fallbackPreviousTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        abstractTokenId: 'ETH',
        volume: 20,
      }),
      tokenRecord({
        id: 'stargate',
        timestamp: fallbackPreviousTimestamp,
        srcChain: 'base',
        dstChain: 'arbitrum',
        abstractTokenId: 'USDC',
        volume: 140,
      }),
    ]

    const getTransferByTimestamp = vi
      .fn()
      .mockResolvedValueOnce(currentTransfers)
      .mockResolvedValueOnce(previousTransfers)
      .mockResolvedValue([])
    const getTokenByTimestamp = vi
      .fn()
      .mockResolvedValueOnce(currentTokens)
      .mockResolvedValueOnce(previousTokens)
      .mockResolvedValue([])

    const caller = createCaller({
      latestTimestamp,
      getTransferMaxTimestampAtOrBefore: vi
        .fn()
        .mockResolvedValue(fallbackPreviousTimestamp),
      getTransferByTimestamp,
      getTokenByTimestamp,
    })

    const result = await caller.latest()

    expect(getTransferByTimestamp).toHaveBeenCalledWith(latestTimestamp)
    expect(getTransferByTimestamp).toHaveBeenCalledWith(
      fallbackPreviousTimestamp,
    )
    expect(getTokenByTimestamp).toHaveBeenCalledWith(latestTimestamp)
    expect(getTokenByTimestamp).toHaveBeenCalledWith(fallbackPreviousTimestamp)
    expect(result.largestVolumeIncreaseByChain).toStrictEqual({
      windowStart: latestTimestamp - UnixTime.DAY,
      windowEnd: latestTimestamp,
      previousWindowStart: fallbackPreviousTimestamp - UnixTime.DAY,
      previousWindowEnd: fallbackPreviousTimestamp,
      chain: 'ethereum',
      currentVolumeUsd: 100,
      previousVolumeUsd: 20,
      increaseUsd: 80,
    })
    expect(result.largestVolumeIncreaseByToken).toStrictEqual({
      windowStart: latestTimestamp - UnixTime.DAY,
      windowEnd: latestTimestamp,
      previousWindowStart: fallbackPreviousTimestamp - UnixTime.DAY,
      previousWindowEnd: fallbackPreviousTimestamp,
      token: {
        id: 'ETH',
        symbol: 'ETH',
        issuer: null,
        iconUrl: null,
      },
      currentVolumeUsd: 100,
      previousVolumeUsd: 20,
      increaseUsd: 80,
    })
    expect(result.largestVolumeIncreaseByProtocol).toStrictEqual({
      windowStart: latestTimestamp - UnixTime.DAY,
      windowEnd: latestTimestamp,
      previousWindowStart: fallbackPreviousTimestamp - UnixTime.DAY,
      previousWindowEnd: fallbackPreviousTimestamp,
      id: 'across',
      currentVolumeUsd: 100,
      previousVolumeUsd: 20,
      increaseUsd: 80,
    })
  })

  it('returns no volume deltas when no previous interop snapshot exists', async () => {
    const latestTimestamp = UnixTime(1_700_000_000)
    const currentTransfers = [
      transferRecord({
        id: 'across',
        timestamp: latestTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        srcValueUsd: 100,
      }),
    ]
    const currentTokens = [
      tokenRecord({
        id: 'across',
        timestamp: latestTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        abstractTokenId: 'ETH',
        volume: 100,
      }),
    ]
    const getTransferByTimestamp = vi
      .fn()
      .mockResolvedValueOnce(currentTransfers)
      .mockResolvedValue([])
    const getTokenByTimestamp = vi
      .fn()
      .mockResolvedValueOnce(currentTokens)
      .mockResolvedValue([])

    const caller = createCaller({
      latestTimestamp,
      getTransferMaxTimestampAtOrBefore: vi.fn().mockResolvedValue(undefined),
      getTransferByTimestamp,
      getTokenByTimestamp,
    })

    const result = await caller.latest()

    expect(getTransferByTimestamp).not.toHaveBeenCalled()
    expect(getTokenByTimestamp).not.toHaveBeenCalled()
    expect(result.largestVolumeIncreaseByChain).toStrictEqual(null)
    expect(result.largestVolumeIncreaseByToken).toStrictEqual(null)
    expect(result.largestVolumeIncreaseByProtocol).toStrictEqual(null)
  })
})

function createCaller(options: {
  latestTimestamp: UnixTime | undefined
  getTransferMaxTimestampAtOrBefore?: Mock
  getTransferByTimestamp?: Mock
  getTokenByTimestamp?: Mock
  getActivityMaxTimestampAtOrBeforeForProjects?: Mock
  getActivityByTimestamp?: Mock
  getTvsMaxTimestampAtOrBeforeForProjects?: Mock
  getTvsByTimestamp?: Mock
  getAbstractTokenById?: Mock
  chains?: readonly { id: string; type: 'evm' }[]
}) {
  const callerFactory = createCallerFactory(
    createHighlightsRouter({
      chains: options.chains ?? DEFAULT_CHAINS,
      tokenDbClient: mockObject<TokenDbClient>({
        abstractTokens: mockObject<TokenDbClient['abstractTokens']>({
          getById: mockObject<TokenDbClient['abstractTokens']['getById']>({
            query:
              options.getAbstractTokenById ??
              vi.fn().mockResolvedValue(undefined),
          }),
        }),
      }),
    }),
  )
  return callerFactory({
    headers: new Headers(),
    db: mockObject<Database>({
      aggregatedInteropTransfer: mockObject<
        Database['aggregatedInteropTransfer']
      >({
        getLatestTimestamp: vi.fn().mockResolvedValue(options.latestTimestamp),
        getMaxTimestampAtOrBefore:
          options.getTransferMaxTimestampAtOrBefore ??
          vi.fn().mockResolvedValue(undefined),
        getByTimestamp:
          options.getTransferByTimestamp ?? vi.fn().mockResolvedValue([]),
      }),
      aggregatedInteropToken: mockObject<Database['aggregatedInteropToken']>({
        getByTimestamp:
          options.getTokenByTimestamp ?? vi.fn().mockResolvedValue([]),
      }),
      activity: mockObject<Database['activity']>({
        getMaxTimestampAtOrBeforeForProjects:
          options.getActivityMaxTimestampAtOrBeforeForProjects ??
          vi.fn().mockResolvedValue(undefined),
        getByTimestamp:
          options.getActivityByTimestamp ?? vi.fn().mockResolvedValue([]),
      }),
      tvsTokenValue: mockObject<Database['tvsTokenValue']>({
        getMaxTimestampAtOrBeforeForProjects:
          options.getTvsMaxTimestampAtOrBeforeForProjects ??
          vi.fn().mockResolvedValue(undefined),
        getByTimestamp:
          options.getTvsByTimestamp ?? vi.fn().mockResolvedValue([]),
      }),
    }),
    session: { email: 'dev@l2beat.com' },
  })
}

function transferRecord(
  overrides: Partial<AggregatedInteropTransferRecord> &
    Pick<
      AggregatedInteropTransferRecord,
      'timestamp' | 'id' | 'srcChain' | 'dstChain'
    >,
): AggregatedInteropTransferRecord {
  return {
    bridgeType: 'lockAndMint',
    transferTypeStats: undefined,
    transfersWithDurationCount: 0,
    identifiedCount: 0,
    totalDurationSum: 0,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    avgValueInFlight: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    countUnder100: 0,
    count100To1K: 0,
    count1KTo10K: 0,
    count10KTo100K: 0,
    countOver100K: 0,
    transferCount: 0,
    srcValueUsd: undefined,
    dstValueUsd: undefined,
    ...overrides,
  }
}

function tokenRecord(
  overrides: Partial<AggregatedInteropTokenRecord> &
    Pick<
      AggregatedInteropTokenRecord,
      'timestamp' | 'id' | 'srcChain' | 'dstChain' | 'abstractTokenId'
    >,
): AggregatedInteropTokenRecord {
  return {
    bridgeType: 'lockAndMint',
    transferTypeStats: undefined,
    transferCount: 0,
    transfersWithDurationCount: 0,
    totalDurationSum: 0,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    volume: 0,
    ...overrides,
  }
}

function activityRecord(
  projectId: string,
  timestamp: UnixTime,
  uopsCount: number,
): ActivityRecord {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count: uopsCount,
    uopsCount,
    start: 1,
    end: 2,
  }
}

function tvsRecord(
  projectId: string,
  timestamp: UnixTime,
  valueForProject: number,
): TokenValueRecord {
  return {
    timestamp,
    configurationId: `${projectId}-config`,
    projectId,
    tokenId: `${projectId}-token`,
    amount: 1,
    value: valueForProject,
    valueForProject,
    valueForSummary: valueForProject,
    priceUsd: 1,
  }
}
