import type { Project } from '@l2beat/config'
import { UnixTime, unique } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import { TOKEN_DASHBOARD_TOP_FLOWS_LIMIT } from './consts'
import { findInteropAbstractToken } from './token/getInteropAbstractTokens'
import type { InteropTokenParams, ProtocolEntry, TokenData } from './types'
import { buildTokensDataMap } from './utils/buildTokensDataMap'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getPromotedInteropSnapshotTimestamp } from './utils/getAggregatedInteropTimestamp'
import { getAverageDuration } from './utils/getAverageDuration'
import { getFlows, type InteropFlowData } from './utils/getFlows'
import { getActiveInteropChainIds } from './utils/getInteropChains'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getProtocolEntries } from './utils/getProtocolEntries'
import { getTokensData } from './utils/getTokensData'
import { getTopPath, type InteropTopPathData } from './utils/getTopPath'
import {
  getTopProtocols,
  type InteropProtocolData,
} from './utils/getTopProtocols'
import { scopeRecordsToToken } from './utils/scopeRecordsToToken'

const logger = getLogger().for('getInteropTokenData')

export type InteropTokenDashboardData = {
  token: TokenData | undefined
  flows: InteropFlowData[]
  topPath: InteropTopPathData | undefined
  topProtocol: InteropTokenTopProtocol | undefined
  topProtocols: InteropProtocolData[]
  entries: ProtocolEntry[]
  zeroTransferProtocols: { name: string; iconUrl: string }[]
  snapshotTimestamp: number | undefined
}

/** Volume is null when the token's price is unreliable. */
export type InteropTokenTopProtocol = Omit<InteropProtocolData, 'volume'> & {
  volume: InteropProtocolData['volume'] | null
}

/** Inputs the caller may already hold; anything missing is loaded here. */
export interface InteropTokenDataContext {
  snapshotTimestamp?: UnixTime
  interopProjects?: Project<'interopConfig'>[]
}

/**
 * Falls back to the newest promoted snapshot that has the token, so a token
 * missing from the latest aggregation still shows its last known data. Being
 * synced is a property of the token, not of a chain selection, so this always
 * looks at all active chains.
 */
export async function getLatestInteropTokenData(
  tokenId: string,
  context: InteropTokenDataContext,
): Promise<{
  tokenData: InteropTokenDashboardData | null
  /** Set when the latest snapshot lacks the token and an older one is shown. */
  lastSyncedAt: UnixTime | undefined
}> {
  const params = { tokenId, from: [], to: [] }
  const tokenData = await getInteropTokenData(params, context)
  if (tokenData || context.snapshotTimestamp === undefined) {
    return { tokenData, lastSyncedAt: undefined }
  }

  const activeChainIds = getActiveInteropChainIds()
  const lastSyncedAt =
    await getDb().aggregatedInteropToken.getLatestPromotedTimestampForToken(
      tokenId,
      {
        upTo: context.snapshotTimestamp,
        sourceChains: activeChainIds,
        destinationChains: activeChainIds,
      },
    )
  if (lastSyncedAt === undefined) {
    return { tokenData: null, lastSyncedAt }
  }

  return {
    tokenData: await getInteropTokenData(params, {
      ...context,
      snapshotTimestamp: lastSyncedAt,
    }),
    lastSyncedAt,
  }
}

export async function getInteropTokenData(
  params: InteropTokenParams,
  context: InteropTokenDataContext = {},
): Promise<InteropTokenDashboardData | null> {
  if (env.MOCK) {
    return getMockInteropTokenData(params)
  }

  const selection = getTokenDataSelection(params)
  const snapshotTimestamp =
    context.snapshotTimestamp ??
    (await getPromotedInteropSnapshotTimestamp(params.snapshotTimestamp))
  const [interopProjects, abstractToken, latest] = await Promise.all([
    context.interopProjects ?? ps.getProjects({ select: ['interopConfig'] }),
    findInteropAbstractToken(params.tokenId),
    getLatestAggregatedInteropTransferWithTokens({
      selection,
      snapshotTimestamp,
    }),
  ])
  const tokenRecords = scopeRecordsToToken(latest.records, params.tokenId)

  if (tokenRecords.length === 0) {
    return null
  }

  const abstractTokenIds = unique(
    tokenRecords.flatMap((record) =>
      record.tokens.map((token) => token.abstractTokenId),
    ),
  )
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)
  const tokenDataMap = buildTokensDataMap(tokenRecords)
  const [token] = getTokensData({
    tokens: tokenDataMap,
    tokensDetailsMap,
    interopProjects,
    unknownTransfersCount: 0,
    logger,
    durationSplit: undefined,
  })

  if (!token) {
    return null
  }

  const subgroupProjects = new Set(
    interopProjects.filter((p) => p.interopConfig.subgroupId).map((p) => p.id),
  )
  const flows = getFlows(tokenRecords, selection, subgroupProjects)
  const topProtocols = getTopProtocols(
    tokenRecords,
    interopProjects,
    subgroupProjects,
  )

  const data: InteropTokenDashboardData = {
    token,
    flows: flows.slice(0, TOKEN_DASHBOARD_TOP_FLOWS_LIMIT),
    topPath: getTopPath(flows),
    topProtocol: topProtocols.toSorted(
      (a, b) => b.volume.value - a.volume.value,
    )[0],
    topProtocols,
    snapshotTimestamp: latest.snapshotTimestamp,
    ...getProtocolEntries(
      tokenRecords,
      tokensDetailsMap,
      interopProjects,
      undefined,
      latest.snapshotTimestamp,
      selection,
    ),
  }
  return abstractToken?.isPriceUnreliable ? withoutUsdValues(data) : data
}

/**
 * Without a reliable price the token's volumes are zero, or stale when the
 * snapshot predates the flag, so the page gets none of them and protocols
 * are ranked by transfer count instead.
 */
function withoutUsdValues(
  data: InteropTokenDashboardData,
): InteropTokenDashboardData {
  const topProtocol = data.topProtocols.toSorted(
    (a, b) => b.transfers.value - a.transfers.value,
  )[0]
  return {
    ...data,
    token: data.token && { ...data.token, volume: null, avgValue: null },
    flows: [],
    topPath: undefined,
    topProtocol: topProtocol && { ...topProtocol, volume: null },
    entries: data.entries
      .map((entry) => ({
        ...entry,
        volume: 0,
        averageValue: null,
        minTransferValueUsd: undefined,
        maxTransferValueUsd: undefined,
        averageValueInFlight: undefined,
        netMintedValue: undefined,
      }))
      .sort((a, b) => b.transferCount - a.transferCount),
  }
}

function getTokenDataSelection(params: InteropTokenParams): InteropTokenParams {
  if (params.from.length > 0 && params.to.length > 0) {
    return params
  }

  const activeInteropChainIds = getActiveInteropChainIds()

  return {
    ...params,
    from: activeInteropChainIds,
    to: activeInteropChainIds,
  }
}

function getMockInteropTokenData({
  tokenId,
  from,
  to,
}: InteropTokenParams): InteropTokenDashboardData {
  const srcChain = from[0] ?? 'ethereum'
  const dstChain = to.find((chain) => chain !== srcChain) ?? 'optimism'
  const token: TokenData = {
    id: tokenId,
    symbol: tokenId.includes('usdc') ? 'USDC' : 'ETH',
    issuer: tokenId.includes('usdc') ? 'circle' : 'ethereum',
    iconUrl: TOKEN_PLACEHOLDER_ICON_URL,
    topProtocol: undefined,
    volume: 10_000_000,
    transferCount: 1000,
    avgDuration: getAverageDuration(
      {
        transfersWithDurationCount: 1000,
        totalDurationSum: 100_000_000,
        transferTypeStats: undefined,
      },
      undefined,
    ),
    avgValue: 10_000,
    minTransferValueUsd: 100,
    maxTransferValueUsd: 100_000,
    netMintedValue: undefined,
    flows: [],
  }

  return {
    token,
    flows: [{ srcChain, dstChain, volume: 10_000_000 }],
    topPath: { chainA: srcChain, chainB: dstChain, volume: 10_000_000 },
    topProtocol: undefined,
    topProtocols: [],
    entries: [],
    zeroTransferProtocols: [],
    snapshotTimestamp: UnixTime.toStartOf(UnixTime.now(), 'hour'),
  }
}
