export interface AggregatedInteropTransferAnomalyRow {
  timestamp: number
  id: string
  transferCount: number
  prevDayCount: number | null
  prev7dCount: number | null
  mean7d: number | null
  std7d: number | null
}

export interface AggregatedInteropTransferAnomalyStats {
  timestamp: number
  id: string
  transferCount: number
  prevDayCount: number | null
  prev7dCount: number | null
  mean7d: number | null
  std7d: number | null
  diffDay: number | null
  diff7d: number | null
  zScore7d: number | null
  pctDiffDay: number | null
  pctDiff7d: number | null
}

export const Z_SCORE_THRESHOLD = 5

export function calculateAnomalyStats(
  rows: AggregatedInteropTransferAnomalyRow[],
): AggregatedInteropTransferAnomalyStats[] {
  return rows.map((row) => {
    const diffDay =
      row.prevDayCount === null ? null : row.transferCount - row.prevDayCount
    const diff7d = row.mean7d === null ? null : row.transferCount - row.mean7d
    const pctDiffDay =
      row.prevDayCount === null || row.prevDayCount === 0
        ? null
        : ((row.transferCount - row.prevDayCount) / row.prevDayCount) * 100
    const pctDiff7d =
      row.prev7dCount === null || row.prev7dCount === 0
        ? null
        : ((row.transferCount - row.prev7dCount) / row.prev7dCount) * 100
    const zScore7d =
      row.mean7d === null || row.std7d === null || row.std7d === 0
        ? null
        : (row.transferCount - row.mean7d) / row.std7d

    return {
      timestamp: row.timestamp,
      id: row.id,
      transferCount: row.transferCount,
      prevDayCount: row.prevDayCount,
      prev7dCount: row.prev7dCount,
      mean7d: row.mean7d,
      std7d: row.std7d,
      diffDay,
      diff7d,
      zScore7d,
      pctDiffDay,
      pctDiff7d,
    }
  })
}
