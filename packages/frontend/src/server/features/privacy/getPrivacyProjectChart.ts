import { v } from '@l2beat/validate'
import { ChartRange } from '~/utils/range/range'
import { getAllPrivacyBucketRows } from './db/PrivacyBucketRepo'
import {
  getAllPrivacyHistoryCursors,
  getAllPrivacyHistoryRows,
} from './db/PrivacyHistoryRepo'
import { getPrivacyProjects } from './getPrivacyProjects'
import {
  buildPrivacyChart,
  buildPrivacyTvlChart,
  type PrivacyChartPoint,
  type PrivacyChartResponse,
  type PrivacyTvlChartPoint,
} from './privacyChartUtils'

export const PrivacyProjectChartParams = v.object({
  projectId: v.string(),
  range: ChartRange,
})

export type PrivacyProjectChartParams = v.infer<
  typeof PrivacyProjectChartParams
>

export type PrivacyProjectChartPoint = PrivacyChartPoint
export interface PrivacyProjectChartResponse extends PrivacyChartResponse {
  tvlChart: PrivacyTvlChartPoint[]
  tvlSyncedUntil: number | undefined
}

export async function getPrivacyProjectChart(
  params: PrivacyProjectChartParams,
): Promise<PrivacyProjectChartResponse> {
  const projects = await getPrivacyProjects()
  const project = projects.find((project) => project.id === params.projectId)

  if (!project) {
    return {
      chart: [],
      syncedUntil: undefined,
      tvlChart: [],
      tvlSyncedUntil: undefined,
    }
  }

  const historyRows = getAllPrivacyHistoryRows()
  const cursors = getAllPrivacyHistoryCursors()
  const flowChart = buildPrivacyChart(
    [project],
    historyRows,
    cursors,
    params.range,
  )
  const tvlChart = buildPrivacyTvlChart(
    [project],
    historyRows,
    cursors,
    getAllPrivacyBucketRows(),
    params.range,
  )

  return {
    ...flowChart,
    tvlChart: tvlChart.chart,
    tvlSyncedUntil: tvlChart.syncedUntil,
  }
}
