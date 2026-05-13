import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getSummedTvsValues } from '../scaling/tvs/utils/getSummedTvsValues'
import { getPrivacyProjects } from './getPrivacyProjects'
import type { PrivacyFlowsChartPoint } from './utils/buildPrivacyFlowsChart'
import { buildPrivacyFlowsChart } from './utils/buildPrivacyFlowsChart'

export interface PrivacySummaryChartsResponse {
  flows: {
    chart: PrivacyFlowsChartPoint[]
    syncedUntil: number | undefined
  }
  tvs: {
    chart: [timestamp: number, totalValueSecuredUsd: number][]
    syncedUntil: number | undefined
  }
}

export async function getPrivacySummaryChart(params: {
  range: [UnixTime | null, UnixTime]
}): Promise<PrivacySummaryChartsResponse> {
  const db = getDb()
  const projects = await getPrivacyProjects()
  const projectIds = projects.map((p) => p.id)

  const [dailyRows, syncedUntil, tvsValues] = await Promise.all([
    db.privacyFlowEvent.getDailyByProjectIds(
      projects.map((p) => p.id.toString()),
      UnixTime(0),
      UnixTime.now(),
    ),
    db.privacyFlowEvent.getLatestTimestampByProjectIds(
      projects.map((p) => p.id.toString()),
    ),
    getSummedTvsValues(projectIds, params.range, {
      forSummary: true,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: false,
    }),
  ])

  const flows = buildPrivacyFlowsChart(
    projects.map((p) => p.id.toString()),
    dailyRows,
    syncedUntil,
    params.range,
  )

  return {
    flows,
    tvs: {
      chart: tvsValues.map((v) => [v.timestamp, v.value ?? 0]),
      syncedUntil: tvsValues.at(-1)?.timestamp,
    },
  }
}
