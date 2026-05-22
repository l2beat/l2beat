import type { Database, TokenDatabase } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import {
  getLargestProtocolVolumeIncrease,
  getLargestSourceChainVolumeIncrease,
  getLargestTokenVolumeIncrease,
  getLargestTvsIncrease,
  getLargestUopsCountIncrease,
  getTopDestinationChainByInflowAtTimestamp,
  getTopPathByVolumeAtTimestamp,
} from './highlightsCalculations'

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
  const olderActivityTimestamp =
    previousActivityTimestamp !== undefined
      ? previousActivityTimestamp - UnixTime.DAY
      : undefined
  const olderTvsTimestamp =
    previousTvsTimestamp !== undefined
      ? previousTvsTimestamp - UnixTime.DAY
      : undefined

  const [
    currentInteropRecords,
    previousInteropRecords,
    currentTokenRecords,
    previousTokenRecords,
    currentActivityRecords,
    previousActivityRecords,
    olderActivityRecords,
    currentTvsRecords,
    previousTvsRecords,
    olderTvsRecords,
  ] = await Promise.all([
    latestInteropTimestamp !== undefined
      ? db.aggregatedInteropTransfer.getByTimestamp(latestInteropTimestamp)
      : [],
    previousInteropTimestamp !== undefined
      ? db.aggregatedInteropTransfer.getByTimestamp(previousInteropTimestamp)
      : [],
    latestInteropTimestamp !== undefined
      ? db.aggregatedInteropToken.getByTimestamp(latestInteropTimestamp)
      : [],
    previousInteropTimestamp !== undefined
      ? db.aggregatedInteropToken.getByTimestamp(previousInteropTimestamp)
      : [],
    latestActivityTimestamp !== undefined
      ? db.activity.getByTimestamp(latestActivityTimestamp)
      : [],
    previousActivityTimestamp !== undefined
      ? db.activity.getByTimestamp(previousActivityTimestamp)
      : [],
    olderActivityTimestamp !== undefined
      ? db.activity.getByTimestamp(olderActivityTimestamp)
      : [],
    latestTvsTimestamp !== undefined
      ? db.tvsTokenValue.getByTimestamp(latestTvsTimestamp)
      : [],
    previousTvsTimestamp !== undefined
      ? db.tvsTokenValue.getByTimestamp(previousTvsTimestamp)
      : [],
    olderTvsTimestamp !== undefined
      ? db.tvsTokenValue.getByTimestamp(olderTvsTimestamp)
      : [],
  ])

  const topPath =
    latestInteropTimestamp !== undefined
      ? getTopPathByVolumeAtTimestamp(
          currentInteropRecords,
          latestInteropTimestamp,
        )
      : undefined
  const topChainByInflow =
    latestInteropTimestamp !== undefined
      ? getTopDestinationChainByInflowAtTimestamp(
          currentInteropRecords,
          latestInteropTimestamp,
        )
      : undefined
  const chainIncrease =
    latestInteropTimestamp !== undefined &&
    previousInteropTimestamp !== undefined
      ? getLargestSourceChainVolumeIncrease(
          currentInteropRecords,
          previousInteropRecords,
          latestInteropTimestamp,
        )
      : undefined
  const tokenIncrease =
    latestInteropTimestamp !== undefined &&
    previousInteropTimestamp !== undefined
      ? getLargestTokenVolumeIncrease(
          currentTokenRecords,
          previousTokenRecords,
          latestInteropTimestamp,
        )
      : undefined
  const protocolIncrease =
    latestInteropTimestamp !== undefined &&
    previousInteropTimestamp !== undefined
      ? getLargestProtocolVolumeIncrease(
          currentInteropRecords,
          previousInteropRecords,
          latestInteropTimestamp,
        )
      : undefined
  const uopsIncrease =
    latestActivityTimestamp !== undefined &&
    previousActivityTimestamp !== undefined &&
    olderActivityTimestamp !== undefined
      ? getLargestUopsCountIncrease(
          currentActivityRecords,
          previousActivityRecords,
          olderActivityRecords,
          latestActivityTimestamp,
        )
      : undefined
  const tvsIncrease =
    latestTvsTimestamp !== undefined &&
    previousTvsTimestamp !== undefined &&
    olderTvsTimestamp !== undefined
      ? getLargestTvsIncrease(
          currentTvsRecords,
          previousTvsRecords,
          olderTvsRecords,
          latestTvsTimestamp,
        )
      : undefined

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
            increasePercent: uopsIncrease.increasePercent,
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
