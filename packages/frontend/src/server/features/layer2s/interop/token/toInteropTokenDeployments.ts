import { isMintedAtEndpoint, type TokenRelationRoute } from '@l2beat/database'
import { deploymentKey, type Endpoint } from '../utils/deploymentKey'

export interface InteropTokenMintingPlugin {
  plugin: string
  bridgeType: 'burnAndMint' | 'lockAndMint'
  relatedChain: string
}

export interface InteropTokenOnchainDeployment {
  chain: string
  address: string
  symbol: string
  mintingPlugins: InteropTokenMintingPlugin[]
  isSupported: boolean
}

export interface InteropTokenDeployments {
  deployments: InteropTokenOnchainDeployment[]
  /** Relations with both endpoints among the deployments. */
  routes: TokenRelationRoute[]
}

/** `relations` are those touching any of the deployed tokens. */
export function toInteropTokenDeployments(
  deployedTokens: (Endpoint & { symbol: string })[],
  relations: TokenRelationRoute[],
  supportedChains: ReadonlySet<string>,
): InteropTokenDeployments {
  const keys = new Set(deployedTokens.map(deploymentKey))
  const mintingPlugins = getMintingPlugins(relations, keys)

  return {
    deployments: deployedTokens.map((token) => ({
      chain: token.chain,
      address: token.address,
      symbol: token.symbol,
      mintingPlugins: mintingPlugins.get(deploymentKey(token)) ?? [],
      isSupported: supportedChains.has(token.chain),
    })),
    routes: relations.filter(
      (relation) =>
        keys.has(deploymentKey(endpoint(relation, 'A'))) &&
        keys.has(deploymentKey(endpoint(relation, 'B'))),
    ),
  }
}

// Relations leading outside the set count too: a deployment minted from an
// uncatalogued token is still minted.
function getMintingPlugins(
  relations: TokenRelationRoute[],
  deployments: ReadonlySet<string>,
): Map<string, InteropTokenMintingPlugin[]> {
  const result = new Map<string, Map<string, InteropTokenMintingPlugin>>()
  for (const relation of relations) {
    for (const slot of ['A', 'B'] as const) {
      const key = deploymentKey(endpoint(relation, slot))
      if (!deployments.has(key) || !isMintedAtEndpoint(relation, slot)) continue
      const plugin: InteropTokenMintingPlugin = {
        plugin: relation.plugin,
        bridgeType: relation.bridgeType,
        relatedChain: endpoint(relation, slot === 'A' ? 'B' : 'A').chain,
      }
      const plugins = result.get(key) ?? new Map()
      plugins.set(
        `${plugin.plugin}|${plugin.bridgeType}|${plugin.relatedChain}`,
        plugin,
      )
      result.set(key, plugins)
    }
  }
  return new Map(
    [...result].map(([key, plugins]) => [key, [...plugins.values()]]),
  )
}

function endpoint(relation: TokenRelationRoute, slot: 'A' | 'B'): Endpoint {
  return slot === 'A'
    ? { chain: relation.tokenAChain, address: relation.tokenAAddress }
    : { chain: relation.tokenBChain, address: relation.tokenBAddress }
}
