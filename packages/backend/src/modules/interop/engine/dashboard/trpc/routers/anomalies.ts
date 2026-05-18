import { InteropTransferClassifier } from '@l2beat/shared'
import type { InteropBridgeType } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import {
  MINIMUM_SIDE_VALUE_USD_THRESHOLD,
  SIDE_MISMATCH_DIFF_PERCENT,
  SIDE_MISMATCH_MIN_VOLUME_USD,
  VALUE_DIFF_THRESHOLD_PERCENT,
} from '../../anomalies/constants'
import { explore } from '../../stats'

export interface SuspiciousTransferDto {
  plugin: string
  type: string
  transferId: string
  bridgeType: InteropBridgeType
  timestamp: number
  srcChain: string
  srcTxHash: string | undefined
  srcTokenAddress: string | undefined
  srcSymbol: string | undefined
  srcValueUsd: number | undefined
  dstChain: string
  dstTxHash: string | undefined
  dstTokenAddress: string | undefined
  dstSymbol: string | undefined
  dstValueUsd: number | undefined
  valueDifferencePercent: number
}

const AggregateDetailsRequest = v.object({
  id: v.string(),
  bridgeType: v.string(),
  srcChain: v.string(),
  dstChain: v.string(),
})

function toSuspiciousTransferDto(transfer: {
  plugin: string
  type: string
  transferId: string
  bridgeType: InteropBridgeType | undefined
  timestamp: number
  srcChain: string
  srcTxHash: string | undefined
  srcTokenAddress: string | undefined
  srcSymbol: string | undefined
  srcValueUsd: number | undefined
  srcWasBurned: boolean | undefined
  dstChain: string
  dstTxHash: string | undefined
  dstTokenAddress: string | undefined
  dstSymbol: string | undefined
  dstValueUsd: number | undefined
  dstWasMinted: boolean | undefined
  valueDifferencePercent: number
}) {
  return {
    plugin: transfer.plugin,
    type: transfer.type,
    transferId: transfer.transferId,
    bridgeType:
      transfer.bridgeType ??
      InteropTransferClassifier.inferBridgeType(transfer),
    timestamp: transfer.timestamp,
    srcChain: transfer.srcChain,
    srcTxHash: transfer.srcTxHash,
    srcTokenAddress: transfer.srcTokenAddress,
    srcSymbol: transfer.srcSymbol,
    srcValueUsd: transfer.srcValueUsd,
    dstChain: transfer.dstChain,
    dstTxHash: transfer.dstTxHash,
    dstTokenAddress: transfer.dstTokenAddress,
    dstSymbol: transfer.dstSymbol,
    dstValueUsd: transfer.dstValueUsd,
    valueDifferencePercent: transfer.valueDifferencePercent,
  } satisfies SuspiciousTransferDto
}

function toChartPoint(point: {
  day: number
  transferCount: number
  transfersWithDurationCount: number
  totalDurationSum: number
  totalSrcValueUsd: number | null
  totalDstValueUsd: number | null
}) {
  return {
    day: UnixTime.toYYYYMMDD(point.day),
    timestamp: point.day,
    transferCount: point.transferCount,
    transfersWithDurationCount: point.transfersWithDurationCount,
    totalDurationSum: point.totalDurationSum,
    avgDuration:
      point.transfersWithDurationCount > 0
        ? point.totalDurationSum / point.transfersWithDurationCount
        : null,
    totalSrcValueUsd: point.totalSrcValueUsd,
    totalDstValueUsd: point.totalDstValueUsd,
  }
}

export function createAnomaliesRouter() {
  return router({
    summary: protectedProcedure.query(async ({ ctx }) => {
      const aggregatedRows =
        await ctx.db.aggregatedInteropTransfer.getDailySeries()

      const aggregatedItems = explore(aggregatedRows).filter(
        (row) => row.interpretation.length > 0,
      )

      return {
        aggregateSideMismatchDiffPercent: SIDE_MISMATCH_DIFF_PERCENT,
        aggregateSideMismatchMinVolumeUsd: SIDE_MISMATCH_MIN_VOLUME_USD,
        aggregatedItems,
      }
    }),
    suspiciousTransfers: protectedProcedure.query(async ({ ctx }) => {
      const transfers = await ctx.db.interopTransfer.getValueMismatchTransfers(
        VALUE_DIFF_THRESHOLD_PERCENT,
        MINIMUM_SIDE_VALUE_USD_THRESHOLD,
      )

      return {
        valueDiffThresholdPercent: VALUE_DIFF_THRESHOLD_PERCENT,
        minimumSideValueUsdThreshold: MINIMUM_SIDE_VALUE_USD_THRESHOLD,
        items: transfers.map(toSuspiciousTransferDto),
      }
    }),
    aggregateDetails: protectedProcedure
      .input(AggregateDetailsRequest)
      .query(async ({ ctx, input }) => {
        const series =
          await ctx.db.aggregatedInteropTransfer.getDailySeriesByGroup(
            input.id,
            input.bridgeType as InteropBridgeType,
            input.srcChain,
            input.dstChain,
          )

        return {
          id: input.id,
          bridgeType: input.bridgeType as InteropBridgeType,
          srcChain: input.srcChain,
          dstChain: input.dstChain,
          items: series.map((point) =>
            toChartPoint({
              day: point.timestamp,
              transferCount: point.transferCount,
              transfersWithDurationCount: point.transfersWithDurationCount,
              totalDurationSum: point.totalDurationSum,
              totalSrcValueUsd: point.totalSrcValueUsd,
              totalDstValueUsd: point.totalDstValueUsd,
            }),
          ),
        }
      }),
  })
}
