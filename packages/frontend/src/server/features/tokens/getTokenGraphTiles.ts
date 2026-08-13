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
  // Roughly 1s in parallel against a warm pool, versus 2.6s sequentially.
  // Assembling the tiles from the result costs ~100ms, so the reads are the
  // whole cost of this function.
  const [
    abstractTokens,
    deployedTokens,
    routes,
    volumeByTokenId,
    projectsWithChains,
    interopProjects,
  ] = await Promise.all([
    tokenDb.abstractToken.getAllSummaries(),
    tokenDb.deployedToken.getAllAssignments(),
    tokenDb.tokenRelation.getAllRoutes(),
    getVolumeByTokenId(),
    ps.getProjects({ select: ['chainConfig'] }),
    ps.getProjects({ select: ['interopConfig'] }),
  ])

  const activeInteropChains = getInteropChains().filter(
    (chain) => !chain.isUpcoming,
  )
  const chainInfo = getChainDisplayInfo(
    deployedTokens.map((deployment) => deployment.chain),
    mapInteropChainsToWithIcons(manifest, activeInteropChains),
    projectsWithChains,
  )
  const chainIconUrlById = new Map(
    [...chainInfo].flatMap(([chain, info]) =>
      info.iconUrl ? [[chain, info.iconUrl] as const] : [],
    ),
  )

  return buildTokenGraphTiles({
    abstractTokens,
    deployedTokens,
    routes,
    volumeByTokenId,
    chainIconUrlById,
    interopProjects,
  })
}

/**
 * One read of the promoted snapshot, summed per token. Deliberately not
 * `getSummedStatsByTimestampAndTokens`, which builds a single unbatched OR of
 * tuple equalities — fine for one token's deployments, not for the catalogue.
 */
async function getVolumeByTokenId(): Promise<Map<string, number>> {
  const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
  if (!snapshotTimestamp) return new Map()

  const records =
    await getDb().aggregatedInteropToken.getByTimestamp(snapshotTimestamp)
  const volumeByTokenId = new Map<string, number>()
  for (const record of records) {
    volumeByTokenId.set(
      record.abstractTokenId,
      (volumeByTokenId.get(record.abstractTokenId) ?? 0) + record.volume,
    )
  }
  return volumeByTokenId
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
        { id: 'arbitrum|0xaf88', chains: ['arbitrum', 'ethereum'] },
        { id: 'base|0x8335', chains: ['base'] },
        { id: 'polygonpos|0x2791', chains: ['polygonpos'] },
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
        { id: 'ethereum|0xdac1', chains: ['ethereum'] },
        { id: 'optimism|0x94b0', chains: ['optimism'] },
      ],
      edges: [
        { from: 'ethereum|0xdac1', to: 'optimism|0x94b0', kind: 'backs' },
      ],
      unconnectedNodeIds: [],
    },
  },
]
