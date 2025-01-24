interface TvlComparable {
  name: string
  tvlOrder: number
}

export function compareTvl(a: TvlComparable, b: TvlComparable) {
  const diff = b.tvlOrder - a.tvlOrder
  if (diff !== 0) {
    return diff
  }
  return a.name.localeCompare(b.name)
}
