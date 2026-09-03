import type { MintingPluginRecord } from '@l2beat/database'
import { env } from '~/env'
import { getTokenDb } from '~/server/tokenDb'

export interface InteropTokenOnchainDeployment {
  chain: string
  address: string
  symbol: string
  mintingPlugins: Pick<
    MintingPluginRecord,
    'plugin' | 'bridgeType' | 'relatedChain'
  >[]
  isSupported: boolean
}

export async function getInteropTokenOnchainDeployments(
  tokenId: string,
  supportedChainIds: string[],
): Promise<InteropTokenOnchainDeployment[]> {
  if (env.MOCK) {
    return MOCK_INTEROP_TOKEN_DEPLOYMENTS
  }
  const tokenDb = getTokenDb()

  const deployedTokens = (
    await tokenDb.deployedToken.getByAbstractTokenId(tokenId)
  ).filter((token) => !token.ignored)
  if (deployedTokens.length === 0) return []

  const mintingPlugins = await tokenDb.tokenRelation.getMintingPluginsForMany(
    deployedTokens.map((token) => ({
      chain: token.chain,
      address: token.address,
    })),
  )
  const mintingPluginsMap = new Map<
    string,
    InteropTokenOnchainDeployment['mintingPlugins']
  >()
  for (const record of mintingPlugins) {
    const key = deploymentKey(record.chain, record.address)
    const plugins = mintingPluginsMap.get(key) ?? []
    plugins.push({
      plugin: record.plugin,
      bridgeType: record.bridgeType,
      relatedChain: record.relatedChain,
    })
    mintingPluginsMap.set(key, plugins)
  }
  const supportedChains = new Set(supportedChainIds)

  return deployedTokens.map((token) => ({
    chain: token.chain,
    address: token.address,
    symbol: token.symbol,
    mintingPlugins:
      mintingPluginsMap.get(deploymentKey(token.chain, token.address)) ?? [],
    isSupported: supportedChains.has(token.chain),
  }))
}

function deploymentKey(chain: string, address: string): string {
  return `${chain}|${address.toLowerCase()}`
}

const MOCK_INTEROP_TOKEN_DEPLOYMENTS: InteropTokenOnchainDeployment[] = [
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
]
