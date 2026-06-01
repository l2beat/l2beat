import { UnixTime } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import { env } from '~/env'
import { ps } from '~/server/projects'
import type {
  AggregatedInteropTransferWithTokens,
  InteropProtocolParams,
  ProtocolEntry,
} from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getFlows, type InteropFlowData } from './utils/getFlows'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getProtocolEntries } from './utils/getProtocolEntries'
import { getTopPath, type InteropTopPathData } from './utils/getTopPath'
import { getTopToken, type InteropTopTokenData } from './utils/getTopToken'
import {
  getTransferSizeChartData,
  type TransferSizeDataPoint,
} from './utils/getTransferSizeChartData'

export type InteropProtocolDashboardData = {
  entry: ProtocolEntry | undefined
  flows: InteropFlowData[]
  topPath: InteropTopPathData | undefined
  transferSize: TransferSizeDataPoint | undefined
  topToken: InteropTopTokenData | undefined
}

export async function getInteropProtocolData(
  params: InteropProtocolParams,
): Promise<InteropProtocolDashboardData> {
  if (env.MOCK) {
    return getMockInteropProtocolData(params)
  }

  const interopProject = await ps.getProject({
    id: params.id,
    select: ['interopConfig'],
  })
  if (!interopProject) {
    return {
      topToken: undefined,
      entry: undefined,
      flows: [],
      topPath: undefined,
      transferSize: undefined,
    }
  }

  const { records, snapshotTimestamp } =
    await getLatestAggregatedInteropTransferWithTokens(params, undefined, [
      params.id,
    ])

  const abstractTokenIds = uniq(
    records.flatMap((r) => r.tokens.map((token) => token.abstractTokenId)),
  )
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)

  const entries = getProtocolEntries(
    records,
    tokensDetailsMap,
    [interopProject],
    undefined,
    snapshotTimestamp,
    params,
  )
  const [projectEntry] = entries.entries

  if (!projectEntry) {
    return {
      topToken: undefined,
      entry: undefined,
      flows: [],
      topPath: undefined,
      transferSize: undefined,
    }
  }

  const flows = getFlows(records, params)

  return {
    topToken: getTopToken({
      records,
      tokensDetailsMap,
      interopProjects: [interopProject],
    }),
    entry: projectEntry,
    flows,
    topPath: getTopPath(flows),
    transferSize: getTransferSizeChartData(records, [interopProject])?.[0],
  }
}

async function getMockInteropProtocolData(
  params: InteropProtocolParams,
): Promise<InteropProtocolDashboardData> {
  const interopProject = await ps.getProject({
    id: params.id,
    select: ['interopConfig'],
  })
  if (!interopProject) {
    return {
      topToken: undefined,
      entry: undefined,
      flows: [],
      topPath: undefined,
      transferSize: undefined,
    }
  }

  const srcChain = params.from[0] ?? 'ethereum'
  const dstChain = params.to.find((c) => c !== srcChain) ?? 'optimism'
  const snapshotTimestamp = UnixTime.now()

  const records: AggregatedInteropTransferWithTokens[] = [
    {
      id: interopProject.id,
      timestamp: snapshotTimestamp,
      bridgeType: 'lockAndMint',
      srcChain,
      dstChain,
      transferTypeStats: undefined,
      transferCount: 100,
      transfersWithDurationCount: 100,
      identifiedCount: 100,
      totalDurationSum: 6_000_000,
      srcValueUsd: 15_000_000,
      dstValueUsd: 15_000_000,
      minTransferValueUsd: 100,
      maxTransferValueUsd: 100_000,
      avgValueInFlight: undefined,
      mintedValueUsd: undefined,
      burnedValueUsd: undefined,
      countUnder100: 0,
      count100To1K: 0,
      count1KTo10K: 0,
      count10KTo100K: 0,
      countOver100K: 0,
      tokens: [],
    },
  ]

  const { entries } = getProtocolEntries(
    records,
    new Map(),
    [interopProject],
    undefined,
    snapshotTimestamp,
    params,
  )
  const flows = getFlows(records, params)

  return {
    entry: entries[0],
    flows,
    topPath: getTopPath(flows),
    transferSize: undefined,
    topToken: undefined,
  }
}
