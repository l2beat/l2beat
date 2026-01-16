import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import type { InteropDashboardParams } from './types'
import { getTopPaths, type InteropPathData } from './utils/getTopPaths'
import {
  getTopProtocols,
  type InteropProtocolData,
} from './utils/getTopProtocols'

export type InteropDashboardData = {
  top3Paths: InteropPathData[]
  topProtocols: InteropProtocolData[]
}

export async function getInteropDashboardData(
  params: InteropDashboardParams,
): Promise<InteropDashboardData> {
  const db = getDb()
  const records =
    await db.aggregatedInteropTransfer.getByChainsAndLatestTimestamp(
      params.from,
      params.to,
    )
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  return {
    top3Paths: getTopPaths(records, params.from, params.to),
    topProtocols: getTopProtocols(
      records,
      params.from,
      params.to,
      interopProjects,
    ),
  }
}
