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
    const aggregatedInteropTransfer = mockObject<
      Database['aggregatedInteropTransfer']
    >({
      getLatestTimestamp,
      getTopPathByVolumeAtTimestamp,
    })
    const caller = createCaller(aggregatedInteropTransfer)

    const result = await caller.latest()

    expect(getLatestTimestamp).toHaveBeenCalledTimes(1)
    expect(getTopPathByVolumeAtTimestamp).toHaveBeenCalledWith(latestTimestamp)
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
    })
  })

  it('returns empty metric when no aggregate snapshot exists', async () => {
    const getTopPathByVolumeAtTimestamp = mockFn().resolvesTo(undefined)
    const aggregatedInteropTransfer = mockObject<
      Database['aggregatedInteropTransfer']
    >({
      getLatestTimestamp: mockFn().resolvesTo(undefined),
      getTopPathByVolumeAtTimestamp,
    })
    const caller = createCaller(aggregatedInteropTransfer)

    const result = await caller.latest()

    expect(getTopPathByVolumeAtTimestamp).not.toHaveBeenCalled()
    expect(result).toEqual({
      topPathByVolume: null,
    })
  })
})

function createCaller(
  aggregatedInteropTransfer: Database['aggregatedInteropTransfer'],
) {
  const callerFactory = createCallerFactory(createHighlightsRouter())
  return callerFactory({
    headers: new Headers(),
    db: mockObject<Database>({
      aggregatedInteropTransfer,
    }),
    session: { email: 'dev@l2beat.com' },
  })
}
