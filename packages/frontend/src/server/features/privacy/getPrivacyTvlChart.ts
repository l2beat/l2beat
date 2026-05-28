import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { ChartRange, rangeToResolution } from '~/utils/range/range'

export const PrivacyTvlChartParams = v.object({
  projectIds: v.array(v.string()),
  range: ChartRange,
})

export type PrivacyTvlChartParams = v.infer<typeof PrivacyTvlChartParams>

export interface PrivacyTvlChartResponse {
  chart: [timestamp: number, valuesByProject: Record<string, number | null>][]
  syncedUntil: number | undefined
}

export async function getPrivacyTvlChart(
  params: PrivacyTvlChartParams,
): Promise<PrivacyTvlChartResponse> {
  if (params.projectIds.length === 0) {
    return { chart: [], syncedUntil: undefined }
  }

  const db = getDb()
  const forSummary = params.projectIds.length !== 1

  const records = await db.tvsTokenValue.getSummedByProjectForRanges(
    params.projectIds,
    [params.range],
    {
      forSummary,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: false,
    },
  )

  if (records.length === 0) {
    return { chart: [], syncedUntil: undefined }
  }

  const valuesByProject = new Map<string, Map<number, number>>()
  let minTimestamp = Number.POSITIVE_INFINITY
  let maxTimestamp = Number.NEGATIVE_INFINITY

  for (const record of records) {
    minTimestamp = Math.min(minTimestamp, record.timestamp)
    maxTimestamp = Math.max(maxTimestamp, record.timestamp)

    let projectMap = valuesByProject.get(record.project)
    if (!projectMap) {
      projectMap = new Map()
      valuesByProject.set(record.project, projectMap)
    }
    projectMap.set(record.timestamp, record.value)
  }

  const resolution = rangeToResolution(params.range)
  const timestamps = generateTimestamps(
    [UnixTime(minTimestamp), UnixTime(maxTimestamp)],
    resolution,
    { addTarget: true },
  )

  const chart: PrivacyTvlChartResponse['chart'] = timestamps.map(
    (timestamp) => {
      const valuesByProjectAtTimestamp: Record<string, number | null> = {}
      for (const projectId of params.projectIds) {
        valuesByProjectAtTimestamp[projectId] =
          valuesByProject.get(projectId)?.get(timestamp) ?? null
      }
      return [timestamp, valuesByProjectAtTimestamp]
    },
  )

  return {
    chart,
    syncedUntil: maxTimestamp,
  }
}
