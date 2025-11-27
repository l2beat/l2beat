import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ContractSources } from './SourceCodeService.js'

export function getLibraries(
  chain: string,
  sources: ContractSources,
): ChainSpecificAddress[] {
  const libraries: ChainSpecificAddress[] = []
  for (const source of sources.sources) {
    const address = Object.values(source.source.libraries)
    libraries.push(
      ...address.map((a) => ChainSpecificAddress.fromLong(chain, a)),
    )
  }
  return libraries
}
