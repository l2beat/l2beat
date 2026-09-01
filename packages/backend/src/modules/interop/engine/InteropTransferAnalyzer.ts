import type { UnixTime } from '@l2beat/shared-pure'
import type {
  InteropNotifier,
  InteropSuspiciousTransferNotification,
} from './notifications/InteropNotifier'

export const VALUE_DIFF_THRESHOLD_PERCENT = 15
export const MINIMUM_SIDE_VALUE_USD_THRESHOLD = 50
export const EXTREME_VALUE_RATIO_THRESHOLD = 5

export interface InteropTransferValues {
  srcValueUsd?: number | null
  dstValueUsd?: number | null
}

export interface InteropTransferAnalyzerRecord extends InteropTransferValues {
  plugin: string
  type: string
  transferId: string
  timestamp: UnixTime
  srcChain: string
  srcTxHash: string | undefined
  srcTokenAddress: string | undefined
  srcSymbol: string | undefined
  dstChain: string
  dstTxHash: string | undefined
  dstTokenAddress: string | undefined
  dstSymbol: string | undefined
}

export interface SuspiciousTransferAnalysis {
  dominantSide: 'src' | 'dst'
  valueDifferencePercent: number
  valueRatio: number
}

export interface SuspiciousTransferMatch<T> {
  transfer: T
  analysis: SuspiciousTransferAnalysis
}

export function analyzeSuspiciousTransfer(
  transfer: InteropTransferValues,
): SuspiciousTransferAnalysis | undefined {
  const srcValueUsd = getAbsoluteValue(transfer.srcValueUsd)
  const dstValueUsd = getAbsoluteValue(transfer.dstValueUsd)

  if (srcValueUsd === undefined || dstValueUsd === undefined) {
    return
  }

  if (
    srcValueUsd <= MINIMUM_SIDE_VALUE_USD_THRESHOLD ||
    dstValueUsd <= MINIMUM_SIDE_VALUE_USD_THRESHOLD
  ) {
    return
  }

  const maxSideValueUsd = Math.max(srcValueUsd, dstValueUsd)
  if (maxSideValueUsd === 0) {
    return
  }

  const absoluteValueDifferenceUsd = Math.abs(srcValueUsd - dstValueUsd)
  const valueDifferencePercent =
    (absoluteValueDifferenceUsd / maxSideValueUsd) * 100

  if (valueDifferencePercent <= VALUE_DIFF_THRESHOLD_PERCENT) {
    return
  }

  const minSideValueUsd = Math.min(srcValueUsd, dstValueUsd)
  if (minSideValueUsd === 0) {
    return
  }

  return {
    dominantSide: srcValueUsd >= dstValueUsd ? 'src' : 'dst',
    valueDifferencePercent,
    valueRatio: maxSideValueUsd / minSideValueUsd,
  }
}

export function findExtremeSuspiciousTransfers<T extends InteropTransferValues>(
  transfers: T[],
): SuspiciousTransferMatch<T>[] {
  return transfers.flatMap((transfer) => {
    const analysis = analyzeSuspiciousTransfer(transfer)

    if (!analysis || analysis.valueRatio < EXTREME_VALUE_RATIO_THRESHOLD) {
      return []
    }

    return [{ transfer, analysis }]
  })
}

export class InteropTransferAnalyzer {
  constructor(private readonly notifier: InteropNotifier) {}

  handleProcessedTransfers(
    transfers: InteropTransferAnalyzerRecord[],
    timestamp: UnixTime,
  ): void {
    const suspiciousTransfers = findExtremeSuspiciousTransfers(transfers).map(
      ({ transfer, analysis }): InteropSuspiciousTransferNotification => ({
        plugin: transfer.plugin,
        type: transfer.type,
        transferId: transfer.transferId,
        timestamp: transfer.timestamp,
        srcChain: transfer.srcChain,
        srcTxHash: transfer.srcTxHash,
        srcTokenAddress: transfer.srcTokenAddress,
        srcSymbol: transfer.srcSymbol,
        srcValueUsd: transfer.srcValueUsd ?? 0,
        dstChain: transfer.dstChain,
        dstTxHash: transfer.dstTxHash,
        dstTokenAddress: transfer.dstTokenAddress,
        dstSymbol: transfer.dstSymbol,
        dstValueUsd: transfer.dstValueUsd ?? 0,
        dominantSide: analysis.dominantSide,
        valueDifferencePercent: analysis.valueDifferencePercent,
        valueRatio: analysis.valueRatio,
      }),
    )

    if (suspiciousTransfers.length === 0) {
      return
    }

    this.notifier.notifySuspiciousTransfers(timestamp, suspiciousTransfers)
  }
}

function getAbsoluteValue(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return undefined
  }

  return Math.abs(value)
}
