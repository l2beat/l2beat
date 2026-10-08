import { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  getChainConfigs,
  getChainFullName,
  getDiscoveryPaths,
  type IProvider,
  SQLiteCache,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
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

export function deployedSourceFromDiscovery(): GetDeployedSource {
  const allProviders = new AllProviders(
    getChainConfigs(),
    new HttpClient(),
    new SQLiteCache(getDiscoveryPaths().cache),
    Logger.SILENT,
  )
  const providers = new Map<string, Promise<IProvider>>()
  return async (address) => {
    const chain = getChainFullName(ChainSpecificAddress.chain(address))
    let provider = providers.get(chain)
    if (provider === undefined) {
      provider = providerAtLatestBlock(allProviders, chain)
      providers.set(chain, provider)
    }
    const source = await (await provider).getSource(address)
    if (!source.isVerified) {
      return { kind: 'unverified' }
    }
    const flat = flattenContractSource(source, true)
    if (flat === undefined) {
      return { kind: 'non-solidity' }
    }
    return { kind: 'flat', flat, aliases: aliasesByDeclaration(source.files) }
  }
}

async function providerAtLatestBlock(
  allProviders: AllProviders,
  chain: string,
): Promise<IProvider> {
  const blockNumber = await allProviders.getLatestBlockNumber(chain)
  return allProviders.getByBlockNumber(chain, blockNumber)
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
