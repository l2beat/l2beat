import { ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { ChartRange } from '~/utils/range/range'
import { getSummedTvsValues } from '../scaling/tvs/utils/getSummedTvsValues'

export const PrivacyTvsChartParams = v.object({
  projectIds: v.array(v.string()),
  range: ChartRange,
})

export type PrivacyTvsChartParams = v.infer<typeof PrivacyTvsChartParams>

export interface PrivacyTvsChartResponse {
  chart: [timestamp: number, totalValueSecuredUsd: number][]
  syncedUntil: number | undefined
}

export async function getPrivacyTvsChart(
  params: PrivacyTvsChartParams,
): Promise<PrivacyTvsChartResponse> {
  if (params.projectIds.length === 0) {
    return { chart: [], syncedUntil: undefined }
  }

  const forSummary = params.projectIds.length !== 1

  const tvsValues = await getSummedTvsValues(
    params.projectIds.map((id) => ProjectId(id)),
    params.range,
    {
      forSummary,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: false,
    },
  )

  return {
    chart: tvsValues.map((v) => [v.timestamp, v.value ?? 0]),
    syncedUntil: tvsValues.at(-1)?.timestamp,
  }
}
