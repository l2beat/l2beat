import type { BreakdownRecord } from './types'

export function recordToSortedBreakdown(breakdown: BreakdownRecord) {
  const result: BreakdownRecord = {
    canonical: [],
    external: [],
    native: [],
  }

  result.canonical = breakdown.canonical.sort(
    (a, b) => +b.valueForProject - +a.valueForProject,
  )
  result.external = breakdown.external.sort(
    (a, b) => +b.valueForProject - +a.valueForProject,
  )
  result.native = breakdown.native.sort(
    (a, b) => +b.valueForProject - +a.valueForProject,
  )

  return result
}
