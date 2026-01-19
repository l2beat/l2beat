import { getDb } from '~/server/database'
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

export type InteropDashboardData = {
  top3Paths: InteropPathData[]
  topProtocols: InteropProtocolData[]
  protocolsByType: ProtocolsByType
}

export async function getInteropDashboardData(
  params: InteropDashboardParams,
): Promise<InteropDashboardData> {
  const tokenDb = getTokenDb()
  const db = getDb()
  const records =
    await db.aggregatedInteropTransfer.getByChainsAndLatestTimestamp(
      params.from,
      params.to,
    )

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const tokensDetailsData = await tokenDb.abstractToken.getByIds(
    records.flatMap((r) => Object.keys(r.tokensByVolume)),
  )
  const tokensDetailsDataMap = new Map<
    string,
    { symbol: string; iconUrl: string | null }
  >(tokensDetailsData.map((t) => [t.id, t]))

  return {
    top3Paths: getTopPaths(records),
    topProtocols: getTopProtocols(records, interopProjects),
    protocolsByType: getProtocolsByType(
      records,
      tokensDetailsDataMap,
      interopProjects,
    ),
  }
}
