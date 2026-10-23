export type ListDirection = 'previous' | 'next'

export function getAdjacentAddress(
  addresses: readonly string[],
  selected: readonly string[],
  direction: ListDirection,
): string | undefined {
  if (addresses.length === 0) {
    return undefined
  }
  const anchor = selected.findLast((address) => addresses.includes(address))
  if (anchor === undefined) {
    return direction === 'next' ? addresses[0] : addresses.at(-1)
  }
  const index = addresses.indexOf(anchor)
  const targetIndex = direction === 'next' ? index + 1 : index - 1
  return addresses[targetIndex]
}
