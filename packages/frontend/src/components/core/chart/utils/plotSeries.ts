/** What stacking and the y extent need from a series. */
export interface PlotSeries<T> {
  key: string
  value?: (row: T) => unknown
  value0?: (row: T) => unknown
  stack?: boolean
  axis?: 'right'
}

/** A row with each series' plotted edges, stacking applied. */
export interface Plotted<T> {
  row: T
  top: Record<string, number | null>
  bottom: Record<string, number | null>
}

/**
 * The series that stack: those marked `stack`, on an axis with at least two
 * of them. A lone one is drawn from the axis' bottom like any other.
 */
export function getStackedKeys(
  series: readonly Pick<PlotSeries<never>, 'key' | 'stack' | 'axis'>[],
) {
  const byAxis = new Map<string, string[]>()
  for (const s of series) {
    if (!s.stack) continue
    const axis = s.axis ?? 'left'
    byAxis.set(axis, [...(byAxis.get(axis) ?? []), s.key])
  }
  return new Set([...byAxis.values()].filter((k) => k.length > 1).flat())
}

/**
 * Each row's plotted edges. Stacked here rather than with the library's
 * stack layout, because the lines and the hover overlay need the stacked
 * values too, and a missing value must leave a gap instead of being dropped.
 */
export function plotRows<T>(
  rows: readonly T[],
  series: readonly PlotSeries<T>[],
): Plotted<T>[] {
  const stacked = getStackedKeys(series)
  return rows.map((row) => {
    const top: Record<string, number | null> = {}
    const bottom: Record<string, number | null> = {}
    const stackTop: Record<string, number> = {}
    for (const s of series) {
      const raw = toNumber(
        s.value ? s.value(row) : (row as Record<string, unknown>)[s.key],
      )
      if (stacked.has(s.key)) {
        const axis = s.axis ?? 'left'
        const below = stackTop[axis] ?? 0
        stackTop[axis] = below + (raw ?? 0)
        top[s.key] = raw === null ? null : below + raw
        bottom[s.key] = raw === null ? null : below
      } else {
        top[s.key] = raw
        bottom[s.key] = s.value0 ? toNumber(s.value0(row)) : null
      }
    }
    return { row, top, bottom }
  })
}

/** The smallest and largest plotted edge of `keys`, if any has a value. */
export function getExtent(
  plotted: readonly Plotted<unknown>[],
  keys: readonly string[],
): [number, number] | undefined {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const point of plotted) {
    for (const key of keys) {
      for (const value of [point.top[key], point.bottom[key]]) {
        if (value === null || value === undefined) continue
        if (value < min) min = value
        if (value > max) max = value
      }
    }
  }
  return min > max ? undefined : [min, max]
}

/** Rows where `key` has a value but both neighbours have none. */
export function getIsolatedPoints<T>(
  plotted: readonly Plotted<T>[],
  key: string,
): Plotted<T>[] {
  return plotted.filter(
    (point, i) =>
      point.top[key] !== null &&
      plotted[i - 1]?.top[key] === null &&
      plotted[i + 1]?.top[key] === null,
  )
}

function toNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}
