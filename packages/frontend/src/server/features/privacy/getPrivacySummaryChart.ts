import { getAllPrivacyBucketRows } from './db/PrivacyBucketRepo'
import {
  getAllPrivacyHistoryCursors,
  getAllPrivacyHistoryRows,
} from './db/PrivacyHistoryRepo'
import { getPrivacyProjects } from './getPrivacyProjects'
import {
  buildPrivacyChart,
  buildPrivacyTvlChart,
  type PrivacyChartParams,
  type PrivacyChartResponse,
  type PrivacyTvlChartPoint,
} from './privacyChartUtils'

export interface PrivacySummaryChartResponse extends PrivacyChartResponse {
  tvlChart: PrivacyTvlChartPoint[]
  tvlSyncedUntil: number | undefined
}

export async function getPrivacySummaryChart(
  params: PrivacyChartParams,
): Promise<PrivacySummaryChartResponse> {
  const projects = await getPrivacyProjects()
  const historyRows = getAllPrivacyHistoryRows()
  const cursors = getAllPrivacyHistoryCursors()
  const flowChart = buildPrivacyChart(
    projects,
    historyRows,
    cursors,
    params.range,
  )
  const tvlChart = buildPrivacyTvlChart(
    projects,
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
