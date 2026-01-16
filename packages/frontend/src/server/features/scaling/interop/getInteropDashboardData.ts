import { ps } from '~/server/projects'
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
  await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 1000)))
  const records = await Promise.resolve(interopMockData)
  const filteredRecords = records.filter(
    (r) => params.from.includes(r.srcChain) || params.to.includes(r.dstChain),
  )
  // TODO: all above should be replaced with database query

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  return {
    top3Paths: getTopPaths(filteredRecords, params.from, params.to),
    topProtocols: getTopProtocols(
      filteredRecords,
      params.from,
      params.to,
      interopProjects,
    ),
    protocolsByType: getProtocolsByType(filteredRecords, interopProjects),
  }
}
