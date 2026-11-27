export type CostSortKey = 'cost' | 'cheaper' | 'totalFees'

interface Sortable {
  isEthereum: boolean
  sortValues: Record<CostSortKey, number | null>
}

/** Ethereum stays first, and a row without a value is last whichever way */
export function sortCostRows<T extends Sortable>(
  rows: T[],
  key: CostSortKey,
  desc: boolean,
): T[] {
  return [...rows].sort((a, b) => {
    if (a.isEthereum !== b.isEthereum) return a.isEthereum ? -1 : 1
    const x = a.sortValues[key]
    const y = b.sortValues[key]
    if (x === null || y === null) return x === y ? 0 : x === null ? 1 : -1
    return desc ? y - x : x - y
  })
}
