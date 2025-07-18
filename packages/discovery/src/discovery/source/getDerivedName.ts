import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ContractSources } from './SourceCodeService'

export function getLegacyDerivedName(names: string[]): string {
  return (names.length === 2 ? names[1] : names[0]) ?? ''
}

export function getImplementationNames(
  address: ChainSpecificAddress,
  sources: ContractSources,
): Record<ChainSpecificAddress, string> | undefined {
  const baseEntry = [address.toString(), sources.name]

  const perSourceEntries = sources.sources.map((s) => [
    s.address.toString(),
    s.name,
  ])

  const entries = [baseEntry, ...perSourceEntries]

  return entries.length > 1 ? Object.fromEntries(entries) : undefined
}
