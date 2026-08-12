import { Address32 } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getTokenDb } from '~/server/tokenDb'
import { getAggregatedInteropSnapshotTimestamp } from '../utils/getAggregatedInteropTimestamp'

export interface InteropTokenOnchainDeployment {
  chain: string
  address: string
  symbol: string
  mintingPlugins: string[]
  isSupported: boolean
  volume: number | null
  transferCount: number | null
  avgDuration: number | null
}

export async function getInteropTokenOnchainDeployments(
  tokenId: string,
  supportedChainIds: string[],
): Promise<InteropTokenOnchainDeployment[]> {
  if (env.MOCK) {
    return MOCK_INTEROP_TOKEN_DEPLOYMENTS
  }
  const db = getDb()
  const tokenDb = getTokenDb()

  const deployedTokens =
    await tokenDb.deployedToken.getByAbstractTokenId(tokenId)
  if (deployedTokens.length === 0) return []

  // Aggregates store token addresses in Address32 format,
  // deployed tokens store them in long format.
  const statsKeys = deployedTokens.flatMap((token) => {
    const tokenAddress = Address32.fromOrUndefined(token.address)
    return tokenAddress ? [{ tokenChain: token.chain, tokenAddress }] : []
  })

  const [stats, mintingPlugins] = await Promise.all([
    (async () => {
      const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
      return snapshotTimestamp
        ? db.aggregatedInteropDeployedToken.getSummedStatsByTimestampAndTokens(
            snapshotTimestamp,
            statsKeys,
          )
        : []
    })(),
    tokenDb.tokenRelation.getMintingPluginsForMany(
      deployedTokens.map((token) => ({
        chain: token.chain,
        address: token.address,
      })),
    ),
  ])
  const statsMap = new Map(
    stats.map((stat) => [`${stat.tokenChain}|${stat.tokenAddress}`, stat]),
  )
  const mintingPluginsMap = new Map<string, string[]>()
  for (const record of mintingPlugins) {
    const key = deploymentKey(record.chain, record.address)
    const plugins = mintingPluginsMap.get(key) ?? []
    plugins.push(record.plugin)
    mintingPluginsMap.set(key, plugins)
  }
  const supportedChains = new Set(supportedChainIds)

  const deployments = deployedTokens.map((token) => {
    const tokenAddress = Address32.fromOrUndefined(token.address)
    const stat = tokenAddress
      ? statsMap.get(`${token.chain}|${tokenAddress}`)
      : undefined
    const isSupported = supportedChains.has(token.chain)
    return {
      chain: token.chain,
      address: token.address,
      symbol: token.symbol,
      mintingPlugins:
        mintingPluginsMap.get(deploymentKey(token.chain, token.address)) ?? [],
      isSupported,
      volume: stat?.volume ?? (isSupported ? 0 : null),
      transferCount: stat?.transferCount ?? (isSupported ? 0 : null),
      avgDuration:
        stat && stat.transfersWithDurationCount > 0
          ? Math.round(stat.totalDurationSum / stat.transfersWithDurationCount)
          : null,
    }
  })

  return deployments.sort(
    (a, b) =>
      (b.volume ?? -1) - (a.volume ?? -1) || a.chain.localeCompare(b.chain),
  )
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
    volume: 2_170_000,
    transferCount: 403,
    avgDuration: 24,
  },
  {
    chain: 'arbitrum',
    address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    symbol: 'USDC',
    mintingPlugins: ['cctp-v2', 'orbitstack'],
    isSupported: true,
    volume: 392_430,
    transferCount: 125,
    avgDuration: 19,
  },
  {
    chain: 'base',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDbC',
    mintingPlugins: ['opstack'],
    isSupported: false,
    volume: null,
    transferCount: null,
    avgDuration: null,
  },
]
