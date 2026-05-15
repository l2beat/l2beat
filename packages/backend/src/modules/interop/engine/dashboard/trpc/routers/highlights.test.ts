import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createHighlightsRouter } from './highlights'

describe(createHighlightsRouter.name, () => {
  it('returns highlights for the latest aggregate snapshot', async () => {
    const latestTimestamp = UnixTime(1_700_000_000)
    const getLatestTimestamp = mockFn().resolvesTo(latestTimestamp)
    const getTopPathByVolumeAtTimestamp = mockFn().resolvesTo({
      timestamp: latestTimestamp,
      srcChain: 'ethereum',
      dstChain: 'arbitrum',
      volumeUsd: 1_200_000,
      transferCount: 123,
      protocolCount: 2,
    })
    const getTopDestinationChainByInflowAtTimestamp = mockFn().resolvesTo({
      timestamp: latestTimestamp,
      chain: 'arbitrum',
      volumeUsd: 1_800_000,
      transferCount: 200,
      protocolCount: 3,
    })
    const getLargestSourceChainVolumeIncrease = mockFn().resolvesTo({
      timestamp: latestTimestamp,
      chain: 'ethereum',
      currentVolumeUsd: 1_500_000,
      previousVolumeUsd: 900_000,
      increaseUsd: 600_000,
    })
    const getLargestProtocolVolumeIncrease = mockFn().resolvesTo({
      timestamp: latestTimestamp,
      id: 'across',
      currentVolumeUsd: 2_000_000,
      previousVolumeUsd: 1_100_000,
      increaseUsd: 900_000,
    })
    const getLargestTokenVolumeIncrease = mockFn().resolvesTo({
      timestamp: latestTimestamp,
      abstractTokenId: 'usdc',
      currentVolumeUsd: 3_000_000,
      previousVolumeUsd: 1_000_000,
      increaseUsd: 2_000_000,
    })
    const getLargestUopsCountIncrease = mockFn().resolvesTo({
      timestamp: latestTimestamp,
      projectId: 'base',
      currentUopsCount: 4_000_000,
      previousUopsCount: 2_500_000,
      increase: 1_500_000,
    })
    const getLargestTvsIncrease = mockFn().resolvesTo({
      timestamp: latestTimestamp,
      projectId: 'optimism',
      currentTvsUsd: 5_000_000_000,
      previousTvsUsd: 4_500_000_000,
      increaseUsd: 500_000_000,
    })
    const aggregatedInteropTransfer = mockObject<
      Database['aggregatedInteropTransfer']
    >({
      getLatestTimestamp,
      getTopPathByVolumeAtTimestamp,
      getTopDestinationChainByInflowAtTimestamp,
      getLargestSourceChainVolumeIncrease,
      getLargestProtocolVolumeIncrease,
    })
    const aggregatedInteropToken = mockObject<
      Database['aggregatedInteropToken']
    >({
      getLargestTokenVolumeIncrease,
    })
    const activity = mockObject<Database['activity']>({
      getLatestTimestamp: mockFn().resolvesTo(latestTimestamp),
      getLargestUopsCountIncrease,
    })
    const tvsTokenValue = mockObject<Database['tvsTokenValue']>({
      getLatestTimestamp: mockFn().resolvesTo(latestTimestamp),
      getLargestTvsIncrease,
    })
    const caller = createCaller({
      aggregatedInteropTransfer,
      aggregatedInteropToken,
      activity,
      tvsTokenValue,
    })

    const result = await caller.latest()

    expect(getLatestTimestamp).toHaveBeenCalledTimes(1)
    expect(getTopPathByVolumeAtTimestamp).toHaveBeenCalledWith(latestTimestamp)
    expect(getTopDestinationChainByInflowAtTimestamp).toHaveBeenCalledWith(
      latestTimestamp,
    )
    expect(getLargestSourceChainVolumeIncrease).toHaveBeenCalledWith(
      latestTimestamp,
      latestTimestamp - UnixTime.DAY,
    )
    expect(getLargestTokenVolumeIncrease).toHaveBeenCalledWith(
      latestTimestamp,
      latestTimestamp - UnixTime.DAY,
    )
    expect(getLargestProtocolVolumeIncrease).toHaveBeenCalledWith(
      latestTimestamp,
      latestTimestamp - UnixTime.DAY,
    )
    expect(getLargestUopsCountIncrease).toHaveBeenCalledWith(
      latestTimestamp,
      latestTimestamp - UnixTime.DAY,
    )
    expect(getLargestTvsIncrease).toHaveBeenCalledWith(
      latestTimestamp,
      latestTimestamp - UnixTime.DAY,
    )
    expect(result).toEqual({
      topPathByVolume: {
        windowStart: latestTimestamp - UnixTime.DAY,
        windowEnd: latestTimestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        volumeUsd: 1_200_000,
        transferCount: 123,
        protocolCount: 2,
      },
      topChainByInflow: {
        windowStart: latestTimestamp - UnixTime.DAY,
        windowEnd: latestTimestamp,
        chain: 'arbitrum',
        volumeUsd: 1_800_000,
        transferCount: 200,
        protocolCount: 3,
      },
      largestVolumeIncreaseByChain: {
        windowStart: latestTimestamp - UnixTime.DAY,
        windowEnd: latestTimestamp,
        previousWindowStart: latestTimestamp - 2 * UnixTime.DAY,
        previousWindowEnd: latestTimestamp - UnixTime.DAY,
        chain: 'ethereum',
        currentVolumeUsd: 1_500_000,
        previousVolumeUsd: 900_000,
        increaseUsd: 600_000,
      },
      largestVolumeIncreaseByToken: {
        windowStart: latestTimestamp - UnixTime.DAY,
        windowEnd: latestTimestamp,
        previousWindowStart: latestTimestamp - 2 * UnixTime.DAY,
        previousWindowEnd: latestTimestamp - UnixTime.DAY,
        abstractTokenId: 'usdc',
        currentVolumeUsd: 3_000_000,
        previousVolumeUsd: 1_000_000,
        increaseUsd: 2_000_000,
      },
      largestVolumeIncreaseByProtocol: {
        windowStart: latestTimestamp - UnixTime.DAY,
        windowEnd: latestTimestamp,
        previousWindowStart: latestTimestamp - 2 * UnixTime.DAY,
        previousWindowEnd: latestTimestamp - UnixTime.DAY,
        id: 'across',
        currentVolumeUsd: 2_000_000,
        previousVolumeUsd: 1_100_000,
        increaseUsd: 900_000,
      },
      largestUopsIncreaseByChain: {
        windowStart: latestTimestamp - UnixTime.DAY,
        windowEnd: latestTimestamp,
        previousWindowStart: latestTimestamp - 2 * UnixTime.DAY,
        previousWindowEnd: latestTimestamp - UnixTime.DAY,
        chain: 'base',
        currentCount: 4_000_000,
        previousCount: 2_500_000,
        increase: 1_500_000,
      },
      largestTvsIncreaseByChain: {
        windowStart: latestTimestamp - UnixTime.DAY,
        windowEnd: latestTimestamp,
        previousWindowStart: latestTimestamp - 2 * UnixTime.DAY,
        previousWindowEnd: latestTimestamp - UnixTime.DAY,
        chain: 'optimism',
        currentVolumeUsd: 5_000_000_000,
        previousVolumeUsd: 4_500_000_000,
        increaseUsd: 500_000_000,
      },
    })
  })

  it('returns empty metrics when no snapshots exist', async () => {
    const getTopPathByVolumeAtTimestamp = mockFn().resolvesTo(undefined)
    const getTopDestinationChainByInflowAtTimestamp =
      mockFn().resolvesTo(undefined)
    const getLargestSourceChainVolumeIncrease = mockFn().resolvesTo(undefined)
    const getLargestProtocolVolumeIncrease = mockFn().resolvesTo(undefined)
    const getLargestTokenVolumeIncrease = mockFn().resolvesTo(undefined)
    const getLargestUopsCountIncrease = mockFn().resolvesTo(undefined)
    const getLargestTvsIncrease = mockFn().resolvesTo(undefined)
    const aggregatedInteropTransfer = mockObject<
      Database['aggregatedInteropTransfer']
    >({
      getLatestTimestamp: mockFn().resolvesTo(undefined),
      getTopPathByVolumeAtTimestamp,
      getTopDestinationChainByInflowAtTimestamp,
      getLargestSourceChainVolumeIncrease,
      getLargestProtocolVolumeIncrease,
    })
    const aggregatedInteropToken = mockObject<
      Database['aggregatedInteropToken']
    >({
      getLargestTokenVolumeIncrease,
    })
    const activity = mockObject<Database['activity']>({
      getLatestTimestamp: mockFn().resolvesTo(undefined),
      getLargestUopsCountIncrease,
    })
    const tvsTokenValue = mockObject<Database['tvsTokenValue']>({
      getLatestTimestamp: mockFn().resolvesTo(undefined),
      getLargestTvsIncrease,
    })
    const caller = createCaller({
      aggregatedInteropTransfer,
      aggregatedInteropToken,
      activity,
      tvsTokenValue,
    })

    const result = await caller.latest()

    expect(getTopPathByVolumeAtTimestamp).not.toHaveBeenCalled()
    expect(getTopDestinationChainByInflowAtTimestamp).not.toHaveBeenCalled()
    expect(getLargestSourceChainVolumeIncrease).not.toHaveBeenCalled()
    expect(getLargestTokenVolumeIncrease).not.toHaveBeenCalled()
    expect(getLargestProtocolVolumeIncrease).not.toHaveBeenCalled()
    expect(getLargestUopsCountIncrease).not.toHaveBeenCalled()
    expect(getLargestTvsIncrease).not.toHaveBeenCalled()
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

function createCaller(repositories: {
  aggregatedInteropTransfer: Database['aggregatedInteropTransfer']
  aggregatedInteropToken: Database['aggregatedInteropToken']
  activity: Database['activity']
  tvsTokenValue: Database['tvsTokenValue']
}) {
  const callerFactory = createCallerFactory(createHighlightsRouter())
  return callerFactory({
    headers: new Headers(),
    db: mockObject<Database>({
      aggregatedInteropTransfer: repositories.aggregatedInteropTransfer,
      aggregatedInteropToken: repositories.aggregatedInteropToken,
      activity: repositories.activity,
      tvsTokenValue: repositories.tvsTokenValue,
    }),
    session: { email: 'dev@l2beat.com' },
  })
}
