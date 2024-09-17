export function getLineDashSegments(
  range: '1d' | '7d' | '30d' | '90d' | '180d' | '1y' | 'max',
) {
  const isMoreThanYear = range === 'max'
  if (isMoreThanYear) {
    return [3, 2]
  }

  return [10, 5]
}
