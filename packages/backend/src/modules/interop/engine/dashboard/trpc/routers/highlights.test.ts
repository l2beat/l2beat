import type {
  ActivityRecord,
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
  Database,
  TokenValueRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../../../../../../trpc/init'
import {
  getLargestProtocolVolumeIncrease,
  getLargestSourceChainVolumeIncrease,
  getLargestTokenVolumeIncrease,
  getLargestTvsIncrease,
  getLargestUopsCountIncrease,
  getTopDestinationChainByInflowAtTimestamp,
  getTopPathByVolumeAtTimestamp,
} from '../../impls/highlightsCalculations'
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

    const getAbstractTokenById = mockFn().resolvesTo({
      id: '9HN5PN',
      symbol: 'USDC',
      issuer: 'circle',
      iconUrl: 'https://example.com/usdc.png',
    })
    const getTransferByTimestamp = mockFn()
      .resolvesToOnce(currentTransfers)
      .resolvesToOnce(previousTransfers)
      .resolvesTo([])
    const getTransferMaxTimestampAtOrBefore =
      mockFn().resolvesTo(previousTimestamp)
    const getTokenByTimestamp = mockFn()
      .resolvesToOnce(currentTokens)
      .resolvesToOnce(previousTokens)
      .resolvesTo([])
    const getActivityMaxTimestampAtOrBefore =
      mockFn().resolvesTo(latestTimestamp)
    const getActivityByTimestamp = mockFn()
      .resolvesToOnce(currentActivity)
      .resolvesToOnce(previousActivity)
      .resolvesToOnce(olderActivity)
      .resolvesTo([])
    const getTvsMaxTimestampAtOrBefore = mockFn()
      .resolvesToOnce(latestTimestamp)
      .resolvesToOnce(previousTimestamp)
      .resolvesToOnce(olderTimestamp)
    const getTvsByTimestamp = mockFn()
      .resolvesToOnce(currentTvs)
      .resolvesToOnce(previousTvs)
      .resolvesToOnce(olderTvs)
      .resolvesTo([])

    const caller = createCaller({
      latestTimestamp,
      getTransferByTimestamp,
      getTransferMaxTimestampAtOrBefore,
      getTokenByTimestamp,
      getActivityMaxTimestampAtOrBefore,
      getActivityByTimestamp,
      getTvsMaxTimestampAtOrBefore,
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
    const interopProjectIds = new Set(DEFAULT_CHAINS.map((chain) => chain.id))
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
    expect(result).toEqual({
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
            ...comparisonWindow,
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

    const getActivityByTimestamp = mockFn()
      .resolvesToOnce([
        activityRecord('optimism', latestTimestamp, 2000),
        activityRecord('ethereum', latestTimestamp, 50),
      ])
      .resolvesToOnce([
        activityRecord('optimism', previousTimestamp, 1000),
        activityRecord('ethereum', previousTimestamp, 20),
      ])
      .resolvesToOnce([
        activityRecord('optimism', olderTimestamp, 900),
        activityRecord('ethereum', olderTimestamp, 18),
      ])
      .resolvesTo([])
    const getTvsByTimestamp = mockFn()
      .resolvesToOnce([tvsRecord('optimism', latestTimestamp, 9_000_000_000)])
      .resolvesToOnce([tvsRecord('optimism', previousTimestamp, 1_000_000_000)])
      .resolvesToOnce([tvsRecord('optimism', olderTimestamp, 900_000_000)])
      .resolvesTo([])

    const caller = createCaller({
      latestTimestamp,
      getTransferByTimestamp: mockFn().resolvesTo([]),
      getTokenByTimestamp: mockFn().resolvesTo([]),
      getActivityMaxTimestampAtOrBefore: mockFn().resolvesTo(latestTimestamp),
      getActivityByTimestamp,
      getTvsMaxTimestampAtOrBefore: mockFn()
        .resolvesToOnce(latestTimestamp)
        .resolvesToOnce(previousTimestamp)
        .resolvesToOnce(olderTimestamp),
      getTvsByTimestamp,
      chains: [{ id: 'ethereum', type: 'evm' }],
    })

    const result = await caller.latest()

    expect(result.largestUopsIncreaseByChain).toEqual({
      windowStart: latestTimestamp - UnixTime.DAY,
      windowEnd: latestTimestamp,
      previousWindowStart: latestTimestamp - 2 * UnixTime.DAY,
      previousWindowEnd: latestTimestamp - UnixTime.DAY,
      chain: 'ethereum',
      currentCount: 50,
      previousCount: 20,
      increase: 30,
      increasePercent: 150,
    })
    expect(result.largestTvsIncreaseByChain).toEqual(null)
  })

  it('maps configured chain ids to project ids for UOPS and TVS highlights', async () => {
    const latestTimestamp = UnixTime(1_700_000_000)
    const previousTimestamp = latestTimestamp - UnixTime.DAY
    const olderTimestamp = previousTimestamp - UnixTime.DAY

    const getActivityByTimestamp = mockFn()
      .resolvesToOnce([activityRecord('polygon-pos', latestTimestamp, 90)])
      .resolvesToOnce([activityRecord('polygon-pos', previousTimestamp, 30)])
      .resolvesToOnce([activityRecord('polygon-pos', olderTimestamp, 20)])
      .resolvesTo([])
    const getTvsByTimestamp = mockFn()
      .resolvesToOnce([
        tvsRecord('polygon-pos', latestTimestamp, 5_000_000_000),
      ])
      .resolvesToOnce([
        tvsRecord('polygon-pos', previousTimestamp, 4_000_000_000),
      ])
      .resolvesToOnce([tvsRecord('polygon-pos', olderTimestamp, 3_000_000_000)])
      .resolvesTo([])

    const caller = createCaller({
      latestTimestamp,
      getTransferByTimestamp: mockFn().resolvesTo([]),
      getTokenByTimestamp: mockFn().resolvesTo([]),
      getActivityMaxTimestampAtOrBefore: mockFn().resolvesTo(latestTimestamp),
      getActivityByTimestamp,
      getTvsMaxTimestampAtOrBefore: mockFn()
        .resolvesToOnce(latestTimestamp)
        .resolvesToOnce(previousTimestamp)
        .resolvesToOnce(olderTimestamp),
      getTvsByTimestamp,
      chains: [{ id: 'polygonpos', type: 'evm' }],
    })

    const result = await caller.latest()

    expect(result.largestUopsIncreaseByChain).toEqual({
      windowStart: latestTimestamp - UnixTime.DAY,
      windowEnd: latestTimestamp,
      previousWindowStart: latestTimestamp - 2 * UnixTime.DAY,
      previousWindowEnd: latestTimestamp - UnixTime.DAY,
      chain: 'polygonpos',
      currentCount: 90,
      previousCount: 30,
      increase: 60,
      increasePercent: 200,
    })
    expect(result.largestTvsIncreaseByChain).toEqual({
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

    const getTvsByTimestamp = mockFn()
      .resolvesToOnce([tvsRecord('optimism', latestTimestamp, 5_000_000_000)])
      .resolvesToOnce([
        tvsRecord('optimism', fallbackPreviousTimestamp, 4_000_000_000),
      ])
      .resolvesToOnce([tvsRecord('optimism', olderTimestamp, 3_000_000_000)])
      .resolvesTo([])

    const caller = createCaller({
      latestTimestamp,
      getTransferByTimestamp: mockFn().resolvesTo([]),
      getTokenByTimestamp: mockFn().resolvesTo([]),
      getTvsMaxTimestampAtOrBefore: mockFn()
        .resolvesToOnce(latestTimestamp)
        .resolvesToOnce(fallbackPreviousTimestamp)
        .resolvesToOnce(olderTimestamp),
      getTvsByTimestamp,
    })

    const result = await caller.latest()

    expect(result.largestTvsIncreaseByChain).toEqual({
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
    const getTransferByTimestamp = mockFn()
    const getTokenByTimestamp = mockFn()
    const getActivityByTimestamp = mockFn()
    const getTvsByTimestamp = mockFn()
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
    expect(result).toEqual({
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

    const getTransferByTimestamp = mockFn()
      .resolvesToOnce(currentTransfers)
      .resolvesToOnce(previousTransfers)
      .resolvesTo([])
    const getTokenByTimestamp = mockFn()
      .resolvesToOnce(currentTokens)
      .resolvesToOnce(previousTokens)
      .resolvesTo([])

    const caller = createCaller({
      latestTimestamp,
      getTransferMaxTimestampAtOrBefore: mockFn().resolvesTo(
        fallbackPreviousTimestamp,
      ),
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
    expect(result.largestVolumeIncreaseByChain).toEqual({
      windowStart: latestTimestamp - UnixTime.DAY,
      windowEnd: latestTimestamp,
      previousWindowStart: fallbackPreviousTimestamp - UnixTime.DAY,
      previousWindowEnd: fallbackPreviousTimestamp,
      chain: 'ethereum',
      currentVolumeUsd: 100,
      previousVolumeUsd: 20,
      increaseUsd: 80,
    })
    expect(result.largestVolumeIncreaseByToken).toEqual({
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
    expect(result.largestVolumeIncreaseByProtocol).toEqual({
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
    const getTransferByTimestamp = mockFn()
      .resolvesToOnce(currentTransfers)
      .resolvesTo([])
    const getTokenByTimestamp = mockFn()
      .resolvesToOnce(currentTokens)
      .resolvesTo([])

    const caller = createCaller({
      latestTimestamp,
      getTransferMaxTimestampAtOrBefore: mockFn().resolvesTo(undefined),
      getTransferByTimestamp,
      getTokenByTimestamp,
    })

    const result = await caller.latest()

    expect(getTransferByTimestamp).toHaveBeenCalledTimes(1)
    expect(getTokenByTimestamp).toHaveBeenCalledTimes(1)
    expect(result.largestVolumeIncreaseByChain).toEqual(null)
    expect(result.largestVolumeIncreaseByToken).toEqual(null)
    expect(result.largestVolumeIncreaseByProtocol).toEqual(null)
  })
})

function createCaller(options: {
  latestTimestamp: UnixTime | undefined
  getTransferMaxTimestampAtOrBefore?: ReturnType<typeof mockFn>
  getTransferByTimestamp?: ReturnType<typeof mockFn>
  getTokenByTimestamp?: ReturnType<typeof mockFn>
  getActivityMaxTimestampAtOrBefore?: ReturnType<typeof mockFn>
  getActivityByTimestamp?: ReturnType<typeof mockFn>
  getTvsMaxTimestampAtOrBefore?: ReturnType<typeof mockFn>
  getTvsByTimestamp?: ReturnType<typeof mockFn>
  getAbstractTokenById?: ReturnType<typeof mockFn>
  chains?: readonly { id: string; type: 'evm' }[]
}) {
  const callerFactory = createCallerFactory(
    createHighlightsRouter({
      chains: options.chains ?? DEFAULT_CHAINS,
      tokenDbClient: mockObject<TokenDbClient>({
        abstractTokens: mockObject<TokenDbClient['abstractTokens']>({
          getById: mockObject<TokenDbClient['abstractTokens']['getById']>({
            query:
              options.getAbstractTokenById ?? mockFn().resolvesTo(undefined),
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
        getLatestTimestamp: mockFn().resolvesTo(options.latestTimestamp),
        getMaxTimestampAtOrBefore:
          options.getTransferMaxTimestampAtOrBefore ??
          mockFn().resolvesTo(undefined),
        getByTimestamp:
          options.getTransferByTimestamp ?? mockFn().resolvesTo([]),
      }),
      aggregatedInteropToken: mockObject<Database['aggregatedInteropToken']>({
        getByTimestamp: options.getTokenByTimestamp ?? mockFn().resolvesTo([]),
      }),
      activity: mockObject<Database['activity']>({
        getMaxTimestampAtOrBefore:
          options.getActivityMaxTimestampAtOrBefore ??
          mockFn().resolvesTo(undefined),
        getByTimestamp:
          options.getActivityByTimestamp ?? mockFn().resolvesTo([]),
      }),
      tvsTokenValue: mockObject<Database['tvsTokenValue']>({
        getMaxTimestampAtOrBefore:
          options.getTvsMaxTimestampAtOrBefore ??
          mockFn().resolvesTo(undefined),
        getByTimestamp: options.getTvsByTimestamp ?? mockFn().resolvesTo([]),
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
