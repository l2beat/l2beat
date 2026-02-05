import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
  InteropTransferRecord,
} from '@l2beat/database'
import { assert, assertUnreachable, UnixTime } from '@l2beat/shared-pure'

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
  options?: {
    calculateValueInFlight?: boolean
    calculateNetMinted?: boolean
  },
): Omit<AggregatedInteropTransferRecord, 'id' | 'timestamp'> {
  const first = group[0]
  assert(first, 'Group is empty')

  let totalDurationSum = 0
  let srcValueUsd: number | undefined = undefined
  let dstValueUsd: number | undefined = undefined
  let valueInFlight: number | undefined = undefined
  let mintedValueUsd = 0
  let burnedValueUsd = 0
  let identifiedCount = 0
  let countUnder100 = 0
  let count100To1K = 0
  let count1KTo10K = 0
  let count10KTo100K = 0
  let countOver100K = 0

  for (const transfer of group) {
    totalDurationSum += transfer.duration
    if (srcValueUsd === undefined) {
      srcValueUsd = transfer.srcValueUsd ?? transfer.dstValueUsd
    } else {
      srcValueUsd += transfer.srcValueUsd ?? transfer.dstValueUsd ?? 0
    }

    if (dstValueUsd === undefined) {
      dstValueUsd = transfer.dstValueUsd ?? transfer.srcValueUsd
    } else {
      dstValueUsd += transfer.dstValueUsd ?? transfer.srcValueUsd ?? 0
    }

    if (
      transfer.srcValueUsd !== undefined ||
      transfer.dstValueUsd !== undefined
    ) {
      identifiedCount++
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

    if (options?.calculateValueInFlight) {
      valueInFlight =
        (valueInFlight ?? 0) +
        (transfer.srcValueUsd ?? transfer.dstValueUsd ?? 0) * transfer.duration
    }

    if (options?.calculateNetMinted) {
      if (transfer.srcWasBurned === false && transfer.dstWasMinted) {
        mintedValueUsd += transfer.dstValueUsd ?? transfer.srcValueUsd ?? 0
      }
      if (transfer.srcWasBurned && transfer.dstWasMinted === false) {
        burnedValueUsd += transfer.srcValueUsd ?? transfer.dstValueUsd ?? 0
      }
    }
  }

  return {
    srcChain: first.srcChain,
    dstChain: first.dstChain,
    transferCount: group.length,
    totalDurationSum,
    srcValueUsd: srcValueUsd ? Math.round(srcValueUsd * 100) / 100 : undefined,
    dstValueUsd: dstValueUsd ? Math.round(dstValueUsd * 100) / 100 : undefined,
    avgValueInFlight: valueInFlight
      ? Math.round((valueInFlight / UnixTime.DAY) * 100) / 100
      : undefined,
    mintedValueUsd: options?.calculateNetMinted
      ? Math.round(mintedValueUsd * 100) / 100
      : undefined,
    burnedValueUsd: options?.calculateNetMinted
      ? Math.round(burnedValueUsd * 100) / 100
      : undefined,
    countUnder100,
    count100To1K,
    count1KTo10K,
    count10KTo100K,
    countOver100K,
    identifiedCount,
  }
}

export function getAggregatedTokens(
  group: InteropTransferRecord[],
  options?: {
    calculateNetMinted?: boolean
  },
): Omit<AggregatedInteropTokenRecord, 'id' | 'timestamp'>[] {
  const first = group[0]
  assert(first, 'Group is empty')
  const tokens: Record<
    string,
    {
      transferCount: number
      totalDurationSum: number
      volume: number
      mintedValueUsd: number | undefined
      burnedValueUsd: number | undefined
    }
  > = {}

  for (const transfer of group) {
    const isSameToken =
      transfer.srcAbstractTokenId === transfer.dstAbstractTokenId
    const isBurn =
      transfer.srcWasBurned === true && transfer.dstWasMinted === false
    const isMint =
      transfer.srcWasBurned === false && transfer.dstWasMinted === true

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
        mintedValueUsd: tokens[transfer.srcAbstractTokenId]?.mintedValueUsd,
        burnedValueUsd: tokens[transfer.srcAbstractTokenId]?.burnedValueUsd,
      }

      if (options?.calculateNetMinted && isBurn) {
        tokens[transfer.srcAbstractTokenId].burnedValueUsd =
          (tokens[transfer.srcAbstractTokenId]?.burnedValueUsd ?? 0) +
          (transfer.srcValueUsd ?? transfer.dstValueUsd ?? 0)
      }

      if (options?.calculateNetMinted && isSameToken && isMint) {
        tokens[transfer.srcAbstractTokenId].mintedValueUsd =
          (tokens[transfer.srcAbstractTokenId]?.mintedValueUsd ?? 0) +
          (transfer.dstValueUsd ?? transfer.srcValueUsd ?? 0)
      }
    }

    if (transfer.dstAbstractTokenId && !isSameToken) {
      tokens[transfer.dstAbstractTokenId] = {
        transferCount:
          (tokens[transfer.dstAbstractTokenId]?.transferCount ?? 0) + 1,
        totalDurationSum:
          (tokens[transfer.dstAbstractTokenId]?.totalDurationSum ?? 0) +
          transfer.duration,
        volume:
          (tokens[transfer.dstAbstractTokenId]?.volume ?? 0) +
          (transfer.dstValueUsd ?? 0),
        mintedValueUsd: tokens[transfer.dstAbstractTokenId]?.mintedValueUsd,
        burnedValueUsd: tokens[transfer.dstAbstractTokenId]?.burnedValueUsd,
      }

      if (options?.calculateNetMinted && isMint) {
        tokens[transfer.dstAbstractTokenId].mintedValueUsd =
          (tokens[transfer.dstAbstractTokenId]?.mintedValueUsd ?? 0) +
          (transfer.dstValueUsd ?? transfer.srcValueUsd ?? 0)
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
    mintedValueUsd: data.mintedValueUsd,
    burnedValueUsd: data.burnedValueUsd,
  }))
}
