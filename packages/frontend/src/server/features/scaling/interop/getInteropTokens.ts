import { InMemoryCache, unique } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import type {
  InteropTokensResponse,
  InteropTopItemsInfiniteParams,
  InteropTopItemsParams,
  TokenData,
} from './types'
import { buildTokensDataMap } from './utils/buildTokensDataMap'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getDurationSplit } from './utils/getAverageDuration'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getRelevantBridgeTypes } from './utils/getRelevantBridgeTypes'
import { getTokensData } from './utils/getTokensData'
import { sortInteropTopItems } from './utils/sortInteropTopItems'

const logger = getLogger().for('getInteropTokens')
const PAGE_SIZE = 100
const interopTokensCache = new InMemoryCache({
  logger: getLogger()
    .for('InMemoryCache')
    .tag({ source: 'getInteropTokensInfinite' }),
})

export async function getInteropTokensInfinite({
  cursor,
  limit = PAGE_SIZE,
  sort,
  ...params
}: InteropTopItemsInfiniteParams): Promise<InteropTokensResponse> {
  const tokens = sortInteropTopItems(await getCachedInteropTokens(params), sort)
  const startIndex = cursor ?? 0
  const items = tokens.slice(startIndex, startIndex + limit)
  const nextCursor =
    startIndex + limit < tokens.length ? startIndex + limit : undefined

  return { items, nextCursor }
}

async function getCachedInteropTokens(params: InteropTopItemsParams) {
  return await interopTokensCache.get(
    {
      key: [
        'interop-tokens',
        params.id?.toString() ?? 'all',
        params.type ?? 'all',
        [...params.from].sort().join(','),
        [...params.to].sort().join(','),
        [...(params.protocolIds ?? [])].sort().join(','),
      ],
      ttl: 60 * 10,
      staleWhileRevalidate: 60 * 15,
    },
    () => getInteropTokensData(params),
  )
}

async function getInteropTokensData({
  id,
  from,
  to,
  type,
  protocolIds,
}: InteropTopItemsParams): Promise<TokenData[]> {
  if (env.MOCK) {
    return getMockInteropTokens()
  }

  const [interopProject, interopProjects] = await Promise.all([
    id ? ps.getProject({ id, select: ['interopConfig'] }) : undefined,
    ps.getProjects({ select: ['interopConfig'] }),
  ])
  if (id && !interopProject) {
    return []
  }

  const { records } = await getLatestAggregatedInteropTransferWithTokens(
    { from, to },
    type ? [type] : undefined,
    id ? [id] : protocolIds,
  )

  const counts = {
    transferCount: records.reduce(
      (acc, transfer) => acc + transfer.transferCount,
      0,
    ),
    identifiedCount: records.reduce(
      (acc, transfer) => acc + transfer.identifiedCount,
      0,
    ),
  }

  const abstractTokenIds = unique(
    records.flatMap((record) =>
      record.tokens.map((token) => token.abstractTokenId),
    ),
  )
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)

  const relevantBridgeTypes = interopProject
    ? getRelevantBridgeTypes(interopProject, type)
    : []
  const durationSplit = interopProject
    ? getDurationSplit(interopProject, relevantBridgeTypes)
    : undefined

  const tokenDataMap = buildTokensDataMap(records)

  return getTokensData({
    tokens: tokenDataMap,
    tokensDetailsMap,
    interopProjects,
    unknownTransfersCount: counts.transferCount - counts.identifiedCount,
    logger,
    durationSplit,
  })
}

function getMockInteropTokens(): TokenData[] {
  const ethIcon =
    'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880'
  const usdcIcon =
    'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694'
  const usdtIcon =
    'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663'
  const wbtcIcon =
    'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1548822744'

  return [
    {
      id: 'eth001',
      symbol: 'ETH',
      issuer: 'ethereum',
      iconUrl: ethIcon,
      topProtocol: undefined,
      volume: 10_000_000,
      transferCount: 1000,
      avgDuration: { type: 'single', duration: 100_000 },
      avgValue: 10_000,
      minTransferValueUsd: 8_500,
      maxTransferValueUsd: 12_000,
      netMintedValue: undefined,
      flows: [],
    },
    {
      id: 'usdc01',
      symbol: 'USDC',
      issuer: 'circle',
      iconUrl: usdcIcon,
      topProtocol: undefined,
      volume: 5_000_000,
      transferCount: 500,
      avgDuration: { type: 'single', duration: 50_000 },
      avgValue: 10_000,
      minTransferValueUsd: 9_500,
      maxTransferValueUsd: 10_500,
      netMintedValue: undefined,
      flows: [],
    },
    {
      id: 'usdt01',
      symbol: 'USDT',
      issuer: 'tether',
      iconUrl: usdtIcon,
      topProtocol: undefined,
      volume: 3_000_000,
      transferCount: 300,
      avgDuration: { type: 'single', duration: 70_000 },
      avgValue: 10_000,
      minTransferValueUsd: 9_000,
      maxTransferValueUsd: 11_000,
      netMintedValue: undefined,
      flows: [],
    },
    {
      id: 'wbtc01',
      symbol: 'WBTC',
      issuer: 'bitgo',
      iconUrl: wbtcIcon,
      topProtocol: undefined,
      volume: 1_500_000,
      transferCount: 50,
      avgDuration: { type: 'single', duration: 200_000 },
      avgValue: 30_000,
      minTransferValueUsd: 20_000,
      maxTransferValueUsd: 80_000,
      netMintedValue: undefined,
      flows: [],
    },
  ]
}
