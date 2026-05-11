import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getDb } from '~/server/database'
import { ChartRange } from '~/utils/range/range'
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
  const db = getDb()
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

  const projectIds = [project.id.toString()]

  const [dailyRows, bucketTotals, syncedUntil] = await Promise.all([
    db.privacyFlowEvent.getDailyByProjectIds(
      projectIds,
      UnixTime(0),
      UnixTime.now(),
    ),
    db.privacyFlowEvent.getBucketTotalsByProjectIds(projectIds),
    db.privacyFlowEvent.getLatestTimestampByProjectIds(projectIds),
  ])

  const priceIds = [
    ...new Set(project.privacyInfo.tokens.map((token) => token.token.priceId)),
  ]
  const priceRecords = await Promise.all(
    priceIds.map((priceId) => db.privacyPrice.getLatestPriceByPriceId(priceId)),
  )
  const priceById = new Map(
    priceRecords
      .filter((p) => p !== undefined)
      .map((p) => [p.priceId, p.priceUsd]),
  )

  const flowChart = buildPrivacyChart(
    [project],
    dailyRows,
    syncedUntil,
    priceById,
    params.range,
  )
  const tvlChart = buildPrivacyTvlChart(
    [project],
    dailyRows,
    bucketTotals,
    syncedUntil,
    priceById,
    params.range,
  )

  return {
    ...flowChart,
    tvlChart: tvlChart.chart,
    tvlSyncedUntil: tvlChart.syncedUntil,
  }
}
