import type { EntryParameters } from '../output/types'

// Entries are expected in priority order: the modelled project first, then the
// projects it references. The same EOA can be discovered in full by several
// projects of a cluster (EOAs are deliberately not entrypoints), so the first
// claim wins and every project ends up emitting the same clingo identifier.
export function buildAddressToNameMap(
  entries: EntryParameters[],
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const entity of entries) {
    if (entity.type === 'Reference') {
      continue
    }
    const address = entity.address.toLowerCase()
    if (result[address] !== undefined) {
      continue
    }
    const suffix = `_${address.replaceAll(':', '_')}`
    result[address] = (entity.name ?? 'eoa') + suffix
  }
  return result
}
