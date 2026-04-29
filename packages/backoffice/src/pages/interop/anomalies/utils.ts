export function buildAnomalyDetailsPath(id: string) {
  return `/interop/insights/anomalies/aggregate/${encodeURIComponent(id)}`
}

export function parseOptionalSearchParam(value: string | null) {
  if (value === null || value.trim().length === 0) {
    return undefined
  }

  return value
}

export function decodeRouteParam(value: string | undefined) {
  if (value === undefined) {
    return undefined
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function formatSignedDiff(value: number | null, digits = 0) {
  if (value === null) return '-'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}`
}

export function formatPercent(value: number | null, digits = 2) {
  if (value === null) return '-'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}%`
}

export function formatGapPercent(value: number | null) {
  if (value === null) return '-'
  return `${value.toFixed(2)}%`
}

export function getSummaryValues(
  last: number | null,
  prevDay: number | null,
  prev7d: number | null,
) {
  const diffDay = last === null || prevDay === null ? null : last - prevDay
  const diff7d = last === null || prev7d === null ? null : last - prev7d
  const pctDiffDay =
    diffDay === null || prevDay === null || prevDay === 0 || last === null
      ? null
      : (diffDay / prevDay) * 100
  const pctDiff7d =
    diff7d === null || prev7d === null || prev7d === 0 || last === null
      ? null
      : (diff7d / prev7d) * 100

  return { diffDay, diff7d, pctDiffDay, pctDiff7d }
}
