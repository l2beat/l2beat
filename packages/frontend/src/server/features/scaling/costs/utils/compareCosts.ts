interface CostComparable {
  name: string
  costOrder: number
}

export function compareCosts(a: CostComparable, b: CostComparable) {
  const diff = a.costOrder - b.costOrder
  if (diff !== 0) {
    return diff
  }
  return a.name.localeCompare(b.name)
}
