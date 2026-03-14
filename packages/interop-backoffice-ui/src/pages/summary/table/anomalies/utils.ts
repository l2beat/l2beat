export function formatCount(value: number) {
  return Math.round(value).toLocaleString()
}

export function formatSignedDiff(value: number | null, digits = 0) {
  if (value === null) {
    return '-'
  }
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}`
}

export function formatPercent(value: number | null, digits = 2) {
  if (value === null) {
    return '-'
  }
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}%`
}

export function formatGapPercent(value: number | null) {
  if (value === null) {
    return '-'
  }
  return `${value.toFixed(2)}%`
}

export function formatUtcDateTime(timestamp: number) {
  return new Date(timestamp * 1000).toISOString().replace('T', ' ').slice(0, 19)
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

  return {
    diffDay,
    diff7d,
    pctDiffDay,
    pctDiff7d,
  }
}

export function getPercentColor(value: number | null) {
  if (value === null) {
    return 'text-muted-foreground'
  }
  if (value > 0) {
    return 'text-emerald-700'
  }
  if (value < 0) {
    return 'text-red-700'
  }
  return 'text-muted-foreground'
}

export function getGapColorClass(
  value: number | null,
  thresholdPercent: number,
): string {
  if (value === null) {
    return 'text-muted-foreground'
  }
  return value > thresholdPercent ? 'text-red-700' : 'text-emerald-700'
}

export function buildAnomalyDetailsPath(id: string) {
  return `/interop/anomalies/${encodeURIComponent(id)}`
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
