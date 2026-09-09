import { unique } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getTokenDb } from '~/server/tokenDb'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { manifest } from '~/utils/Manifest'
import { getActiveInteropAbstractTokens } from '../layer2s/interop/token/getInteropAbstractTokens'
import { getPairStatsParams } from '../layer2s/interop/token/getInteropTokenRelations'
import { getChainDisplayInfo } from '../layer2s/interop/token/getInteropTokenRelationsGraph'
import { createInteropProjectResolver } from '../layer2s/interop/utils/createInteropProjectResolver'
import { getAggregatedInteropSnapshotTimestamp } from '../layer2s/interop/utils/getAggregatedInteropTimestamp'
import { getActiveInteropChainIds } from '../layer2s/interop/utils/getInteropChains'
import { getRelationsGraphProjects } from '../layer2s/interop/utils/getRelationsGraphProjects'
import {
  buildTokenGraphTiles,
  type TokenGraphTile,
  type TokenGraphTileChainInfo,
} from './buildTokenGraphTiles'

const tokenGraphTilesCache = new FrontendInMemoryCache('getTokenGraphTiles')

export async function getTokenGraphTiles(): Promise<TokenGraphTile[]> {
  if (env.MOCK) return getMockTokenGraphTiles()

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
  const [
    tokens,
    assignments,
    routes,
    volumeByTokenId,
    tokensWithPage,
    pairStatsByTokenId,
    [projectsWithChains, interopProjects],
  ] = await Promise.all([
    tokenDb.abstractToken.getAllSummaries(),
    tokenDb.deployedToken.getAllAssignments(),
    tokenDb.tokenRelation.getAllRoutes(),
    getVolumeByTokenId(),
    getActiveInteropAbstractTokens(),
    getPairStatsByTokenId(),
    getRelationsGraphProjects(),
  ])

  const deployments = assignments.flatMap(
    ({ chain, address, abstractTokenId, ignored }) =>
      !ignored && abstractTokenId ? [{ chain, address, abstractTokenId }] : [],
  )
  const chainInfo = new Map<string, TokenGraphTileChainInfo>(
    unique(deployments.map((deployment) => deployment.chain)).map((chain) => {
      const info = getChainDisplayInfo(chain, projectsWithChains)
      return [chain, { name: info?.name ?? chain, iconUrl: info?.iconUrl }]
    }),
  )

  return buildTokenGraphTiles({
    tokens,
    deployments,
    routes,
    volumeByTokenId,
    linkableTokenIds: new Set(tokensWithPage.map((token) => token.id)),
    chainInfo,
    resolveProjects: createInteropProjectResolver(interopProjects),
    activeChainIds: new Set(getActiveInteropChainIds()),
    pairStatsByTokenId,
  })
}

async function getPairStatsByTokenId() {
  const params = await getPairStatsParams()
  if (!params) return undefined
  const rows = await getDb().interopTransfer.getAllDeployedTokenPairStats(
    params.timeRange,
    params.selection,
  )
  return Map.groupBy(rows, (row) => row.abstractTokenId)
}

async function getVolumeByTokenId(): Promise<Map<string, number>> {
  const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
  if (!snapshotTimestamp) return new Map()

  const chainIds = getActiveInteropChainIds()
  const records = await getDb().aggregatedInteropToken.getByChainsAndTimestamp(
    snapshotTimestamp,
    chainIds,
    chainIds,
  )

  const volumeByTokenId = new Map<string, number>()
  for (const record of records) {
    volumeByTokenId.set(
      record.abstractTokenId,
      (volumeByTokenId.get(record.abstractTokenId) ?? 0) + record.volume,
    )
  }
  return volumeByTokenId
}

function getMockTokenGraphTiles(): TokenGraphTile[] {
  const chain = (id: string) => ({
    id,
    iconUrl: manifest.getUrl(`/icons/${id}.png`),
  })
  return [
    {
      id: 'usdc01',
      symbol: 'USDC',
      issuer: 'circle',
      iconUrl:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      href: '/interop/tokens/usdc01/circle/usdc',
      volume: 2_170_000,
      deploymentsCount: 4,
      chainsCount: 4,
      bridgesCount: 2,
      graph: {
        nodes: [
          {
            id: 'arbitrum|0xaf88',
            chains: [chain('arbitrum'), chain('ethereum')],
            volume: null,
          },
          { id: 'base|0x8335', chains: [chain('base')], volume: null },
          { id: 'optimism|0x0b2c', chains: [chain('optimism')], volume: null },
        ],
        edges: [
          { from: 'arbitrum|0xaf88', to: 'base|0x8335' },
          { from: 'arbitrum|0xaf88', to: 'optimism|0x0b2c' },
        ],
      },
    },
    {
      id: 'usdt01',
      symbol: 'USDT',
      issuer: 'tether',
      iconUrl:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
      href: '/interop/tokens/usdt01/tether/usdt',
      volume: 890_000,
      deploymentsCount: 3,
      chainsCount: 3,
      bridgesCount: 1,
      graph: {
        nodes: [
          { id: 'ethereum|0xdac1', chains: [chain('ethereum')], volume: null },
          { id: 'arbitrum|0xfd08', chains: [chain('arbitrum')], volume: null },
          { id: 'optimism|0x94b0', chains: [chain('optimism')], volume: null },
        ],
        edges: [
          { from: 'ethereum|0xdac1', to: 'arbitrum|0xfd08' },
          { from: 'arbitrum|0xfd08', to: 'optimism|0x94b0' },
        ],
      },
    },
    {
      id: 'eth001',
      symbol: 'ETH',
      issuer: 'ethereum',
      iconUrl:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
      href: '/interop/tokens/eth001/ethereum/eth',
      volume: null,
      deploymentsCount: 2,
      chainsCount: 2,
      bridgesCount: 0,
      graph: {
        nodes: [
          {
            id: 'base|0x4200',
            chains: [chain('base'), chain('optimism')],
            volume: null,
          },
        ],
        edges: [],
      },
    },
  ]
}
