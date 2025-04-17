export function languageJoin(items: string[] | undefined) {
  if (!items || items.length === 0) {
    return undefined
  }
  if (items.length === 1) {
    return items[0]
  }
  items = [...items]
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it's there
  const last = items.pop()!
  return `${items.join(', ')} and ${last}`
}
