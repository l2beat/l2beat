import type { Database } from '@l2beat/database'
import type { TokenDbClient } from '@l2beat/token-backend'
import { getInteropTransfersHighlights } from './getInteropTransfersHighlights'
import { getTvsIncreaseByChain } from './getTvsIncreaseByChain'
import { getUopsIncreaseByChain } from './getUopsIncreaseByChain'

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
  topChainByInflow: {
    windowStart: number
    windowEnd: number
    chain: string
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
        token: {
          id: string
          symbol: string
          issuer: string | null
          iconUrl: string | null
        }
      })
    | null
  largestVolumeIncreaseByProtocol:
    | (VolumeIncreaseHighlight & {
        id: string
      })
    | null
  largestUopsIncreaseByChain:
    | (CountIncreaseHighlight & {
        chain: string
      })
    | null
  largestTvsIncreaseByChain:
    | (VolumeIncreaseHighlight & {
        chain: string
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

interface CountIncreaseHighlight {
  windowStart: number
  windowEnd: number
  previousWindowStart: number
  previousWindowEnd: number
  currentCount: number
  previousCount: number
  increase: number
  increasePercent: number
}

export async function getInteropHighlights(
  db: Database,
  tokenDbClient: TokenDbClient,
  interopProjectIds: readonly string[],
): Promise<InteropHighlightsData> {
  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()

  if (latestTimestamp === undefined) {
    return emptyHighlights
  }

  const projectIds = Array.from(new Set(interopProjectIds))

  const [
    transferHighlights,
    largestUopsIncreaseByChain,
    largestTvsIncreaseByChain,
  ] = await Promise.all([
    getInteropTransfersHighlights(db, tokenDbClient, latestTimestamp),
    getUopsIncreaseByChain(db, latestTimestamp, projectIds),
    getTvsIncreaseByChain(db, latestTimestamp, projectIds),
  ])

  return {
    ...transferHighlights,
    largestUopsIncreaseByChain,
    largestTvsIncreaseByChain,
  }
}

const emptyHighlights = {
  topPathByVolume: null,
  topChainByInflow: null,
  largestVolumeIncreaseByChain: null,
  largestVolumeIncreaseByToken: null,
  largestVolumeIncreaseByProtocol: null,
  largestUopsIncreaseByChain: null,
  largestTvsIncreaseByChain: null,
}
