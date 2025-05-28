import type { BreakdownRecord } from './types'

export function recordToSortedBreakdown(breakdown: BreakdownRecord) {
  const result: BreakdownRecord = {
    canonical: [],
    external: [],
    native: [],
  }

  result.canonical = breakdown.canonical.sort(
    (a, b) => +b.usdValue - +a.usdValue,
  )
  result.external = breakdown.external.sort((a, b) => +b.usdValue - +a.usdValue)
  result.native = breakdown.native.sort((a, b) => +b.usdValue - +a.usdValue)

  return result
}
