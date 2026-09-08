/** Items whose key is undefined are left out. */
export function groupBy<T, K>(
  items: Iterable<T>,
  keyOf: (item: T) => K | undefined,
): Map<K, T[]> {
  const groups = new Map<K, T[]>()
  for (const item of items) {
    const key = keyOf(item)
    if (key === undefined) continue
    const group = groups.get(key)
    if (group) group.push(item)
    else groups.set(key, [item])
  }
  return groups
}
