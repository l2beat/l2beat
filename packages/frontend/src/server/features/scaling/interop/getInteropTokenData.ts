import { unique } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { getTokenDb } from '~/server/tokenDb'
import { getLogger } from '~/server/utils/logger'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type {
  AggregatedInteropTransferWithTokens,
  InteropTokenParams,
  ProtocolEntry,
  TokenData,
} from './types'
import { buildTokensDataMap } from './utils/buildTokensDataMap'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getAverageDuration } from './utils/getAverageDuration'
import { getFlows, type InteropFlowData } from './utils/getFlows'
import { getInteropChains } from './utils/getInteropChains'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getProtocolEntries } from './utils/getProtocolEntries'
import { getTokensData } from './utils/getTokensData'
import {
  getTopProtocols,
  type InteropProtocolData,
} from './utils/getTopProtocols'

const logger = getLogger().for('getInteropTokenData')

export type InteropTokenDashboardData = {
  token: TokenData | undefined
  flows: InteropFlowData[]
  topPath: InteropTokenTopPathData | undefined
  topProtocol: InteropProtocolData | undefined
  topProtocols: InteropProtocolData[]
  entries: ProtocolEntry[]
  zeroTransferProtocols: { name: string; iconUrl: string }[]
  deployments: InteropTokenDeploymentData[]
  snapshotTimestamp: number | undefined
}

export type InteropTokenTopPathData = {
  chainA: string
  chainB: string
  volume: number
}

export type InteropTokenDeploymentData = {
  chain: string
  symbol: string
  address: string
  volume: number
  transferCount: number
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
  const deployedTokensPromise = getTokenDb().deployedToken.getByAbstractTokenId(
    params.tokenId,
  )
  const selection = getTokenDataSelection(params)

  const [{ records, snapshotTimestamp }, deployedTokens] = await Promise.all([
    getLatestAggregatedInteropTransferWithTokens(selection),
    deployedTokensPromise,
  ])
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
    flows: flows.slice(0, 2),
    topPath: getTopPath(flows),
    topProtocol: topProtocols.toSorted(
      (a, b) => b.volume.value - a.volume.value,
    )[0],
    topProtocols,
    deployments: getDeployments(deployedTokens, tokenRecords),
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

function getDeployments(
  deployedTokens: { chain: string; symbol: string; address: string }[],
  tokenRecords: AggregatedInteropTransferWithTokens[],
): InteropTokenDeploymentData[] {
  const statsByChain = new Map<
    string,
    { volume: number; transferCount: number }
  >()

  for (const record of tokenRecords) {
    for (const chain of [record.srcChain, record.dstChain]) {
      const current = statsByChain.get(chain) ?? { volume: 0, transferCount: 0 }
      statsByChain.set(chain, {
        volume:
          current.volume + (record.srcValueUsd ?? record.dstValueUsd ?? 0),
        transferCount: current.transferCount + record.transferCount,
      })
    }
  }

  return deployedTokens
    .map((token) => ({
      chain: token.chain,
      symbol: token.symbol,
      address: token.address,
      volume: statsByChain.get(token.chain)?.volume ?? 0,
      transferCount: statsByChain.get(token.chain)?.transferCount ?? 0,
    }))
    .toSorted(
      (a, b) => b.volume - a.volume || b.transferCount - a.transferCount,
    )
}

function scopeRecordsToToken(
  records: AggregatedInteropTransferWithTokens[],
  tokenId: string,
): AggregatedInteropTransferWithTokens[] {
  return records
    .map((record) => {
      const tokens = record.tokens.filter(
        (token) => token.abstractTokenId === tokenId,
      )
      const volume = tokens.reduce((sum, token) => sum + (token.volume ?? 0), 0)
      const transferCount = tokens.reduce(
        (sum, token) => sum + (token.transferCount ?? 0),
        0,
      )
      const transfersWithDurationCount = tokens.reduce(
        (sum, token) => sum + (token.transfersWithDurationCount ?? 0),
        0,
      )
      const totalDurationSum = tokens.reduce(
        (sum, token) => sum + (token.totalDurationSum ?? 0),
        0,
      )

      if (tokens.length === 0 || transferCount === 0) return undefined

      return {
        ...record,
        tokens,
        srcValueUsd: volume,
        dstValueUsd: volume,
        transferCount,
        identifiedCount: transferCount,
        transfersWithDurationCount,
        totalDurationSum,
        transferTypeStats: tokens[0]?.transferTypeStats,
        minTransferValueUsd: minDefined(
          tokens.map((t) => t.minTransferValueUsd),
        ),
        maxTransferValueUsd: maxDefined(
          tokens.map((t) => t.maxTransferValueUsd),
        ),
        mintedValueUsd: sumDefined(tokens.map((t) => t.mintedValueUsd)),
        burnedValueUsd: sumDefined(tokens.map((t) => t.burnedValueUsd)),
      }
    })
    .filter((record) => record !== undefined)
}

function getTopPath(
  flows: InteropFlowData[] | undefined,
): InteropTokenTopPathData | undefined {
  const paths = new Map<string, InteropTokenTopPathData>()

  for (const flow of flows ?? []) {
    if (flow.volume === 0) continue

    const [firstChain, secondChain] = [flow.srcChain, flow.dstChain].toSorted()
    const key = `${firstChain}-${secondChain}`
    const current = paths.get(key)

    paths.set(key, {
      chainA: current?.chainA ?? flow.srcChain,
      chainB: current?.chainB ?? flow.dstChain,
      volume: (current?.volume ?? 0) + flow.volume,
    })
  }

  return Array.from(paths.values()).toSorted((a, b) => b.volume - a.volume)[0]
}

function minDefined(values: (number | undefined)[]): number | undefined {
  const defined = values.filter((value) => value !== undefined)
  return defined.length > 0 ? Math.min(...defined) : undefined
}

function maxDefined(values: (number | undefined)[]): number | undefined {
  const defined = values.filter((value) => value !== undefined)
  return defined.length > 0 ? Math.max(...defined) : undefined
}

function sumDefined(values: (number | undefined)[]): number | undefined {
  const defined = values.filter((value) => value !== undefined)
  return defined.length > 0
    ? defined.reduce((sum, value) => sum + value, 0)
    : undefined
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
    deployments: [
      {
        chain: srcChain,
        symbol: token.symbol,
        address: '0x0000000000000000000000000000000000000000',
        volume: 10_000_000,
        transferCount: 1000,
      },
      {
        chain: dstChain,
        symbol: token.symbol,
        address: '0x0000000000000000000000000000000000000001',
        volume: 10_000_000,
        transferCount: 1000,
      },
    ],
    snapshotTimestamp: 0,
  }
}
