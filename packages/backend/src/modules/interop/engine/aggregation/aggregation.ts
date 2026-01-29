import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
  InteropTransferRecord,
} from '@l2beat/database'
import { assert, assertUnreachable } from '@l2beat/shared-pure'

type Bucket =
  | 'under100'
  | '100to1k'
  | '1kto10k'
  | '10kto100k'
  | 'over100k'
  | 'unknown'
function getBucket(valueUsd: number | undefined): Bucket {
  if (valueUsd === undefined) return 'unknown'
  if (valueUsd < 100) return 'under100'
  if (valueUsd < 1000) return '100to1k'
  if (valueUsd < 10000) return '1kto10k'
  if (valueUsd < 100000) return '10kto100k'
  return 'over100k'
}

export function getAggregatedTransfer(
  group: InteropTransferRecord[],
): Omit<AggregatedInteropTransferRecord, 'id' | 'timestamp'> {
  const first = group[0]
  assert(first, 'Group is empty')

  let totalDurationSum = 0
  let srcValueUsd: number | undefined = undefined
  let dstValueUsd: number | undefined = undefined
  let countUnder100 = 0
  let count100To1K = 0
  let count1KTo10K = 0
  let count10KTo100K = 0
  let countOver100K = 0

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

    // Count transfers by bucket based on srcValueUsd
    const bucket = getBucket(transfer.srcValueUsd ?? transfer.dstValueUsd)
    switch (bucket) {
      case 'under100':
        countUnder100++
        break
      case '100to1k':
        count100To1K++
        break
      case '1kto10k':
        count1KTo10K++
        break
      case '10kto100k':
        count10KTo100K++
        break
      case 'over100k':
        countOver100K++
        break
      case 'unknown':
        break
      default:
        assertUnreachable(bucket)
    }
  }

  return {
    srcChain: first.srcChain,
    dstChain: first.dstChain,
    transferCount: group.length,
    totalDurationSum,
    srcValueUsd: srcValueUsd ? Math.round(srcValueUsd * 100) / 100 : undefined,
    dstValueUsd: dstValueUsd ? Math.round(dstValueUsd * 100) / 100 : undefined,
    countUnder100,
    count100To1K,
    count1KTo10K,
    count10KTo100K,
    countOver100K,
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
