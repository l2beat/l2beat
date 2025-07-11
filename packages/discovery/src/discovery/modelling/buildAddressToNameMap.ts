import type { EntryParameters } from '../output/types'

export function buildAddressToNameMap(
  entries: EntryParameters[],
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const entity of entries) {
    const address = entity.address.toLowerCase()
    const suffix = `_${address.replaceAll(':', '_')}`
    result[address] = (entity.name ?? 'eoa') + suffix
  }
  return result
}
