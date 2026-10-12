export interface ValuePoint {
  timestamp: number
  value: number
}

/** Finite samples up to `to`, one per timestamp, ascending. */
export function normalizeSeries(
  series: ValuePoint[],
  to: number,
): ValuePoint[] {
  const byTimestamp = new Map<number, ValuePoint>()
  for (const point of series) {
    if (point.timestamp <= to && Number.isFinite(point.value)) {
      byTimestamp.set(point.timestamp, point)
    }
  }
  return [...byTimestamp.values()].sort((a, b) => a.timestamp - b.timestamp)
}
