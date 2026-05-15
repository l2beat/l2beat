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
}

export async function getInteropHighlights(
  db: Database,
): Promise<InteropHighlightsData> {
  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()

  if (!latestTimestamp) {
    return {
      topPathByVolume: null,
    }
  }

  const topPath =
    await db.aggregatedInteropTransfer.getTopPathByVolumeAtTimestamp(
      latestTimestamp,
    )

  if (!topPath) {
    return {
      topPathByVolume: null,
    }
  }

  return {
    topPathByVolume: {
      windowStart: latestTimestamp - UnixTime.DAY,
      windowEnd: latestTimestamp,
      srcChain: topPath.srcChain,
      dstChain: topPath.dstChain,
      volumeUsd: topPath.volumeUsd,
      transferCount: topPath.transferCount,
      protocolCount: topPath.protocolCount,
    },
  }
}
