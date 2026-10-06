import {
  type ContractSource,
  getChainFullName,
  getDiscoveryPaths,
  SQLiteCache,
} from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { flattenContractSource } from '../flatten'
import { splitSource } from './splitSource'

export type DeployedSource =
  | { kind: 'flat'; flat: string; aliases: DeployedAliases }
  | { kind: 'unverified' | 'non-solidity' }

export type DeployedAliases = Map<string, Map<string, string>>

export type GetDeployedSource = (
  address: ChainSpecificAddress,
) => Promise<DeployedSource>

// Discovery caches every verified source it fetched, so after discovery a
// missing entry means the contract is not verified.
export function deployedSourceFromCache(): GetDeployedSource {
  const cache = new SQLiteCache(getDiscoveryPaths().cache)
  return async (address) => {
    const chain = getChainFullName(ChainSpecificAddress.chain(address))
    const key = `${chain}.getSource-v3.${ChainSpecificAddress.address(address)}`
    const entry = await cache.get(key)
    if (entry === undefined) {
      return { kind: 'unverified' }
    }
    const source: ContractSource = JSON.parse(entry)
    const flat = flattenContractSource(source, true)
    if (flat === undefined) {
      return { kind: 'non-solidity' }
    }
    return { kind: 'flat', flat, aliases: aliasesByDeclaration(source.files) }
  }
}

// Flattening replaces import aliases with the names they stand for, so the
// aliases of the file declaring a unit are needed to compare it as written.
function aliasesByDeclaration(files: Record<string, string>): DeployedAliases {
  const aliases: DeployedAliases = new Map()
  for (const [path, content] of Object.entries(files)) {
    if (!path.endsWith('.sol') || !content.includes(' as ')) {
      continue
    }
    const split = splitSource(content)
    for (const name of split.declarations.keys()) {
      if (split.aliases.size > 0 && !aliases.has(name)) {
        aliases.set(name, split.aliases)
      }
    }
  }
  return aliases
}
