interface Named {
  name: string
}

// Takes a getter instead of reading a field so entries don't have to carry a
// sort-only value into the serialized page data.
export function compareTvs<T extends Named>(
  getTvs: (entry: T) => number | undefined,
) {
  return (a: T, b: T) => {
    const diff = (getTvs(b) ?? -1) - (getTvs(a) ?? -1)
    if (diff !== 0) {
      return diff
    }
    return a.name.localeCompare(b.name)
  }
}
