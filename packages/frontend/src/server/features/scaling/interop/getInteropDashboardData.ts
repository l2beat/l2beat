import type { InteropDashboardParams } from './types'
import { getTopPaths, type InteropPathData } from './utils/getTopPaths'
import { interopMockData } from './utils/mockData'

export type InteropDashboardData = {
  top3Paths: InteropPathData[]
}

export async function getInteropDashboardData(
  params: InteropDashboardParams,
): Promise<InteropDashboardData> {
  await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 1000)))
  const records = await Promise.resolve(interopMockData)

  return {
    top3Paths: getTopPaths(records, params.from, params.to),
  }
}
