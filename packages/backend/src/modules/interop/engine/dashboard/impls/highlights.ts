import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'

export interface InteropHighlightsData {
  topPathByVolume: {
    windowStart: number
    windowEnd: number
    srcChain: string
    dstChain: string
    volumeUsd: number
    transferCount: number
    protocolCount: number
  } | null
  largestVolumeIncreaseByChain:
    | (VolumeIncreaseHighlight & {
        chain: string
      })
    | null
  largestVolumeIncreaseByToken:
    | (VolumeIncreaseHighlight & {
        abstractTokenId: string
      })
    | null
  largestVolumeIncreaseByProtocol:
    | (VolumeIncreaseHighlight & {
        id: string
      })
    | null
}

interface VolumeIncreaseHighlight {
  windowStart: number
  windowEnd: number
  previousWindowStart: number
  previousWindowEnd: number
  currentVolumeUsd: number
  previousVolumeUsd: number
  increaseUsd: number
}

export async function getInteropHighlights(
  db: Database,
): Promise<InteropHighlightsData> {
  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()

  if (!latestTimestamp) {
    return emptyHighlights()
  }

  const previousTimestamp = latestTimestamp - UnixTime.DAY
  const [topPath, chainIncrease, tokenIncrease, protocolIncrease] =
    await Promise.all([
      db.aggregatedInteropTransfer.getTopPathByVolumeAtTimestamp(
        latestTimestamp,
      ),
      db.aggregatedInteropTransfer.getLargestSourceChainVolumeIncrease(
        latestTimestamp,
        previousTimestamp,
      ),
      db.aggregatedInteropToken.getLargestTokenVolumeIncrease(
        latestTimestamp,
        previousTimestamp,
      ),
      db.aggregatedInteropTransfer.getLargestProtocolVolumeIncrease(
        latestTimestamp,
        previousTimestamp,
      ),
    ])

  const window = {
    windowStart: latestTimestamp - UnixTime.DAY,
    windowEnd: latestTimestamp,
    previousWindowStart: latestTimestamp - 2 * UnixTime.DAY,
    previousWindowEnd: latestTimestamp - UnixTime.DAY,
  }

  return {
    topPathByVolume: topPath
      ? {
          windowStart: window.windowStart,
          windowEnd: window.windowEnd,
          srcChain: topPath.srcChain,
          dstChain: topPath.dstChain,
          volumeUsd: topPath.volumeUsd,
          transferCount: topPath.transferCount,
          protocolCount: topPath.protocolCount,
        }
      : null,
    largestVolumeIncreaseByChain: chainIncrease
      ? {
          ...window,
          chain: chainIncrease.chain,
          currentVolumeUsd: chainIncrease.currentVolumeUsd,
          previousVolumeUsd: chainIncrease.previousVolumeUsd,
          increaseUsd: chainIncrease.increaseUsd,
        }
      : null,
    largestVolumeIncreaseByToken: tokenIncrease
      ? {
          ...window,
          abstractTokenId: tokenIncrease.abstractTokenId,
          currentVolumeUsd: tokenIncrease.currentVolumeUsd,
          previousVolumeUsd: tokenIncrease.previousVolumeUsd,
          increaseUsd: tokenIncrease.increaseUsd,
        }
      : null,
    largestVolumeIncreaseByProtocol: protocolIncrease
      ? {
          ...window,
          id: protocolIncrease.id,
          currentVolumeUsd: protocolIncrease.currentVolumeUsd,
          previousVolumeUsd: protocolIncrease.previousVolumeUsd,
          increaseUsd: protocolIncrease.increaseUsd,
        }
      : null,
  }
}

function emptyHighlights(): InteropHighlightsData {
  return {
    topPathByVolume: null,
    largestVolumeIncreaseByChain: null,
    largestVolumeIncreaseByToken: null,
    largestVolumeIncreaseByProtocol: null,
  }
}
