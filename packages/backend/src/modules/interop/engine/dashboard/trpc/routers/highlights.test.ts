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
    const aggregatedInteropTransfer = mockObject<
      Database['aggregatedInteropTransfer']
    >({
      getLatestTimestamp,
      getTopPathByVolumeAtTimestamp,
      getLargestSourceChainVolumeIncrease,
      getLargestProtocolVolumeIncrease,
    })
    const aggregatedInteropToken = mockObject<
      Database['aggregatedInteropToken']
    >({
      getLargestTokenVolumeIncrease,
    })
    const caller = createCaller({
      aggregatedInteropTransfer,
      aggregatedInteropToken,
    })

    const result = await caller.latest()

    expect(getLatestTimestamp).toHaveBeenCalledTimes(1)
    expect(getTopPathByVolumeAtTimestamp).toHaveBeenCalledWith(latestTimestamp)
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
    })
  })

  it('returns empty metric when no aggregate snapshot exists', async () => {
    const getTopPathByVolumeAtTimestamp = mockFn().resolvesTo(undefined)
    const getLargestSourceChainVolumeIncrease = mockFn().resolvesTo(undefined)
    const getLargestProtocolVolumeIncrease = mockFn().resolvesTo(undefined)
    const getLargestTokenVolumeIncrease = mockFn().resolvesTo(undefined)
    const aggregatedInteropTransfer = mockObject<
      Database['aggregatedInteropTransfer']
    >({
      getLatestTimestamp: mockFn().resolvesTo(undefined),
      getTopPathByVolumeAtTimestamp,
      getLargestSourceChainVolumeIncrease,
      getLargestProtocolVolumeIncrease,
    })
    const aggregatedInteropToken = mockObject<
      Database['aggregatedInteropToken']
    >({
      getLargestTokenVolumeIncrease,
    })
    const caller = createCaller({
      aggregatedInteropTransfer,
      aggregatedInteropToken,
    })

    const result = await caller.latest()

    expect(getTopPathByVolumeAtTimestamp).not.toHaveBeenCalled()
    expect(getLargestSourceChainVolumeIncrease).not.toHaveBeenCalled()
    expect(getLargestTokenVolumeIncrease).not.toHaveBeenCalled()
    expect(getLargestProtocolVolumeIncrease).not.toHaveBeenCalled()
    expect(result).toEqual({
      topPathByVolume: null,
      largestVolumeIncreaseByChain: null,
      largestVolumeIncreaseByToken: null,
      largestVolumeIncreaseByProtocol: null,
    })
  })
})

function createCaller(repositories: {
  aggregatedInteropTransfer: Database['aggregatedInteropTransfer']
  aggregatedInteropToken: Database['aggregatedInteropToken']
}) {
  const callerFactory = createCallerFactory(createHighlightsRouter())
  return callerFactory({
    headers: new Headers(),
    db: mockObject<Database>({
      aggregatedInteropTransfer: repositories.aggregatedInteropTransfer,
      aggregatedInteropToken: repositories.aggregatedInteropToken,
    }),
    session: { email: 'dev@l2beat.com' },
  })
}
