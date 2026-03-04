import uniq from 'lodash/uniq'
import { ps } from '~/server/projects'
import type { InteropProtocolParams, ProtocolEntry } from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getProtocolEntries } from './utils/getProtocolEntries'
import { getTopToken, type InteropTopTokenData } from './utils/getTopToken'
import {
  getTransferSizeChartData,
  type TransferSizeDataPoint,
} from './utils/getTransferSizeChartData'

export type InteropProtocolDashboardData = {
  entry: ProtocolEntry | undefined
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
      transferSize: undefined,
    }
  }

  const records = await getLatestAggregatedInteropTransferWithTokens(
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
  )
  const [projectEntry] = entries.entries

  if (!projectEntry) {
    return {
      topToken: undefined,
      entry: undefined,
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
    transferSize: getTransferSizeChartData(records, [interopProject])?.[0],
  }
}
