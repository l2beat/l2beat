import type { InteropDashboardParams } from './types'
import { getTopPaths, type InteropPathData } from './utils/getTopPaths'
import {
  getTopProtocols,
  type InteropProtocolData,
} from './utils/getTopProtocols'
import { interopMockData } from './utils/mockData'

export type InteropDashboardData = {
  top3Paths: InteropPathData[]
  topProtocols: InteropProtocolData[]
}

export async function getInteropDashboardData(
  params: InteropDashboardParams,
): Promise<InteropDashboardData> {
  await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 1000)))
  const records = await Promise.resolve(interopMockData)

  return {
    top3Paths: getTopPaths(records, params.from, params.to),
    topProtocols: getTopProtocols(records, params.from, params.to),
  }
}
