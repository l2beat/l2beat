import type { EntryParameters } from '../output/types'

export function buildAddressToNameMap(
  chain: string,
  entries: EntryParameters[],
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const entity of entries) {
    const address = entity.address.toLowerCase()
    const suffix = `_${chain}_${address}`
    result[address] = (entity.name ?? 'eoa') + suffix
  }
  return result
}
