import { v } from '@l2beat/validate'
import { getDb } from '~/server/database'
import { ChartRange } from '~/utils/range/range'
import type { PrivacyFlowsChartPoint } from './utils/buildPrivacyFlowsChart'
import { buildPrivacyFlowsChart } from './utils/buildPrivacyFlowsChart'

export const PrivacyFlowsChartParams = v.object({
  projectIds: v.array(v.string()),
  range: ChartRange,
})

export type PrivacyFlowsChartParams = v.infer<typeof PrivacyFlowsChartParams>

export interface PrivacyFlowsChartResponse {
  chart: PrivacyFlowsChartPoint[]
  syncedUntil: number | undefined
}

export async function getPrivacyFlowsChart(
  params: PrivacyFlowsChartParams,
): Promise<PrivacyFlowsChartResponse> {
  if (params.projectIds.length === 0) {
    return { chart: [], syncedUntil: undefined }
  }

  const db = getDb()

  const [dailyRows, syncedUntil] = await Promise.all([
    db.privacyFlowEvent.getDailyByProjectIds(
      params.projectIds,
      ...params.range,
    ),
    db.privacyFlowEvent.getLatestTimestampByProjectIds(params.projectIds),
  ])

  return buildPrivacyFlowsChart(
    params.projectIds,
    dailyRows,
    syncedUntil,
    params.range,
  )
}
