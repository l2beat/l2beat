import type { Analysis } from '../analysis/AddressAnalyzer'
import type { DiscoveryOutput } from './types'

export function remapDiscoverySourceNames(
  results: Analysis[],
  discoveryOutput: DiscoveryOutput,
): Analysis[] {
  return results.map((entry) => {
    if (entry.type === 'EOA' || entry.type === 'Reference') {
      return entry
    }

    const matchingEntry = discoveryOutput.entries.find(
      (e) => e.address === entry.address,
    )

    if (!matchingEntry) {
      return entry
    }

    return {
      ...entry,
      name: matchingEntry.name ?? entry.name,
    }
  })
}
