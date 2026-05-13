import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getDb } from '~/server/database'
import { ChartRange } from '~/utils/range/range'
import { getSummedTvsValues } from '../scaling/tvs/utils/getSummedTvsValues'
import { getPrivacyProjects } from './getPrivacyProjects'
import type { PrivacyFlowsChartPoint } from './utils/buildPrivacyFlowsChart'
import { buildPrivacyFlowsChart } from './utils/buildPrivacyFlowsChart'

export const PrivacyProjectChartParams = v.object({
  projectId: v.string(),
  range: ChartRange,
})

export type PrivacyProjectChartParams = v.infer<
  typeof PrivacyProjectChartParams
>

export interface PrivacyProjectChartResponse {
  chart: PrivacyFlowsChartPoint[]
  syncedUntil: number | undefined
  tvsChart: [timestamp: number, totalValueSecuredUsd: number][]
  tvsSyncedUntil: number | undefined
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
      tvsChart: [],
      tvsSyncedUntil: undefined,
    }
  }

  const projectIds = [project.id]

  const [dailyRows, syncedUntil, tvsValues] = await Promise.all([
    db.privacyFlowEvent.getDailyByProjectIds(
      [project.id.toString()],
      UnixTime(0),
      UnixTime.now(),
    ),
    db.privacyFlowEvent.getLatestTimestampByProjectIds([project.id.toString()]),
    getSummedTvsValues(projectIds, params.range, {
      forSummary: false,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: false,
    }),
  ])

  const flowsChart = buildPrivacyFlowsChart(
    [project.id.toString()],
    dailyRows,
    syncedUntil,
    params.range,
  )

  return {
    ...flowsChart,
    tvsChart: tvsValues.map((v) => [v.timestamp, v.value ?? 0]),
    tvsSyncedUntil: tvsValues.at(-1)?.timestamp,
  }
}
