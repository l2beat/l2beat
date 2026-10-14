import type { Project } from '@l2beat/config'
import { UnixTime, unique } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import { TOKEN_DASHBOARD_TOP_FLOWS_LIMIT } from './consts'
import type { InteropTokenParams, ProtocolEntry, TokenData } from './types'
import { buildTokensDataMap } from './utils/buildTokensDataMap'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getAverageDuration } from './utils/getAverageDuration'
import { getFlows, type InteropFlowData } from './utils/getFlows'
import { getInteropChains } from './utils/getInteropChains'
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
  topProtocol: InteropProtocolData | undefined
  topProtocols: InteropProtocolData[]
  entries: ProtocolEntry[]
  zeroTransferProtocols: { name: string; iconUrl: string }[]
  snapshotTimestamp: number | undefined
  /** False when the latest snapshot lacks the token and an older one is shown. */
  isSynced: boolean
}

/** Inputs the caller may already hold; anything missing is loaded here. */
export interface InteropTokenDataContext {
  snapshotTimestamp?: UnixTime
  interopProjects?: Project<'interopConfig'>[]
}

export async function getInteropTokenData(
  params: InteropTokenParams,
  context: InteropTokenDataContext = {},
): Promise<InteropTokenDashboardData | null> {
  if (env.MOCK) {
    return getMockInteropTokenData(params)
  }

  const interopProjects =
    context.interopProjects ??
    (await ps.getProjects({
      select: ['interopConfig'],
    }))
  const selection = getTokenDataSelection(params)

  const { tokenRecords, snapshotTimestamp, isSynced } = await getTokenRecords(
    params.tokenId,
    selection,
    context.snapshotTimestamp,
  )

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

  return {
    token,
    flows: flows.slice(0, TOKEN_DASHBOARD_TOP_FLOWS_LIMIT),
    topPath: getTopPath(flows),
    // Transfer count breaks ties because tokens without a reliable price have
    // zero volume everywhere.
    topProtocol: topProtocols.toSorted(
      (a, b) =>
        b.volume.value - a.volume.value ||
        b.transfers.value - a.transfers.value,
    )[0],
    topProtocols,
    snapshotTimestamp,
    isSynced,
    ...getProtocolEntries(
      tokenRecords,
      tokensDetailsMap,
      interopProjects,
      undefined,
      snapshotTimestamp,
      selection,
    ),
  }
}

/**
 * Falls back to the last snapshot that had the token's transfers, so a token
 * missing from the latest aggregation still shows its last known data.
 */
async function getTokenRecords(
  tokenId: string,
  selection: InteropTokenParams,
  snapshotTimestamp: UnixTime | undefined,
) {
  const latest = await getScopedTokenRecords(
    tokenId,
    selection,
    snapshotTimestamp,
  )
  if (
    latest.tokenRecords.length > 0 ||
    latest.snapshotTimestamp === undefined
  ) {
    return { ...latest, isSynced: true }
  }

  const lastSyncedTimestamp =
    await getDb().aggregatedInteropToken.getLatestPromotedTimestampForToken(
      tokenId,
      {
        upTo: latest.snapshotTimestamp,
        sourceChains: selection.from,
        destinationChains: selection.to,
      },
    )
  if (lastSyncedTimestamp === undefined) {
    return { ...latest, isSynced: false }
  }

  return {
    ...(await getScopedTokenRecords(tokenId, selection, lastSyncedTimestamp)),
    isSynced: false,
  }
}

async function getScopedTokenRecords(
  tokenId: string,
  selection: InteropTokenParams,
  snapshotTimestamp: UnixTime | undefined,
) {
  const { records, snapshotTimestamp: resolvedSnapshotTimestamp } =
    await getLatestAggregatedInteropTransferWithTokens({
      selection,
      snapshotTimestamp,
    })
  return {
    tokenRecords: scopeRecordsToToken(records, tokenId),
    snapshotTimestamp: resolvedSnapshotTimestamp,
  }
}

function getTokenDataSelection(params: InteropTokenParams): InteropTokenParams {
  if (params.from.length > 0 && params.to.length > 0) {
    return params
  }

  const activeInteropChainIds = getInteropChains()
    .filter((chain) => !chain.isUpcoming)
    .map((chain) => chain.id)

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
    isSynced: true,
  }
}
