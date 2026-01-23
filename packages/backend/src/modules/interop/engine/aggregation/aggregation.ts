import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
  InteropTransferRecord,
} from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'

export function getAggregatedTransfer(
  group: InteropTransferRecord[],
): Omit<AggregatedInteropTransferRecord, 'id' | 'timestamp'> {
  const first = group[0]
  assert(first, 'Group is empty')

  let totalDurationSum = 0
  let srcValueUsd: number | undefined = undefined
  let dstValueUsd: number | undefined = undefined

  for (const transfer of group) {
    totalDurationSum += transfer.duration
    if (srcValueUsd === undefined) {
      srcValueUsd = transfer.srcValueUsd
    } else {
      srcValueUsd += transfer.srcValueUsd ?? 0
    }

    if (dstValueUsd === undefined) {
      dstValueUsd = transfer.dstValueUsd
    } else {
      dstValueUsd += transfer.dstValueUsd ?? 0
    }
  }

  return {
    srcChain: first.srcChain,
    dstChain: first.dstChain,
    transferCount: group.length,
    totalDurationSum,
    srcValueUsd: srcValueUsd ? Math.round(srcValueUsd * 100) / 100 : undefined,
    dstValueUsd: dstValueUsd ? Math.round(dstValueUsd * 100) / 100 : undefined,
  }
}

export function getAggregatedTokens(
  group: InteropTransferRecord[],
): Omit<AggregatedInteropTokenRecord, 'id' | 'timestamp'>[] {
  const first = group[0]
  assert(first, 'Group is empty')
  const tokens: Record<
    string,
    { transferCount: number; totalDurationSum: number; volume: number }
  > = {}

  for (const transfer of group) {
    if (transfer.srcAbstractTokenId) {
      tokens[transfer.srcAbstractTokenId] = {
        transferCount:
          (tokens[transfer.srcAbstractTokenId]?.transferCount ?? 0) + 1,
        totalDurationSum:
          (tokens[transfer.srcAbstractTokenId]?.totalDurationSum ?? 0) +
          transfer.duration,
        volume:
          (tokens[transfer.srcAbstractTokenId]?.volume ?? 0) +
          (transfer.srcValueUsd ?? 0),
      }
    }

    if (
      transfer.dstAbstractTokenId &&
      transfer.dstAbstractTokenId !== transfer.srcAbstractTokenId
    ) {
      tokens[transfer.dstAbstractTokenId] = {
        transferCount:
          (tokens[transfer.dstAbstractTokenId]?.transferCount ?? 0) + 1,
        totalDurationSum:
          (tokens[transfer.dstAbstractTokenId]?.totalDurationSum ?? 0) +
          transfer.duration,
        volume:
          (tokens[transfer.dstAbstractTokenId]?.volume ?? 0) +
          (transfer.dstValueUsd ?? 0),
      }
    }
  }

  return Object.entries(tokens).map(([abstractTokenId, data]) => ({
    srcChain: first.srcChain,
    dstChain: first.dstChain,
    abstractTokenId: abstractTokenId,
    transferCount: data.transferCount,
    totalDurationSum: data.totalDurationSum,
    volume: data.volume,
  }))
}
