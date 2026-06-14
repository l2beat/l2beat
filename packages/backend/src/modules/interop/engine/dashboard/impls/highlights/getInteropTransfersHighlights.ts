import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { getComparisonWindow } from './getComparisonWindow'
import {
  getLargestProtocolVolumeIncrease,
  getLargestSourceChainVolumeIncrease,
  getLargestTokenVolumeIncrease,
  getTopDestinationChainByInflowAtTimestamp,
  getTopPathByVolumeAtTimestamp,
} from './highlightsCalculations'

export async function getInteropTransfersHighlights(
  db: Database,
  tokenDbClient: TokenDbClient,
  latestTimestamp: UnixTime,
) {
  const previousTimestamp =
    await db.aggregatedInteropTransfer.getMaxTimestampAtOrBefore(
      latestTimestamp - UnixTime.DAY,
    )

  if (!previousTimestamp) {
    return {
      topPathByVolume: null,
      topChainByInflow: null,
      largestVolumeIncreaseByChain: null,
      largestVolumeIncreaseByToken: null,
      largestVolumeIncreaseByProtocol: null,
    }
  }

  const [
    currentInteropRecords,
    previousInteropRecords,
    currentTokenRecords,
    previousTokenRecords,
  ] = await Promise.all([
    db.aggregatedInteropTransfer.getByTimestamp(latestTimestamp),
    db.aggregatedInteropTransfer.getByTimestamp(previousTimestamp),
    db.aggregatedInteropToken.getByTimestamp(latestTimestamp),
    db.aggregatedInteropToken.getByTimestamp(previousTimestamp),
  ])

  const topPath = getTopPathByVolumeAtTimestamp(
    currentInteropRecords,
    latestTimestamp,
  )
  const topChainByInflow = getTopDestinationChainByInflowAtTimestamp(
    currentInteropRecords,
    latestTimestamp,
  )

  const chainIncrease = getLargestSourceChainVolumeIncrease(
    currentInteropRecords,
    previousInteropRecords,
    latestTimestamp,
  )
  const tokenIncrease = getLargestTokenVolumeIncrease(
    currentTokenRecords,
    previousTokenRecords,
    latestTimestamp,
  )
  const protocolIncrease = getLargestProtocolVolumeIncrease(
    currentInteropRecords,
    previousInteropRecords,
    latestTimestamp,
  )

  const tokenInfo = tokenIncrease
    ? await tokenDbClient.abstractTokens.getById.query(
        tokenIncrease.abstractTokenId,
      )
    : null

  const comparisonWindow = getComparisonWindow(
    latestTimestamp,
    previousTimestamp,
  )

  return {
    topPathByVolume: topPath
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
    topChainByInflow: topChainByInflow
      ? {
          windowStart: comparisonWindow.windowStart,
          windowEnd: comparisonWindow.windowEnd,
          chain: topChainByInflow.chain,
          volumeUsd: topChainByInflow.volumeUsd,
          transferCount: topChainByInflow.transferCount,
          protocolCount: topChainByInflow.protocolCount,
        }
      : null,
    largestVolumeIncreaseByChain: chainIncrease
      ? {
          ...comparisonWindow,
          chain: chainIncrease.chain,
          currentVolumeUsd: chainIncrease.currentVolumeUsd,
          previousVolumeUsd: chainIncrease.previousVolumeUsd,
          increaseUsd: chainIncrease.increaseUsd,
        }
      : null,
    largestVolumeIncreaseByToken: tokenIncrease
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
    largestVolumeIncreaseByProtocol: protocolIncrease
      ? {
          ...comparisonWindow,
          id: protocolIncrease.id,
          currentVolumeUsd: protocolIncrease.currentVolumeUsd,
          previousVolumeUsd: protocolIncrease.previousVolumeUsd,
          increaseUsd: protocolIncrease.increaseUsd,
        }
      : null,
  }
}
