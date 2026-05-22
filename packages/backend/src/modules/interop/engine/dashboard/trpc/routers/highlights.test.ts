import type {
  ActivityRecord,
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
  Database,
  TokenDatabase,
  TokenValueRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
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
    const getTokenByTimestamp = mockFn()
      .resolvesToOnce(currentTokens)
      .resolvesToOnce(previousTokens)
      .resolvesTo([])
    const getActivityByTimestamp = mockFn()
      .resolvesToOnce(currentActivity)
      .resolvesToOnce(previousActivity)
      .resolvesToOnce(olderActivity)
      .resolvesTo([])
    const getTvsByTimestamp = mockFn()
      .resolvesToOnce(currentTvs)
      .resolvesToOnce(previousTvs)
      .resolvesToOnce(olderTvs)
      .resolvesTo([])

    const caller = createCaller({
      latestTimestamp,
      getTransferByTimestamp,
      getTokenByTimestamp,
      getActivityByTimestamp,
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
    const activityWindow = interopWindow
    const tvsWindow = interopWindow
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
    const uopsIncrease = getLargestUopsCountIncrease(
      currentActivity,
      previousActivity,
      olderActivity,
      latestTimestamp,
    )
    const tvsIncrease = getLargestTvsIncrease(
      currentTvs,
      previousTvs,
      olderTvs,
      latestTimestamp,
    )

    expect(getTransferByTimestamp).toHaveBeenCalledTimes(2)
    expect(getTokenByTimestamp).toHaveBeenCalledTimes(2)
    expect(getActivityByTimestamp).toHaveBeenCalledTimes(3)
    expect(getTvsByTimestamp).toHaveBeenCalledTimes(3)
    expect(getAbstractTokenById).toHaveBeenCalledWith('9HN5PN')
    expect(result).toEqual({
      topPathByVolume: topPath
        ? {
            windowStart: interopWindow.windowStart,
            windowEnd: interopWindow.windowEnd,
            srcChain: topPath.srcChain,
            dstChain: topPath.dstChain,
            volumeUsd: topPath.volumeUsd,
            transferCount: topPath.transferCount,
            protocolCount: topPath.protocolCount,
          }
        : null,
      topChainByInflow: topChainByInflow
        ? {
            windowStart: interopWindow.windowStart,
            windowEnd: interopWindow.windowEnd,
            chain: topChainByInflow.chain,
            volumeUsd: topChainByInflow.volumeUsd,
            transferCount: topChainByInflow.transferCount,
            protocolCount: topChainByInflow.protocolCount,
          }
        : null,
      largestVolumeIncreaseByChain: chainIncrease
        ? {
            ...interopWindow,
            chain: chainIncrease.chain,
            currentVolumeUsd: chainIncrease.currentVolumeUsd,
            previousVolumeUsd: chainIncrease.previousVolumeUsd,
            increaseUsd: chainIncrease.increaseUsd,
          }
        : null,
      largestVolumeIncreaseByToken: tokenIncrease
        ? {
            ...interopWindow,
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
            ...interopWindow,
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
            ...tvsWindow,
            chain: tvsIncrease.projectId,
            currentVolumeUsd: tvsIncrease.currentTvsUsd,
            previousVolumeUsd: tvsIncrease.previousTvsUsd,
            increaseUsd: tvsIncrease.increaseUsd,
          }
        : null,
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
})

function createCaller(options: {
  latestTimestamp: UnixTime | undefined
  getTransferByTimestamp?: ReturnType<typeof mockFn>
  getTokenByTimestamp?: ReturnType<typeof mockFn>
  getActivityByTimestamp?: ReturnType<typeof mockFn>
  getTvsByTimestamp?: ReturnType<typeof mockFn>
  getAbstractTokenById?: ReturnType<typeof mockFn>
}) {
  const callerFactory = createCallerFactory(
    createHighlightsRouter({
      tokenDb: mockObject<TokenDatabase>({
        abstractToken: mockObject<TokenDatabase['abstractToken']>({
          findById: options.getAbstractTokenById ?? mockFn(),
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
        getByTimestamp:
          options.getTransferByTimestamp ?? mockFn().resolvesTo([]),
      }),
      aggregatedInteropToken: mockObject<Database['aggregatedInteropToken']>({
        getByTimestamp: options.getTokenByTimestamp ?? mockFn().resolvesTo([]),
      }),
      activity: mockObject<Database['activity']>({
        getLatestTimestamp: mockFn().resolvesTo(options.latestTimestamp),
        getByTimestamp:
          options.getActivityByTimestamp ?? mockFn().resolvesTo([]),
      }),
      tvsTokenValue: mockObject<Database['tvsTokenValue']>({
        getLatestTimestamp: mockFn().resolvesTo(options.latestTimestamp),
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
