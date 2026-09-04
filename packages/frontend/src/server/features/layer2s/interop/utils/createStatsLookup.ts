import type { InteropTransferDeployedTokenPairStats } from '@l2beat/database'

export interface InteropTokenStats {
  volume: number | null
  transferCount: number | null
  avgDuration: number | null
}

export type InteropTokenStatsLookup = (
  key: string | undefined,
  isSupported: boolean,
) => InteropTokenStats

type PairSide = NonNullable<InteropTransferDeployedTokenPairStats['src']>

const NO_STATS: InteropTokenStats = {
  volume: null,
  transferCount: null,
  avgDuration: null,
}

const ZERO_STATS: InteropTokenStats = {
  volume: 0,
  transferCount: 0,
  avgDuration: null,
}

/**
 * Sums the rows per group, counting a row once per group so a transfer between
 * two members is not doubled. The lookup owns the "no data" policy: null
 * without a snapshot or on an unsupported chain, zero for a supported key the
 * snapshot has no transfers for.
 */
export function createStatsLookup(
  rows: InteropTransferDeployedTokenPairStats[] | undefined,
  groupOf: (side: PairSide) => string | undefined,
): InteropTokenStatsLookup {
  if (!rows) return () => NO_STATS
  const stats = aggregate(rows, groupOf)
  return (key, isSupported) =>
    isSupported ? (key && stats.get(key)) || ZERO_STATS : NO_STATS
}

function aggregate(
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
