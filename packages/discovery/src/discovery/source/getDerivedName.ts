import type { EthereumAddress } from '@l2beat/shared-pure'
import type { ContractSources } from './SourceCodeService'

export function getLegacyDerivedName(names: string[]): string {
  return (names.length === 2 ? names[1] : names[0]) ?? ''
}

export function getImplementationNames(
  address: EthereumAddress,
  sources: ContractSources,
): Record<EthereumAddress, string> | undefined {
  const baseEntry = [address.toString(), sources.name]

  const perSourceEntries = sources.sources.map((s) => [
    s.address.toString(),
    s.name,
  ])

  const entries = [baseEntry, ...perSourceEntries]

  if (entries.length > 1) {
    return Object.fromEntries(entries)
  }

  return undefined
}
