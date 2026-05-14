import { ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import sortedUniq from 'lodash/sortedUniq'
import { ChartRange } from '~/utils/range/range'
import { getSummedTvsValues } from '../scaling/tvs/utils/getSummedTvsValues'

export const PrivacyTvsChartParams = v.object({
  projectIds: v.array(v.string()),
  range: ChartRange,
})

export type PrivacyTvsChartParams = v.infer<typeof PrivacyTvsChartParams>

export interface PrivacyTvsChartResponse {
  chart: [
    timestamp: number,
    valuesByProject: Record<string, number | null>,
  ][]
  syncedUntil: number | undefined
}

export async function getPrivacyTvsChart(
  params: PrivacyTvsChartParams,
): Promise<PrivacyTvsChartResponse> {
  if (params.projectIds.length === 0) {
    return { chart: [], syncedUntil: undefined }
  }

  const forSummary = params.projectIds.length !== 1

  const perProject = await Promise.all(
    params.projectIds.map(async (id) => {
      const values = await getSummedTvsValues([ProjectId(id)], params.range, {
        forSummary,
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: false,
      })
      return { id, values }
    }),
  )

  const timestamps = sortedUniq(
    perProject
      .flatMap((p) => p.values.map((v) => v.timestamp))
      .sort((a, b) => a - b),
  )

  const valuesByProjectByTimestamp = new Map<
    number,
    Record<string, number | null>
  >()
  for (const { id, values } of perProject) {
    for (const point of values) {
      const existing = valuesByProjectByTimestamp.get(point.timestamp) ?? {}
      existing[id] = point.value
      valuesByProjectByTimestamp.set(point.timestamp, existing)
    }
  }

  const chart: PrivacyTvsChartResponse['chart'] = timestamps.map(
    (timestamp) => {
      const valuesByProject = valuesByProjectByTimestamp.get(timestamp) ?? {}
      for (const { id } of perProject) {
        if (!(id in valuesByProject)) {
          valuesByProject[id] = null
        }
      }
      return [timestamp, valuesByProject]
    },
  )

  return {
    chart,
    syncedUntil: timestamps.at(-1),
  }
}
