interface TvsComparable {
  name: string
  tvsOrder: number
}

export function compareTvs(a: TvsComparable, b: TvsComparable) {
  const diff = b.tvsOrder - a.tvsOrder
  if (diff !== 0) {
    return diff
  }
  return a.name.localeCompare(b.name)
}
