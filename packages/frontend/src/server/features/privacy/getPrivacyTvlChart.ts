import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getChartStartTimestamp } from '~/server/features/utils/getChartStartTimestamp'
import { ChartRange, rangeToResolution } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

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

  if (env.MOCK) {
    return getMockPrivacyTvlChart(params)
  }

  const db = getDb()
  const forSummary = params.projectIds.length !== 1

  const [records, firstTimestamp] = await Promise.all([
    db.tvsTokenValue.getSummedByProjectForRanges(
      params.projectIds,
      [params.range],
      {
        forSummary,
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: false,
      },
    ),
    db.tvsTokenValue.getFirstTimestampByProjects(params.projectIds),
  ])

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

  const startTimestamp = getChartStartTimestamp({
    rangeStart: params.range[0],
    firstProjectTimestamp: firstTimestamp,
    dataStart: minTimestamp,
    resolution,
  })

  const timestamps = generateTimestamps(
    [startTimestamp, maxTimestamp],
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

function getMockPrivacyTvlChart(
  params: PrivacyTvlChartParams,
): PrivacyTvlChartResponse {
  const days = rangeToDays(params.range) ?? 365
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = params.range[0] ?? to - days * UnixTime.DAY
  const resolution = rangeToResolution(params.range)

  const baseValueByProject = new Map(
    params.projectIds.map((projectId) => [
      projectId,
      Math.random() * 100_000_000 + 1_000_000,
    ]),
  )

  const chart = generateTimestamps(
    [UnixTime(from), UnixTime(to)],
    resolution,
  ).map((timestamp): PrivacyTvlChartResponse['chart'][number] => {
    const valuesByProject: Record<string, number | null> = {}
    for (const projectId of params.projectIds) {
      const base = baseValueByProject.get(projectId) ?? 0
      valuesByProject[projectId] = base * (0.8 + Math.random() * 0.4)
    }
    return [timestamp, valuesByProject]
  })

  return { chart, syncedUntil: to }
}
