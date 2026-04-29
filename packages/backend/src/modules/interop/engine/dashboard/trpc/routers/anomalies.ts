import { InteropTransferClassifier } from '@l2beat/shared'
import type { InteropBridgeType } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import {
  MINIMUM_SIDE_VALUE_USD_THRESHOLD,
  VALUE_DIFF_THRESHOLD_PERCENT,
} from '../../anomalies/constants'
import {
  explore,
  interpret,
  VALUE_DIFF_ALERT_THRESHOLD_PERCENT,
} from '../../stats'

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
})

const _AggregateExplorerRequest = v.object({
  plugin: v.string().optional(),
  type: v.string().optional(),
  srcChain: v.string().optional(),
  dstChain: v.string().optional(),
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

      const aggregatedItems = explore(aggregatedRows).map((row) => ({
        ...row,
        interpretation: interpret(row),
      }))

      return {
        aggregateValueDiffAlertThresholdPercent:
          VALUE_DIFF_ALERT_THRESHOLD_PERCENT,
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
          await ctx.db.aggregatedInteropTransfer.getDailySeriesById(input.id)

        return {
          id: input.id,
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
