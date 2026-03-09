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
  transferSize: TransferSizeDataPoint | undefined
  topToken: InteropTopTokenData | undefined
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
      transferSize: undefined,
    }
  }

  const { records, snapshotTimestamp } =
    await getLatestAggregatedInteropTransferWithTokens(
      params,
      undefined,
      params.id,
    )

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
      transferSize: undefined,
    }
  }

  return {
    topToken: getTopToken({
      records,
      tokensDetailsMap,
      interopProjects: [interopProject],
    }),
    entry: projectEntry,
    flows: getFlows(records, params),
    transferSize: getTransferSizeChartData(records, [interopProject])?.[0],
  }
}
