import { ps } from '~/server/projects'
import { getTokenDb } from '~/server/tokenDb'
import type { InteropDashboardParams } from './types'
import {
  getProtocolsByType,
  type ProtocolsByType,
} from './utils/getProtocolsByType'
import { getTopPaths, type InteropPathData } from './utils/getTopPaths'
import {
  getTopProtocols,
  type InteropProtocolData,
} from './utils/getTopProtocols'
import { interopMockData } from './utils/mockData'

export type InteropDashboardData = {
  top3Paths: InteropPathData[]
  topProtocols: InteropProtocolData[]
  protocolsByType: ProtocolsByType
}

export async function getInteropDashboardData(
  params: InteropDashboardParams,
): Promise<InteropDashboardData> {
  const tokenDb = getTokenDb()
  await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 1000)))
  const records = await Promise.resolve(interopMockData)
  const filteredRecords = records.filter(
    (r) => params.from.includes(r.srcChain) && params.to.includes(r.dstChain),
  )
  // TODO: all above should be replaced with database query

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const tokensDetailsData = await tokenDb.abstractToken.getByIds(
    filteredRecords.flatMap((r) => Object.keys(r.tokensByVolume)),
  )
  const tokensDetailsDataMap = new Map<
    string,
    { symbol: string; iconUrl: string | null }
  >(tokensDetailsData.map((t) => [t.id, t]))

  return {
    top3Paths: getTopPaths(filteredRecords),
    topProtocols: getTopProtocols(filteredRecords, interopProjects),
    protocolsByType: getProtocolsByType(
      filteredRecords,
      tokensDetailsDataMap,
      interopProjects,
    ),
  }
}
