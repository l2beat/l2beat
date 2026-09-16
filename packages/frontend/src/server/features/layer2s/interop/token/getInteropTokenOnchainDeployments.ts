import { isMintedAtEndpoint, type TokenRelationRoute } from '@l2beat/database'
import { env } from '~/env'
import { getTokenDb } from '~/server/tokenDb'
import { deploymentKey } from '../utils/deploymentKey'

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

export async function getInteropTokenOnchainDeployments(
  tokenId: string,
  supportedChainIds: string[],
): Promise<InteropTokenDeployments> {
  if (env.MOCK) {
    return MOCK_INTEROP_TOKEN_DEPLOYMENTS
  }
  const tokenDb = getTokenDb()

  const deployedTokens = (
    await tokenDb.deployedToken.getByAbstractTokenId(tokenId)
  ).filter((token) => !token.ignored)
  if (deployedTokens.length === 0) return { deployments: [], routes: [] }

  const relations = await tokenDb.tokenRelation.getRelationsTouching(
    deployedTokens.map((token) => ({
      chain: token.chain,
      address: token.address,
    })),
  )
  const keys = new Set(deployedTokens.map(deploymentKey))
  const mintingPlugins = getMintingPlugins(relations, keys)
  const supportedChains = new Set(supportedChainIds)

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

function endpoint(
  relation: TokenRelationRoute,
  slot: 'A' | 'B',
): { chain: string; address: string } {
  return slot === 'A'
    ? { chain: relation.tokenAChain, address: relation.tokenAAddress }
    : { chain: relation.tokenBChain, address: relation.tokenBAddress }
}

const MOCK_INTEROP_TOKEN_DEPLOYMENTS: InteropTokenDeployments = {
  deployments: [
    {
      chain: 'ethereum',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      mintingPlugins: [],
      isSupported: true,
    },
    {
      chain: 'arbitrum',
      address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      symbol: 'USDC',
      mintingPlugins: [
        {
          plugin: 'cctp-v2',
          bridgeType: 'burnAndMint',
          relatedChain: 'ethereum',
        },
        {
          plugin: 'orbitstack',
          bridgeType: 'lockAndMint',
          relatedChain: 'ethereum',
        },
      ],
      isSupported: true,
    },
    {
      chain: 'base',
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      symbol: 'USDbC',
      mintingPlugins: [
        {
          plugin: 'opstack',
          bridgeType: 'lockAndMint',
          relatedChain: 'ethereum',
        },
      ],
      isSupported: false,
    },
  ],
  routes: [
    {
      tokenAChain: 'arbitrum',
      tokenAAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      tokenBChain: 'ethereum',
      tokenBAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      plugin: 'cctp-v2',
      bridgeType: 'burnAndMint',
      lockedToken: null,
    },
    {
      tokenAChain: 'base',
      tokenAAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      tokenBChain: 'ethereum',
      tokenBAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      plugin: 'opstack',
      bridgeType: 'lockAndMint',
      lockedToken: 'B',
    },
  ],
}
