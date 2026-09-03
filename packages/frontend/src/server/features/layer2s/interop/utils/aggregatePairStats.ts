import type { InteropTransferDeployedTokenPairStats } from '@l2beat/database'
import { Address32 } from '@l2beat/shared-pure'

export interface InteropTokenStats {
  volume: number | null
  transferCount: number | null
  avgDuration: number | null
}

export const NO_STATS: InteropTokenStats = {
  volume: null,
  transferCount: null,
  avgDuration: null,
}

const ZERO_STATS: InteropTokenStats = {
  volume: 0,
  transferCount: 0,
  avgDuration: null,
}

export type PairSide = NonNullable<InteropTransferDeployedTokenPairStats['src']>

export function pairSideKey(side: PairSide): string {
  return `${side.chain}|${side.address}`
}

/** Deployed tokens carry 20-byte addresses, transfers carry Address32. */
export function deploymentPairKey(deployment: {
  chain: string
  address: string
}): string | undefined {
  const address = Address32.fromOrUndefined(deployment.address)
  return address ? `${deployment.chain}|${address}` : undefined
}

/** A row counts once per group, so a transfer between two members is not doubled. */
export function aggregatePairStats(
  rows: InteropTransferDeployedTokenPairStats[],
  groupOf: (side: PairSide) => string | undefined,
): Map<string, InteropTokenStats> {
  const sums = new Map<
    string,
    {
      volume: number
      transferCount: number
      transfersWithDurationCount: number
      totalDurationSum: number
    }
  >()
  for (const row of rows) {
    const groups = new Set([
      row.src && groupOf(row.src),
      row.dst && groupOf(row.dst),
    ])
    for (const group of groups) {
      if (group === undefined) continue
      const sum = sums.get(group) ?? {
        volume: 0,
        transferCount: 0,
        transfersWithDurationCount: 0,
        totalDurationSum: 0,
      }
      sum.volume += row.volume
      sum.transferCount += row.transferCount
      sum.transfersWithDurationCount += row.transfersWithDurationCount
      sum.totalDurationSum += row.totalDurationSum
      sums.set(group, sum)
    }
  }
  return new Map(
    [...sums].map(([group, sum]) => [
      group,
      {
        volume: sum.volume,
        transferCount: sum.transferCount,
        avgDuration:
          sum.transfersWithDurationCount > 0
            ? Math.floor(sum.totalDurationSum / sum.transfersWithDurationCount)
            : null,
      },
    ]),
  )
}

/** Zero when the snapshot has no transfers for the key, null without a snapshot. */
export function pickStats(
  stats: Map<string, InteropTokenStats> | undefined,
  key: string | undefined,
): InteropTokenStats {
  if (!stats) return NO_STATS
  return (key && stats.get(key)) || ZERO_STATS
}
