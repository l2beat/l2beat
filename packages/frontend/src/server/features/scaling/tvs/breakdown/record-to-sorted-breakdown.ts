import type {
  BreakdownRecord,
  CanonicalAssetBreakdownData,
  ExternalAssetBreakdownData,
  NativeAssetBreakdownData,
} from './types'

export type SortedBreakdown = {
  canonical: CanonicalAssetBreakdownData[]
  external: ExternalAssetBreakdownData[]
  native: NativeAssetBreakdownData[]
}

export function recordToSortedBreakdown(breakdown: BreakdownRecord) {
  const result: SortedBreakdown = {
    canonical: [],
    external: [],
    native: [],
  }

  const canonical = [...breakdown.canonical.values()].sort(
    (a, b) => +b.usdValue - +a.usdValue,
  )

  result.canonical = canonical.map((x) => ({
    ...x,
    escrows: x.escrows.sort((a, b) => +b.amount - +a.amount),
    amount: x.amount,
    usdValue: x.usdValue,
  }))
  result.external = breakdown.external.sort((a, b) => +b.usdValue - +a.usdValue)
  result.native = breakdown.native.sort((a, b) => +b.usdValue - +a.usdValue)

  return result
}
