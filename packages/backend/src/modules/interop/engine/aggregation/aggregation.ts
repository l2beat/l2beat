import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTokensPairRecord,
  AggregatedInteropTransferRecord,
  InteropTransferRecord,
  InteropTransferTypeStatsMap,
} from '@l2beat/database'
import {
  assert,
  assertUnreachable,
  getInteropTransferValue,
  UnixTime,
} from '@l2beat/shared-pure'

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

function addTransferTypeStats(
  current: InteropTransferTypeStatsMap | undefined,
  transferType: string,
  duration: number,
): InteropTransferTypeStatsMap {
  const result = current ?? {}
  const stats = result[transferType] ?? {
    transferCount: 0,
    totalDurationSum: 0,
  }

  result[transferType] = {
    transferCount: stats.transferCount + 1,
    totalDurationSum: stats.totalDurationSum + duration,
  }

  return result
}

export function getAggregatedTransfer(
  group: InteropTransferRecord[],
  options?: {
    calculateValueInFlight?: boolean
    calculateNetMinted?: boolean
  },
): Omit<AggregatedInteropTransferRecord, 'id' | 'timestamp' | 'bridgeType'> {
  const first = group[0]
  assert(first, 'Group is empty')

  let totalDurationSum = 0
  let transfersWithDurationCount = 0
  let srcValueUsd: number | undefined = undefined
  let dstValueUsd: number | undefined = undefined
  let valueInFlight: number | undefined = undefined
  let transferTypeStats: InteropTransferTypeStatsMap | undefined = undefined
  let mintedValueUsd = 0
  let burnedValueUsd = 0
  let identifiedCount = 0
  let countUnder100 = 0
  let count100To1K = 0
  let count1KTo10K = 0
  let count10KTo100K = 0
  let countOver100K = 0
  let minTransferValueUsd: number | undefined = undefined
  let maxTransferValueUsd: number | undefined = undefined

  for (const transfer of group) {
    const duration = transfer.duration
    if (duration !== undefined) {
      totalDurationSum += duration
      transfersWithDurationCount++
      transferTypeStats = addTransferTypeStats(
        transferTypeStats,
        transfer.type,
        duration,
      )
    }
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

    const transferValueUsd = getInteropTransferValue(transfer)
    if (transferValueUsd !== undefined) {
      identifiedCount++
    }

    if (transferValueUsd !== undefined) {
      minTransferValueUsd =
        minTransferValueUsd === undefined
          ? transferValueUsd
          : Math.min(minTransferValueUsd, transferValueUsd)
      maxTransferValueUsd =
        maxTransferValueUsd === undefined
          ? transferValueUsd
          : Math.max(maxTransferValueUsd, transferValueUsd)
    }

    const bucket = getBucket(transferValueUsd)
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

    if (options?.calculateValueInFlight && duration !== undefined) {
      valueInFlight = (valueInFlight ?? 0) + (transferValueUsd ?? 0) * duration
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
    transferTypeStats,
    transferCount: group.length,
    transfersWithDurationCount,
    totalDurationSum,
    srcValueUsd: srcValueUsd ? Math.round(srcValueUsd * 100) / 100 : undefined,
    dstValueUsd: dstValueUsd ? Math.round(dstValueUsd * 100) / 100 : undefined,
    minTransferValueUsd:
      minTransferValueUsd !== undefined
        ? Math.round(minTransferValueUsd * 100) / 100
        : undefined,
    maxTransferValueUsd:
      maxTransferValueUsd !== undefined
        ? Math.round(maxTransferValueUsd * 100) / 100
        : undefined,
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
): Omit<AggregatedInteropTokenRecord, 'id' | 'timestamp' | 'bridgeType'>[] {
  const first = group[0]
  assert(first, 'Group is empty')
  const tokens: Record<
    string,
    {
      transferCount: number
      totalDurationSum: number
      transfersWithDurationCount: number
      volume: number
      minTransferValueUsd: number | undefined
      maxTransferValueUsd: number | undefined
      mintedValueUsd: number | undefined
      burnedValueUsd: number | undefined
      transferTypeStats: InteropTransferTypeStatsMap | undefined
    }
  > = {}

  for (const transfer of group) {
    const duration = transfer.duration
    const isSameToken =
      transfer.srcAbstractTokenId === transfer.dstAbstractTokenId

    const isBurn =
      transfer.srcWasBurned === true && transfer.dstWasMinted === false
    const isMint =
      transfer.srcWasBurned === false && transfer.dstWasMinted === true
    const mintValue = transfer.dstValueUsd ?? transfer.srcValueUsd ?? 0
    const burnValue = transfer.srcValueUsd ?? transfer.dstValueUsd ?? 0

    if (transfer.srcAbstractTokenId) {
      const srcTokenTransferValueUsd =
        transfer.srcValueUsd ?? transfer.dstValueUsd
      const currentSrcToken = tokens[transfer.srcAbstractTokenId]
      tokens[transfer.srcAbstractTokenId] = {
        transferCount: (currentSrcToken?.transferCount ?? 0) + 1,
        totalDurationSum:
          (currentSrcToken?.totalDurationSum ?? 0) + (duration ?? 0),
        transfersWithDurationCount:
          (currentSrcToken?.transfersWithDurationCount ?? 0) +
          (duration !== undefined ? 1 : 0),
        transferTypeStats:
          duration !== undefined
            ? addTransferTypeStats(
                currentSrcToken?.transferTypeStats,
                transfer.type,
                duration,
              )
            : currentSrcToken?.transferTypeStats,
        volume: (currentSrcToken?.volume ?? 0) + (transfer.srcValueUsd ?? 0),
        minTransferValueUsd:
          srcTokenTransferValueUsd !== undefined
            ? Math.min(
                currentSrcToken?.minTransferValueUsd ??
                  Number.POSITIVE_INFINITY,
                srcTokenTransferValueUsd,
              )
            : currentSrcToken?.minTransferValueUsd,
        maxTransferValueUsd:
          srcTokenTransferValueUsd !== undefined
            ? Math.max(
                currentSrcToken?.maxTransferValueUsd ??
                  Number.NEGATIVE_INFINITY,
                srcTokenTransferValueUsd,
              )
            : currentSrcToken?.maxTransferValueUsd,
        mintedValueUsd: options?.calculateNetMinted
          ? (currentSrcToken?.mintedValueUsd ?? 0)
          : undefined,
        burnedValueUsd: options?.calculateNetMinted
          ? (currentSrcToken?.burnedValueUsd ?? 0)
          : undefined,
      }

      if (options?.calculateNetMinted && isBurn) {
        tokens[transfer.srcAbstractTokenId].burnedValueUsd =
          (tokens[transfer.srcAbstractTokenId]?.burnedValueUsd ?? 0) + burnValue
      }

      if (
        options?.calculateNetMinted &&
        isMint &&
        (isSameToken || !transfer.dstAbstractTokenId)
      ) {
        tokens[transfer.srcAbstractTokenId].mintedValueUsd =
          (tokens[transfer.srcAbstractTokenId]?.mintedValueUsd ?? 0) + mintValue
      }
    }

    if (transfer.dstAbstractTokenId && !isSameToken) {
      const dstTokenTransferValueUsd =
        transfer.dstValueUsd ?? transfer.srcValueUsd
      const currentDstToken = tokens[transfer.dstAbstractTokenId]
      tokens[transfer.dstAbstractTokenId] = {
        transferCount: (currentDstToken?.transferCount ?? 0) + 1,
        totalDurationSum:
          (currentDstToken?.totalDurationSum ?? 0) + (duration ?? 0),
        transfersWithDurationCount:
          (currentDstToken?.transfersWithDurationCount ?? 0) +
          (duration !== undefined ? 1 : 0),
        transferTypeStats:
          duration !== undefined
            ? addTransferTypeStats(
                currentDstToken?.transferTypeStats,
                transfer.type,
                duration,
              )
            : currentDstToken?.transferTypeStats,
        volume: (currentDstToken?.volume ?? 0) + (transfer.dstValueUsd ?? 0),
        minTransferValueUsd:
          dstTokenTransferValueUsd !== undefined
            ? Math.min(
                currentDstToken?.minTransferValueUsd ??
                  Number.POSITIVE_INFINITY,
                dstTokenTransferValueUsd,
              )
            : currentDstToken?.minTransferValueUsd,
        maxTransferValueUsd:
          dstTokenTransferValueUsd !== undefined
            ? Math.max(
                currentDstToken?.maxTransferValueUsd ??
                  Number.NEGATIVE_INFINITY,
                dstTokenTransferValueUsd,
              )
            : currentDstToken?.maxTransferValueUsd,
        mintedValueUsd: options?.calculateNetMinted
          ? (currentDstToken?.mintedValueUsd ?? 0)
          : undefined,
        burnedValueUsd: options?.calculateNetMinted
          ? (currentDstToken?.burnedValueUsd ?? 0)
          : undefined,
      }

      if (options?.calculateNetMinted && isMint) {
        tokens[transfer.dstAbstractTokenId].mintedValueUsd =
          (tokens[transfer.dstAbstractTokenId]?.mintedValueUsd ?? 0) + mintValue
      }

      if (
        options?.calculateNetMinted &&
        isBurn &&
        !transfer.srcAbstractTokenId
      ) {
        tokens[transfer.dstAbstractTokenId].burnedValueUsd =
          (tokens[transfer.dstAbstractTokenId]?.burnedValueUsd ?? 0) + burnValue
      }
    }
  }

  return Object.entries(tokens).map(([abstractTokenId, data]) => ({
    srcChain: first.srcChain,
    dstChain: first.dstChain,
    abstractTokenId: abstractTokenId,
    transferTypeStats: data.transferTypeStats,
    transferCount: data.transferCount,
    transfersWithDurationCount: data.transfersWithDurationCount,
    totalDurationSum: data.totalDurationSum,
    volume: data.volume,
    minTransferValueUsd:
      data.minTransferValueUsd !== undefined
        ? Math.round(data.minTransferValueUsd * 100) / 100
        : undefined,
    maxTransferValueUsd:
      data.maxTransferValueUsd !== undefined
        ? Math.round(data.maxTransferValueUsd * 100) / 100
        : undefined,
    mintedValueUsd: data.mintedValueUsd,
    burnedValueUsd: data.burnedValueUsd,
  }))
}

export function getAggregatedTokensPairs(
  group: InteropTransferRecord[],
): Omit<
  AggregatedInteropTokensPairRecord,
  'id' | 'timestamp' | 'bridgeType'
>[] {
  const first = group[0]
  assert(first, 'Group is empty')

  const pairs: Record<
    string,
    {
      tokenA: string
      tokenB: string
      transferCount: number
      totalDurationSum: number
      transfersWithDurationCount: number
      volume: number
      minTransferValueUsd: number | undefined
      maxTransferValueUsd: number | undefined
      transferTypeStats: InteropTransferTypeStatsMap | undefined
    }
  > = {}

  for (const transfer of group) {
    let pairKey: string
    let tokenA: string
    let tokenB: string
    if (!transfer.srcAbstractTokenId || !transfer.dstAbstractTokenId) {
      pairKey = 'unknown'
      tokenA = 'unknown'
      tokenB = 'unknown'
    } else {
      const [a, b] = [
        transfer.srcAbstractTokenId,
        transfer.dstAbstractTokenId,
      ].sort()
      pairKey = `${a}::${b}`
      tokenA = a
      tokenB = b
    }

    const duration = transfer.duration
    const transferValueUsd = getInteropTransferValue(transfer)

    const current = pairs[pairKey]
    pairs[pairKey] = {
      tokenA,
      tokenB,
      transferCount: (current?.transferCount ?? 0) + 1,
      totalDurationSum: (current?.totalDurationSum ?? 0) + (duration ?? 0),
      transfersWithDurationCount:
        (current?.transfersWithDurationCount ?? 0) +
        (duration !== undefined ? 1 : 0),
      transferTypeStats:
        duration !== undefined
          ? addTransferTypeStats(
              current?.transferTypeStats,
              transfer.type,
              duration,
            )
          : current?.transferTypeStats,
      volume: (current?.volume ?? 0) + (transferValueUsd ?? 0),
      minTransferValueUsd:
        transferValueUsd !== undefined
          ? Math.min(
              current?.minTransferValueUsd ?? Number.POSITIVE_INFINITY,
              transferValueUsd,
            )
          : current?.minTransferValueUsd,
      maxTransferValueUsd:
        transferValueUsd !== undefined
          ? Math.max(
              current?.maxTransferValueUsd ?? Number.NEGATIVE_INFINITY,
              transferValueUsd,
            )
          : current?.maxTransferValueUsd,
    }
  }

  return Object.values(pairs).map((data) => ({
    srcChain: first.srcChain,
    dstChain: first.dstChain,
    tokenA: data.tokenA,
    tokenB: data.tokenB,
    transferTypeStats: data.transferTypeStats,
    transferCount: data.transferCount,
    transfersWithDurationCount: data.transfersWithDurationCount,
    totalDurationSum: data.totalDurationSum,
    volume: Math.round(data.volume * 100) / 100,
    minTransferValueUsd:
      data.minTransferValueUsd !== undefined
        ? Math.round(data.minTransferValueUsd * 100) / 100
        : undefined,
    maxTransferValueUsd:
      data.maxTransferValueUsd !== undefined
        ? Math.round(data.maxTransferValueUsd * 100) / 100
        : undefined,
  }))
}
