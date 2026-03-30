import type { InteropTransferTypeStatsMap } from '@l2beat/database'

export function mergeTransferTypeStats(
  current: InteropTransferTypeStatsMap | undefined,
  next: InteropTransferTypeStatsMap | undefined,
): InteropTransferTypeStatsMap | undefined {
  if (!next) return current

  const result = { ...current }

  for (const [transferType, stats] of Object.entries(next)) {
    const currentStats = result[transferType]
    result[transferType] = {
      transferCount: (currentStats?.transferCount ?? 0) + stats.transferCount,
      totalDurationSum:
        (currentStats?.totalDurationSum ?? 0) + stats.totalDurationSum,
    }
  }

  return result
}
