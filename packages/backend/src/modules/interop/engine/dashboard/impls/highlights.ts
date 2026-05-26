import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
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
  tokenDbClient: TokenDbClient,
  interopProjectIds: readonly string[],
): Promise<InteropHighlightsData> {
  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()
  const interopProjects = new Set(interopProjectIds)

  const previousTimestamp =
    latestTimestamp !== undefined ? latestTimestamp - UnixTime.DAY : undefined

  let activityTimestamp =
    latestTimestamp !== undefined
      ? await db.activity.getMaxTimestampAtOrBefore(latestTimestamp)
      : undefined

  if (
    activityTimestamp !== undefined &&
    latestTimestamp !== undefined &&
    activityTimestamp === UnixTime.toStartOf(latestTimestamp, 'day') &&
    latestTimestamp > activityTimestamp
  ) {
    activityTimestamp = activityTimestamp - UnixTime.DAY
  }

  const activityPreviousTimestamp =
    activityTimestamp !== undefined
      ? activityTimestamp - UnixTime.DAY
      : undefined
  const activityOlderTimestamp =
    activityTimestamp !== undefined
      ? activityTimestamp - 2 * UnixTime.DAY
      : undefined

  const tvsTimestamp =
    latestTimestamp !== undefined
      ? await db.tvsTokenValue.getMaxTimestampAtOrBefore(latestTimestamp)
      : undefined
  const tvsPreviousTimestamp =
    tvsTimestamp !== undefined
      ? await db.tvsTokenValue.getMaxTimestampAtOrBefore(
          tvsTimestamp - UnixTime.DAY,
        )
      : undefined
  const tvsOlderTimestamp =
    tvsPreviousTimestamp !== undefined
      ? await db.tvsTokenValue.getMaxTimestampAtOrBefore(
          tvsPreviousTimestamp - UnixTime.DAY,
        )
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
    latestTimestamp !== undefined
      ? db.aggregatedInteropTransfer.getByTimestamp(latestTimestamp)
      : [],
    previousTimestamp !== undefined
      ? db.aggregatedInteropTransfer.getByTimestamp(previousTimestamp)
      : [],
    latestTimestamp !== undefined
      ? db.aggregatedInteropToken.getByTimestamp(latestTimestamp)
      : [],
    previousTimestamp !== undefined
      ? db.aggregatedInteropToken.getByTimestamp(previousTimestamp)
      : [],
    activityTimestamp !== undefined
      ? db.activity.getByTimestamp(activityTimestamp)
      : [],
    activityPreviousTimestamp !== undefined
      ? db.activity.getByTimestamp(activityPreviousTimestamp)
      : [],
    activityOlderTimestamp !== undefined
      ? db.activity.getByTimestamp(activityOlderTimestamp)
      : [],
    tvsTimestamp !== undefined
      ? db.tvsTokenValue.getByTimestamp(tvsTimestamp)
      : [],
    tvsPreviousTimestamp !== undefined
      ? db.tvsTokenValue.getByTimestamp(tvsPreviousTimestamp)
      : [],
    tvsOlderTimestamp !== undefined
      ? db.tvsTokenValue.getByTimestamp(tvsOlderTimestamp)
      : [],
  ])

  const topPath =
    latestTimestamp !== undefined
      ? getTopPathByVolumeAtTimestamp(currentInteropRecords, latestTimestamp)
      : undefined
  const topChainByInflow =
    latestTimestamp !== undefined
      ? getTopDestinationChainByInflowAtTimestamp(
          currentInteropRecords,
          latestTimestamp,
        )
      : undefined
  const chainIncrease =
    latestTimestamp !== undefined && previousTimestamp !== undefined
      ? getLargestSourceChainVolumeIncrease(
          currentInteropRecords,
          previousInteropRecords,
          latestTimestamp,
        )
      : undefined
  const tokenIncrease =
    latestTimestamp !== undefined && previousTimestamp !== undefined
      ? getLargestTokenVolumeIncrease(
          currentTokenRecords,
          previousTokenRecords,
          latestTimestamp,
        )
      : undefined
  const protocolIncrease =
    latestTimestamp !== undefined && previousTimestamp !== undefined
      ? getLargestProtocolVolumeIncrease(
          currentInteropRecords,
          previousInteropRecords,
          latestTimestamp,
        )
      : undefined
  const uopsIncrease =
    activityTimestamp !== undefined &&
    activityPreviousTimestamp !== undefined &&
    activityOlderTimestamp !== undefined
      ? getLargestUopsCountIncrease(
          currentActivityRecords,
          previousActivityRecords,
          olderActivityRecords,
          activityTimestamp,
          interopProjects,
        )
      : undefined
  const tvsIncrease =
    tvsTimestamp !== undefined &&
    tvsPreviousTimestamp !== undefined &&
    tvsOlderTimestamp !== undefined
      ? getLargestTvsIncrease(
          currentTvsRecords,
          previousTvsRecords,
          olderTvsRecords,
          tvsTimestamp,
          interopProjects,
        )
      : undefined

  const tokenInfo = tokenIncrease
    ? await tokenDbClient.abstractTokens.getById.query(
        tokenIncrease.abstractTokenId,
      )
    : null

  const comparisonWindow =
    latestTimestamp !== undefined
      ? getComparisonWindow(latestTimestamp)
      : undefined
  const activityWindow =
    activityTimestamp !== undefined
      ? getComparisonWindow(activityTimestamp)
      : undefined
  const tvsWindow =
    tvsTimestamp !== undefined ? getComparisonWindow(tvsTimestamp) : undefined

  return {
    topPathByVolume:
      topPath && comparisonWindow
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
    topChainByInflow:
      topChainByInflow && comparisonWindow
        ? {
            windowStart: comparisonWindow.windowStart,
            windowEnd: comparisonWindow.windowEnd,
            chain: topChainByInflow.chain,
            volumeUsd: topChainByInflow.volumeUsd,
            transferCount: topChainByInflow.transferCount,
            protocolCount: topChainByInflow.protocolCount,
          }
        : null,
    largestVolumeIncreaseByChain:
      chainIncrease && comparisonWindow
        ? {
            ...comparisonWindow,
            chain: chainIncrease.chain,
            currentVolumeUsd: chainIncrease.currentVolumeUsd,
            previousVolumeUsd: chainIncrease.previousVolumeUsd,
            increaseUsd: chainIncrease.increaseUsd,
          }
        : null,
    largestVolumeIncreaseByToken:
      tokenIncrease && comparisonWindow
        ? {
            ...comparisonWindow,
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
      protocolIncrease && comparisonWindow
        ? {
            ...comparisonWindow,
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
