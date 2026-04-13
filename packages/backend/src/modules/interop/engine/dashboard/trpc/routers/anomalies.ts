import { InteropTransferClassifier } from '@l2beat/shared'
import type { InteropBridgeType } from '@l2beat/shared-pure'
import {
  MINIMUM_SIDE_VALUE_USD_THRESHOLD,
  VALUE_DIFF_THRESHOLD_PERCENT,
} from '../../anomalies/constants'
import { protectedProcedure } from '../procedures'
import { router } from '../trpc'

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

export function createAnomaliesRouter() {
  return router({
    suspiciousTransfers: protectedProcedure.query(async ({ ctx }) => {
      const transfers = await ctx.db.interopTransfer.getValueMismatchTransfers(
        VALUE_DIFF_THRESHOLD_PERCENT,
        MINIMUM_SIDE_VALUE_USD_THRESHOLD,
      )

      const items: SuspiciousTransferDto[] = transfers.map((transfer) => ({
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
      }))

      return {
        valueDiffThresholdPercent: VALUE_DIFF_THRESHOLD_PERCENT,
        minimumSideValueUsdThreshold: MINIMUM_SIDE_VALUE_USD_THRESHOLD,
        items,
      }
    }),
  })
}
