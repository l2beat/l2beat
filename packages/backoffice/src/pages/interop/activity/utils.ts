export function buildActivityDetailsPath(group: {
  id: string
  bridgeType: string
  srcChain: string
  dstChain: string
}) {
  const params = new URLSearchParams({
    bridgeType: group.bridgeType,
    srcChain: group.srcChain,
    dstChain: group.dstChain,
  })
  return `/interop/insights/activity/aggregate/${encodeURIComponent(group.id)}?${params.toString()}`
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

export function formatPercent(value: number | null, digits = 2) {
  if (value === null) return '-'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}%`
}

export function formatGapPercent(value: number | null) {
  if (value === null) return '-'
  return `${value.toFixed(2)}%`
}
