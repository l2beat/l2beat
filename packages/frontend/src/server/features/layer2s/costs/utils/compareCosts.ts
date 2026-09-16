interface Named {
  name: string
}

// Takes a getter instead of reading a field so entries don't have to carry a
// sort-only value into the serialized page data.
export function compareCosts<T extends Named>(
  getCostPerUop: (entry: T) => number,
) {
  return (a: T, b: T) => {
    const diff = getCostPerUop(a) - getCostPerUop(b)
    if (diff !== 0) {
      return diff
    }
    return a.name.localeCompare(b.name)
  }
}
