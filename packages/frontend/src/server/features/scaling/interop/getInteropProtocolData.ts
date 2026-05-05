import uniq from 'lodash/uniq'
import { ps } from '~/server/projects'
import type { InteropProtocolParams, ProtocolEntry } from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getFlows, type InteropFlowData } from './utils/getFlows'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getProtocolEntries } from './utils/getProtocolEntries'
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

export type InteropTopPathData = {
  chainA: string
  chainB: string
  volume: number
}

export async function getInteropProtocolData(
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

function getTopPath(
  flows: InteropFlowData[] | undefined,
): InteropTopPathData | undefined {
  const paths = new Map<string, InteropTopPathData>()

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
