import { InMemoryCache, unique } from '@l2beat/shared-pure'
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
const interopTokensCache = new InMemoryCache({})

export async function getInteropTokens(
  params: InteropTopItemsParams,
): Promise<TokenData[]> {
  return await getCachedInteropTokens(params)
}

export async function getInteropTokensInfinite({
  cursor,
  sort,
  ...params
}: InteropTopItemsInfiniteParams): Promise<InteropTokensResponse> {
  const tokens = sortInteropTopItems(await getCachedInteropTokens(params), sort)
  const startIndex = cursor ?? 0
  const items = tokens.slice(startIndex, startIndex + PAGE_SIZE)
  const nextCursor =
    startIndex + PAGE_SIZE < tokens.length ? startIndex + PAGE_SIZE : undefined

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
  const [interopProject, interopProjects] = await Promise.all([
    id ? ps.getProject({ id, select: ['interopConfig'] }) : undefined,
    ps.getProjects({ select: ['interopConfig'] }),
  ])
  if (id && !interopProject) {
    return []
  }

  const { records } = await getLatestAggregatedInteropTransferWithTokens(
    { from, to },
    type,
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
