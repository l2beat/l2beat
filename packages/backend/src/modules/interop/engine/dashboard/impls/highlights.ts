import type { Database, TokenDatabase } from '@l2beat/database'
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
}

export async function getInteropHighlights(
  db: Database,
  tokenDb: TokenDatabase,
): Promise<InteropHighlightsData> {
  const [latestInteropTimestamp, latestActivityTimestamp, latestTvsTimestamp] =
    await Promise.all([
      db.aggregatedInteropTransfer.getLatestTimestamp(),
      db.activity.getLatestTimestamp(),
      db.tvsTokenValue.getLatestTimestamp(),
    ])

  const previousInteropTimestamp =
    latestInteropTimestamp !== undefined
      ? latestInteropTimestamp - UnixTime.DAY
      : undefined
  const previousActivityTimestamp =
    latestActivityTimestamp !== undefined
      ? latestActivityTimestamp - UnixTime.DAY
      : undefined
  const previousTvsTimestamp =
    latestTvsTimestamp !== undefined
      ? latestTvsTimestamp - UnixTime.DAY
      : undefined

  const [
    topPath,
    topChainByInflow,
    chainIncrease,
    tokenIncrease,
    protocolIncrease,
    uopsIncrease,
    tvsIncrease,
  ] = await Promise.all([
    latestInteropTimestamp !== undefined
      ? db.aggregatedInteropTransfer.getTopPathByVolumeAtTimestamp(
          latestInteropTimestamp,
        )
      : undefined,
    latestInteropTimestamp !== undefined
      ? db.aggregatedInteropTransfer.getTopDestinationChainByInflowAtTimestamp(
          latestInteropTimestamp,
        )
      : undefined,
    latestInteropTimestamp !== undefined &&
    previousInteropTimestamp !== undefined
      ? db.aggregatedInteropTransfer.getLargestSourceChainVolumeIncrease(
          latestInteropTimestamp,
          previousInteropTimestamp,
        )
      : undefined,
    latestInteropTimestamp !== undefined &&
    previousInteropTimestamp !== undefined
      ? db.aggregatedInteropToken.getLargestTokenVolumeIncrease(
          latestInteropTimestamp,
          previousInteropTimestamp,
        )
      : undefined,
    latestInteropTimestamp !== undefined &&
    previousInteropTimestamp !== undefined
      ? db.aggregatedInteropTransfer.getLargestProtocolVolumeIncrease(
          latestInteropTimestamp,
          previousInteropTimestamp,
        )
      : undefined,
    latestActivityTimestamp !== undefined &&
    previousActivityTimestamp !== undefined
      ? db.activity.getLargestUopsCountIncrease(
          latestActivityTimestamp,
          previousActivityTimestamp,
        )
      : undefined,
    latestTvsTimestamp !== undefined && previousTvsTimestamp !== undefined
      ? db.tvsTokenValue.getLargestTvsIncrease(
          latestTvsTimestamp,
          previousTvsTimestamp,
        )
      : undefined,
  ])

  const tokenInfo = tokenIncrease
    ? await tokenDb.abstractToken.findById(tokenIncrease.abstractTokenId)
    : undefined

  const interopWindow =
    latestInteropTimestamp !== undefined
      ? getComparisonWindow(latestInteropTimestamp)
      : undefined
  const activityWindow =
    latestActivityTimestamp !== undefined
      ? getComparisonWindow(latestActivityTimestamp)
      : undefined
  const tvsWindow =
    latestTvsTimestamp !== undefined
      ? getComparisonWindow(latestTvsTimestamp)
      : undefined

  return {
    topPathByVolume:
      topPath && interopWindow
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
    topChainByInflow:
      topChainByInflow && interopWindow
        ? {
            windowStart: interopWindow.windowStart,
            windowEnd: interopWindow.windowEnd,
            chain: topChainByInflow.chain,
            volumeUsd: topChainByInflow.volumeUsd,
            transferCount: topChainByInflow.transferCount,
            protocolCount: topChainByInflow.protocolCount,
          }
        : null,
    largestVolumeIncreaseByChain:
      chainIncrease && interopWindow
        ? {
            ...interopWindow,
            chain: chainIncrease.chain,
            currentVolumeUsd: chainIncrease.currentVolumeUsd,
            previousVolumeUsd: chainIncrease.previousVolumeUsd,
            increaseUsd: chainIncrease.increaseUsd,
          }
        : null,
    largestVolumeIncreaseByToken:
      tokenIncrease && interopWindow
        ? {
            ...interopWindow,
            token: {
              id: tokenIncrease.abstractTokenId,
              symbol: tokenInfo?.symbol ?? tokenIncrease.abstractTokenId,
              issuer: tokenInfo?.issuer ?? null,
              iconUrl: tokenInfo?.iconUrl ?? null,
            },
            currentVolumeUsd: tokenIncrease.currentVolumeUsd,
            previousVolumeUsd: tokenIncrease.previousVolumeUsd,
            increaseUsd: tokenIncrease.increaseUsd,
          }
        : null,
    largestVolumeIncreaseByProtocol:
      protocolIncrease && interopWindow
        ? {
            ...interopWindow,
            id: protocolIncrease.id,
            currentVolumeUsd: protocolIncrease.currentVolumeUsd,
            previousVolumeUsd: protocolIncrease.previousVolumeUsd,
            increaseUsd: protocolIncrease.increaseUsd,
          }
        : null,
    largestUopsIncreaseByChain:
      uopsIncrease && activityWindow
        ? {
            ...activityWindow,
            chain: uopsIncrease.projectId.toString(),
            currentCount: uopsIncrease.currentUopsCount,
            previousCount: uopsIncrease.previousUopsCount,
            increase: uopsIncrease.increase,
          }
        : null,
    largestTvsIncreaseByChain:
      tvsIncrease && tvsWindow
        ? {
            ...tvsWindow,
            chain: tvsIncrease.projectId,
            currentVolumeUsd: tvsIncrease.currentTvsUsd,
            previousVolumeUsd: tvsIncrease.previousTvsUsd,
            increaseUsd: tvsIncrease.increaseUsd,
          }
        : null,
  }
}

function getComparisonWindow(windowEnd: UnixTime) {
  return {
    windowStart: windowEnd - UnixTime.DAY,
    windowEnd,
    previousWindowStart: windowEnd - 2 * UnixTime.DAY,
    previousWindowEnd: windowEnd - UnixTime.DAY,
  }
}
