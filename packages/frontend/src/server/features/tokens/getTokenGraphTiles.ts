import { Address32 } from '@l2beat/shared-pure'
import { env } from '~/env'
import { mapInteropChainsToWithIcons } from '~/pages/interop/utils/mapInteropChainsToWithIcons'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getTokenDb } from '~/server/tokenDb'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { manifest } from '~/utils/Manifest'
import { getChainDisplayInfo } from '../scaling/interop/token/getChainDisplayInfo'
import { getAggregatedInteropSnapshotTimestamp } from '../scaling/interop/utils/getAggregatedInteropTimestamp'
import { getInteropChains } from '../scaling/interop/utils/getInteropChains'
import {
  buildTokenGraphTiles,
  type TokenGraphTile,
} from './buildTokenGraphTiles'

export type { TokenGraphTile } from './buildTokenGraphTiles'

const tokenGraphTilesCache = new FrontendInMemoryCache('getTokenGraphTiles')

/**
 * Every token's relation graph, reduced to what a card draws.
 *
 * Three whole-table reads of the token database rather than one query per
 * token: the catalogue is small enough to hold in memory and the result is one
 * highly cacheable value, whereas 6,000 per-token round trips would not be.
 * Filtering, sorting and paging all happen in memory downstream of the cache,
 * the same way `getInteropTokensInfinite` handles its list.
 */
export async function getTokenGraphTiles(): Promise<TokenGraphTile[]> {
  if (env.MOCK) return MOCK_TOKEN_GRAPH_TILES

  return await tokenGraphTilesCache.get(
    {
      key: ['token-graph-tiles'],
      ttl: 10 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    getTokenGraphTilesData,
  )
}

async function getTokenGraphTilesData(): Promise<TokenGraphTile[]> {
  const tokenDb = getTokenDb()
  const activeInteropChains = getInteropChains().filter(
    (chain) => !chain.isUpcoming,
  )
  const supportedChainIds = new Set(
    activeInteropChains.map((chain) => chain.id),
  )
  // Roughly 1s in parallel against a warm pool, versus 2.6s sequentially.
  // Assembling the tiles from the result costs ~100ms, so the reads are the
  // whole cost of this function.
  const [
    abstractTokens,
    deployedTokens,
    routes,
    volumeMaps,
    projectsWithChains,
    interopProjects,
  ] = await Promise.all([
    tokenDb.abstractToken.getAllSummaries(),
    tokenDb.deployedToken.getAllAssignments(),
    tokenDb.tokenRelation.getAllRoutes(),
    getVolumeMaps(),
    ps.getProjects({ select: ['chainConfig'] }),
    ps.getProjects({ select: ['interopConfig'] }),
  ])

  const supportedDeployments = deployedTokens.filter((deployment) =>
    supportedChainIds.has(deployment.chain),
  )
  const chainInfo = getChainDisplayInfo(
    supportedDeployments.map((deployment) => deployment.chain),
    mapInteropChainsToWithIcons(manifest, activeInteropChains),
    projectsWithChains,
  )
  const chainIconUrlById = new Map(
    [...chainInfo].flatMap(([chain, info]) =>
      info.iconUrl ? [[chain, info.iconUrl] as const] : [],
    ),
  )
  const chainNameById = new Map(
    [...chainInfo].map(([chain, info]) => [chain, info.name]),
  )
  const volumeByDeployment = new Map(
    supportedDeployments.map((deployment) => [
      endpointKey(deployment.chain, deployment.address),
      volumeMaps.volumeByAggregatedDeployment.get(
        aggregatedDeploymentKey(deployment.chain, deployment.address),
      ) ?? 0,
    ]),
  )

  return buildTokenGraphTiles({
    abstractTokens,
    deployedTokens: supportedDeployments,
    routes,
    volumeByTokenId: volumeMaps.volumeByTokenId,
    volumeByDeployment,
    chainNameById,
    chainIconUrlById,
    interopProjects,
  })
}

/**
 * Two reads of the promoted snapshot, summed per token and deployment.
 * Deliberately not
 * `getSummedStatsByTimestampAndTokens`, which builds a single unbatched OR of
 * tuple equalities — fine for one token's deployments, not for the catalogue.
 */
async function getVolumeMaps(): Promise<{
  volumeByTokenId: Map<string, number>
  volumeByAggregatedDeployment: Map<string, number>
}> {
  const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
  if (!snapshotTimestamp) {
    return {
      volumeByTokenId: new Map(),
      volumeByAggregatedDeployment: new Map(),
    }
  }

  const db = getDb()
  const [tokenRecords, deploymentRecords] = await Promise.all([
    db.aggregatedInteropToken.getByTimestamp(snapshotTimestamp),
    db.aggregatedInteropDeployedToken.getByTimestamp(snapshotTimestamp),
  ])
  const volumeByTokenId = new Map<string, number>()
  for (const record of tokenRecords) {
    volumeByTokenId.set(
      record.abstractTokenId,
      (volumeByTokenId.get(record.abstractTokenId) ?? 0) + record.volume,
    )
  }

  const volumeByAggregatedDeployment = new Map<string, number>()
  for (const record of deploymentRecords) {
    const key = aggregatedDeploymentKey(record.tokenChain, record.tokenAddress)
    volumeByAggregatedDeployment.set(
      key,
      (volumeByAggregatedDeployment.get(key) ?? 0) + record.volume,
    )
  }

  return { volumeByTokenId, volumeByAggregatedDeployment }
}

function endpointKey(chain: string, address: string): string {
  return `${chain}|${address.toLowerCase()}`
}

function aggregatedDeploymentKey(chain: string, address: string): string {
  return `${chain}|${Address32.fromOrUndefined(address) ?? address.toLowerCase()}`
}

const MOCK_TOKEN_GRAPH_TILES: TokenGraphTile[] = [
  {
    id: 'usdc01',
    symbol: 'USDC',
    slug: 'circle-usdc',
    issuer: 'circle',
    iconUrl: null,
    deployments: 4,
    chains: 4,
    volume: 2_170_000,
    hasRelations: true,
    graph: {
      nodes: [
        {
          id: 'arbitrum|0xaf88',
          volume: 1_650_000,
          chains: ['arbitrum', 'ethereum'],
        },
        { id: 'base|0x8335', volume: 340_000, chains: ['base'] },
        {
          id: 'polygonpos|0x2791',
          volume: 180_000,
          chains: ['polygonpos'],
        },
      ],
      edges: [
        { from: 'arbitrum|0xaf88', to: 'base|0x8335', kind: 'backs' },
        { from: 'arbitrum|0xaf88', to: 'polygonpos|0x2791', kind: 'backs' },
      ],
      unconnectedNodeIds: [],
    },
  },
  {
    id: 'usdt01',
    symbol: 'USDT',
    slug: 'tether-usdt',
    issuer: 'tether',
    iconUrl: null,
    deployments: 2,
    chains: 2,
    volume: 890_000,
    hasRelations: true,
    graph: {
      nodes: [
        { id: 'ethereum|0xdac1', volume: 700_000, chains: ['ethereum'] },
        { id: 'optimism|0x94b0', volume: 190_000, chains: ['optimism'] },
      ],
      edges: [
        { from: 'ethereum|0xdac1', to: 'optimism|0x94b0', kind: 'backs' },
      ],
      unconnectedNodeIds: [],
    },
  },
]
