export function createOrderedSort<T>(
  order: string[],
  keyExtractor: (item: T) => string,
) {
  return (a: T, b: T) => {
    const aIndex = order.indexOf(keyExtractor(a))
    const bIndex = order.indexOf(keyExtractor(b))

    // Treat items not in order as having a very high index (sort to end)
    const normalizedAIndex = aIndex === -1 ? Infinity : aIndex
    const normalizedBIndex = bIndex === -1 ? Infinity : bIndex

    return normalizedAIndex - normalizedBIndex
  }
}
