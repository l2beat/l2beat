import type { EntryParameters } from '../output/types'

export function buildAddressToNameMap(
  entries: EntryParameters[],
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const entity of entries.filter((e) => e.type !== 'Reference')) {
    const address = entity.address.toLowerCase()
    result[address] = address.replaceAll(':', '_')
  }
  return result
}
