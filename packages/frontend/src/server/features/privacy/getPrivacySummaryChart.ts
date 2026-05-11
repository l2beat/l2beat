import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getPrivacyProjects } from './getPrivacyProjects'
import {
  buildPrivacyChart,
  buildPrivacyTvlChart,
  type PrivacyChartResponse,
  type PrivacyTvlChartPoint,
} from './privacyChartUtils'

export interface PrivacySummaryChartResponse extends PrivacyChartResponse {
  tvlChart: PrivacyTvlChartPoint[]
  tvlSyncedUntil: number | undefined
}

export async function getPrivacySummaryChart(params: {
  range: [UnixTime | null, UnixTime]
}): Promise<PrivacySummaryChartResponse> {
  const db = getDb()
  const projects = await getPrivacyProjects()
  const projectIds = projects.map((p) => p.id.toString())

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
    ...new Set(
      projects.flatMap((project) =>
        project.privacyInfo.tokens.map((token) => token.token.priceId),
      ),
    ),
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
    projects,
    dailyRows,
    syncedUntil,
    priceById,
    params.range,
  )
  const tvlChart = buildPrivacyTvlChart(
    projects,
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
