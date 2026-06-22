import { unique } from '@l2beat/shared-pure'
import { env } from '~/env'
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
}

export async function getInteropTokenData(
  params: InteropTokenParams,
): Promise<InteropTokenDashboardData | null> {
  if (env.MOCK) {
    return getMockInteropTokenData(params)
  }

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })
  const selection = getTokenDataSelection(params)

  const { records, snapshotTimestamp } =
    await getLatestAggregatedInteropTransferWithTokens({ selection })
  const tokenRecords = scopeRecordsToToken(records, params.tokenId)

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
    topProtocol: topProtocols.toSorted(
      (a, b) => b.volume.value - a.volume.value,
    )[0],
    topProtocols,
    snapshotTimestamp,
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
        volume: 10_000_000,
        transferCount: 1000,
        transfersWithDurationCount: 1000,
        totalDurationSum: 100_000_000,
        transferTypeStats: undefined,
        minTransferValueUsd: 100,
        maxTransferValueUsd: 100_000,
        mintedValueUsd: undefined,
        burnedValueUsd: undefined,
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
    snapshotTimestamp: 0,
  }
}
