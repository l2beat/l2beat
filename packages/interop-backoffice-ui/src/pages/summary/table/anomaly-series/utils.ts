export function formatSeriesTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toISOString().slice(0, 10)
}

export function toCsvIsoTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toISOString()
}

export function formatAvgDuration(
  totalDurationSum: number,
  transferCount: number,
): number | null {
  if (transferCount <= 0) {
    return null
  }
  return totalDurationSum / transferCount
}

export function formatSeconds(value: number | null) {
  if (value === null) {
    return '-'
  }
  return `${value.toFixed(2)}s`
}

export function relativePercentDifference(
  srcValue: number,
  dstValue: number,
): number | null {
  const base = Math.max(Math.abs(srcValue), Math.abs(dstValue))
  if (base === 0) {
    return null
  }
  return (Math.abs(srcValue - dstValue) / base) * 100
}
