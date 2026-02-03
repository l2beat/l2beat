import { ps } from '~/server/projects'
import { getTokenDb } from '~/server/tokenDb'
import type { InteropSubpageParams } from './types'
import {
  type AllProtocolsEntry,
  getAllProtocolEntries,
} from './utils/getAllProtocolEntries'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getTopPaths, type InteropPathData } from './utils/getTopPaths'
import {
  getTopProtocols,
  type InteropProtocolData,
} from './utils/getTopProtocols'

type InteropSubpageData = {
  top3Paths: InteropPathData[]
  topProtocols: InteropProtocolData[]
  allProtocolsEntries: AllProtocolsEntry[]
}

export async function getInteropSubpageData(
  params: InteropSubpageParams,
): Promise<InteropSubpageData> {
  const tokenDb = getTokenDb()
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const records = await getLatestAggregatedInteropTransferWithTokens(
    params.from,
    params.to,
    params.type,
  )

  const tokensDetailsData = await tokenDb.abstractToken.getByIds(
    records.flatMap((r) => r.tokens.map((token) => token.abstractTokenId)),
  )
  const tokensDetailsDataMap = new Map<
    string,
    { symbol: string; iconUrl: string | null }
  >(tokensDetailsData.map((t) => [t.id, t]))

  // Projects that are part of other projects
  const subgroupProjects = new Set(
    interopProjects.filter((p) => p.interopConfig.subgroupId).map((p) => p.id),
  )

  return {
    top3Paths: getTopPaths(records, subgroupProjects),
    topProtocols: getTopProtocols(records, interopProjects, subgroupProjects),
    allProtocolsEntries: getAllProtocolEntries(
      records,
      tokensDetailsDataMap,
      interopProjects,
    ),
  }
}
