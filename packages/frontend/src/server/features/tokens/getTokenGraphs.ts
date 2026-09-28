import type { Project } from '@l2beat/config'
import {
  type AbstractTokenSummary,
  type DeployedTokenAssignment,
  INTEROP_TRANSFER_RETENTION,
  type InteropTransferDeployedTokenPairStats,
  type TokenRelationRoute,
} from '@l2beat/database'
import { Address32, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getTokenDb } from '~/server/tokenDb'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { getActiveInteropAbstractTokens } from '../layer2s/interop/token/getInteropAbstractTokens'
import {
  getInteropTokenRelationsGraph,
  type InteropTokenRelationsGraph,
} from '../layer2s/interop/token/getInteropTokenRelationsGraph'
import { toInteropTokenDeployments } from '../layer2s/interop/token/toInteropTokenDeployments'
import { createInteropProjectResolver } from '../layer2s/interop/utils/createInteropProjectResolver'
import { getAggregatedInteropSnapshotTimestamp } from '../layer2s/interop/utils/getAggregatedInteropTimestamp'
import { getActiveInteropChainIds } from '../layer2s/interop/utils/getInteropChains'
import { getRelationsGraphProjects } from '../layer2s/interop/utils/getRelationsGraphProjects'
import {
  compareTokenGraphTiles,
  groupRelationInputsByToken,
  type TokenGraphTile,
  toTokenGraphTile,
} from './buildTokenGraphTiles'

export interface TokenGraphs {
  /** Busiest first. */
  tiles: TokenGraphTile[]
  /**
   * The full graph of every tiled token and every token with a detail page,
   * so the dialog and the detail page cannot disagree with the tile.
   */
  graphs: Map<string, InteropTokenRelationsGraph>
}

const tokenGraphsCache = new FrontendInMemoryCache('getTokenGraphs')

export async function getTokenGraphs(): Promise<TokenGraphs> {
  return await tokenGraphsCache.get(
    {
      key: ['token-graphs'],
      ttl: 10 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    getTokenGraphsData,
  )
}

async function getTokenGraphsData(): Promise<TokenGraphs> {
  const [
    { tokens, assignments, routes: allRoutes },
    tokensWithPage,
    {
      projectsWithChains,
      interopProjects,
      volumeByTokenId,
      pairStatsByTokenId,
    },
  ] = await Promise.all([
    getTokenRelationData(),
    getActiveInteropAbstractTokens(),
    getInteropData(),
  ])

  const inputsByToken = groupRelationInputsByToken(assignments, allRoutes)
  const supportedChains = new Set(getActiveInteropChainIds())
  const resolveProjects = createInteropProjectResolver(interopProjects)
  const linkableTokenIds = new Set(tokensWithPage.map((token) => token.id))

  const tiles: TokenGraphTile[] = []
  const graphs = new Map<string, InteropTokenRelationsGraph>()
  for (const token of tokens) {
    const inputs = inputsByToken.get(token.id)
    const linkable = linkableTokenIds.has(token.id)
    // Without a relation there is no tile, so only a detail page needs the graph.
    if (!inputs || (inputs.routes.length === 0 && !linkable)) continue

    const { deployments, routes } = toInteropTokenDeployments(
      inputs.deployedTokens,
      inputs.routes,
      supportedChains,
    )
    const graph = getInteropTokenRelationsGraph(
      token.id,
      deployments,
      {
        routes,
        pairStats:
          pairStatsByTokenId && (pairStatsByTokenId.get(token.id) ?? []),
      },
      projectsWithChains,
      resolveProjects,
    )
    const tile = toTokenGraphTile(token, graph, {
      volume: volumeByTokenId.get(token.id) ?? null,
      linkable,
    })
    if (tile) tiles.push(tile)
    if (tile || linkable) graphs.set(token.id, graph)
  }

  return { tiles: tiles.toSorted(compareTokenGraphTiles), graphs }
}

/** Everything that depends on the aggregates snapshot or project configs. */
async function getInteropData() {
  const [snapshotTimestamp, projects] = await Promise.all([
    getAggregatedInteropSnapshotTimestamp(),
    getRelationsGraphProjects(),
  ])
  const [volumeByTokenId, pairStatsByTokenId] = await Promise.all([
    getVolumeByTokenId(snapshotTimestamp),
    getPairStatsByTokenId(snapshotTimestamp, projects.interopProjects),
  ])
  return { ...projects, volumeByTokenId, pairStatsByTokenId }
}

interface TokenRelationData {
  tokens: AbstractTokenSummary[]
  assignments: DeployedTokenAssignment[]
  routes: TokenRelationRoute[]
}

async function getTokenRelationData(): Promise<TokenRelationData> {
  if (env.MOCK) return MOCK_TOKEN_RELATION_DATA

  const tokenDb = getTokenDb()
  const [tokens, assignments, routes] = await Promise.all([
    tokenDb.abstractToken.getAllSummaries(),
    tokenDb.deployedToken.getAllAssignments(),
    tokenDb.tokenRelation.getAllRoutes(),
  ])
  return { tokens, assignments, routes }
}

async function getPairStatsByTokenId(
  snapshotTimestamp: UnixTime | undefined,
  projects: Project<'interopConfig'>[],
) {
  if (env.MOCK) return new Map([['usdc01', MOCK_USDC_PAIR_STATS]])
  if (!snapshotTimestamp) return undefined

  const from = snapshotTimestamp - UnixTime.DAY
  // Aggregates outlive raw transfers, so an aggregates timestamp override can
  // point at a day the cleaner has already emptied.
  if (from < UnixTime.now() - INTEROP_TRANSFER_RETENTION) return undefined
  const chains = getActiveInteropChainIds()
  const rows = await getDb().interopTransfer.getAllDeployedTokenPairStats(
    { from, to: snapshotTimestamp },
    {
      plugins: projects.flatMap((project) => project.interopConfig.plugins),
      sourceChains: chains,
      destinationChains: chains,
    },
  )
  return Map.groupBy(rows, (row) => row.abstractTokenId)
}

async function getVolumeByTokenId(
  snapshotTimestamp: UnixTime | undefined,
): Promise<Map<string, number>> {
  if (env.MOCK) {
    return new Map([
      ['usdc01', 2_170_000],
      ['usdt01', 890_000],
    ])
  }
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

const MOCK_DEPLOYMENTS = {
  usdcEthereum: mockDeployment(
    'usdc01',
    'USDC',
    'ethereum',
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  ),
  usdcArbitrum: mockDeployment(
    'usdc01',
    'USDC',
    'arbitrum',
    '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  ),
  usdcBase: mockDeployment(
    'usdc01',
    'USDC',
    'base',
    '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  ),
  usdcOptimism: mockDeployment(
    'usdc01',
    'USDC',
    'optimism',
    '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
  ),
  usdtEthereum: mockDeployment(
    'usdt01',
    'USDT',
    'ethereum',
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
  ),
  usdtArbitrum: mockDeployment(
    'usdt01',
    'USDT',
    'arbitrum',
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
  ),
  usdtOptimism: mockDeployment(
    'usdt01',
    'USDT',
    'optimism',
    '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
  ),
  ethBase: mockDeployment(
    'eth001',
    'ETH',
    'base',
    '0x4200000000000000000000000000000000000006',
  ),
  ethOptimism: mockDeployment(
    'eth001',
    'ETH',
    'optimism',
    '0x4200000000000000000000000000000000000006',
  ),
}

const MOCK_TOKEN_RELATION_DATA: TokenRelationData = {
  tokens: [
    {
      id: 'usdc01',
      symbol: 'USDC',
      issuer: 'circle',
      iconUrl:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
    },
    {
      id: 'usdt01',
      symbol: 'USDT',
      issuer: 'tether',
      iconUrl:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
    },
    {
      id: 'eth001',
      symbol: 'ETH',
      issuer: 'ethereum',
      iconUrl:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    },
  ],
  assignments: Object.values(MOCK_DEPLOYMENTS),
  routes: [
    mockRoute(
      MOCK_DEPLOYMENTS.usdcArbitrum,
      MOCK_DEPLOYMENTS.usdcEthereum,
      'cctp-v2',
      'burnAndMint',
    ),
    mockRoute(
      MOCK_DEPLOYMENTS.usdcEthereum,
      MOCK_DEPLOYMENTS.usdcBase,
      'opstack',
      'lockAndMint',
      'A',
    ),
    mockRoute(
      MOCK_DEPLOYMENTS.usdcEthereum,
      MOCK_DEPLOYMENTS.usdcOptimism,
      'opstack',
      'lockAndMint',
      'A',
    ),
    mockRoute(
      MOCK_DEPLOYMENTS.usdtEthereum,
      MOCK_DEPLOYMENTS.usdtArbitrum,
      'orbitstack',
      'lockAndMint',
      'A',
    ),
    mockRoute(
      MOCK_DEPLOYMENTS.usdtArbitrum,
      MOCK_DEPLOYMENTS.usdtOptimism,
      'layerzero-v2-ofts',
      'lockAndMint',
      'A',
    ),
    mockRoute(
      MOCK_DEPLOYMENTS.ethBase,
      MOCK_DEPLOYMENTS.ethOptimism,
      'opstack',
      'burnAndMint',
    ),
  ],
}

const MOCK_USDC_PAIR_STATS: InteropTransferDeployedTokenPairStats[] = [
  {
    src: {
      chain: 'ethereum',
      address: Address32.from(MOCK_DEPLOYMENTS.usdcEthereum.address),
    },
    dst: {
      chain: 'arbitrum',
      address: Address32.from(MOCK_DEPLOYMENTS.usdcArbitrum.address),
    },
    transferCount: 403,
    transfersWithDurationCount: 403,
    totalDurationSum: 9_672,
    volume: 2_170_000,
  },
  {
    src: {
      chain: 'arbitrum',
      address: Address32.from(MOCK_DEPLOYMENTS.usdcArbitrum.address),
    },
    dst: {
      chain: 'ethereum',
      address: Address32.from(MOCK_DEPLOYMENTS.usdcEthereum.address),
    },
    transferCount: 125,
    transfersWithDurationCount: 125,
    totalDurationSum: 2_375,
    volume: 392_430,
  },
]

function mockDeployment(
  abstractTokenId: string,
  symbol: string,
  chain: string,
  address: string,
): DeployedTokenAssignment {
  return { chain, address, symbol, abstractTokenId, ignored: false }
}

function mockRoute(
  a: DeployedTokenAssignment,
  b: DeployedTokenAssignment,
  plugin: string,
  bridgeType: TokenRelationRoute['bridgeType'],
  lockedToken: TokenRelationRoute['lockedToken'] = null,
): TokenRelationRoute {
  return {
    tokenAChain: a.chain,
    tokenAAddress: a.address,
    tokenBChain: b.chain,
    tokenBAddress: b.address,
    plugin,
    bridgeType,
    lockedToken,
  }
}
