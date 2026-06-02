import type { ProjectId } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getChartStartTimestamp } from '~/server/features/utils/getChartStartTimestamp'
import { type ChartRange, rangeToResolution } from '~/utils/range/range'
import { isTvsSynced } from './isTvsSynced'

export type SummedTvsValues = {
  timestamp: number
  value: number | null
  canonical: number | null
  external: number | null
  native: number | null
  ether: number | null
  stablecoin: number | null
  btc: number | null
  other: number | null
  rwaRestricted: number | null
  rwaPublic: number | null
}

export async function getSummedTvsValues(
  projects: ProjectId[],
  range: ChartRange,
  {
    forSummary,
    excludeAssociatedTokens,
    excludeRwaRestrictedTokens,
  }: {
    forSummary: boolean
    excludeAssociatedTokens: boolean
    excludeRwaRestrictedTokens: boolean
  },
): Promise<SummedTvsValues[]> {
  const db = getDb()
  const resolution = rangeToResolution(range)

  // A single project anchors its chart to the selected window start (clamped to
  // its first ever record). Summaries keep starting at the first day with data.
  const isSingleProject = !forSummary && projects.length === 1

  const [records, firstTimestamp] = await Promise.all([
    db.tvsTokenValue.getSummedByTimestampByProjects(
      projects,
      range[0],
      range[1],
      {
        forSummary,
        excludeAssociatedTokens,
        excludeRwaRestrictedTokens,
      },
    ),
    isSingleProject
      ? db.tvsTokenValue.getFirstTimestampByProjects(projects)
      : undefined,
  ])

  if (records.length === 0) {
    return []
  }

  const timestamps = records.map((v) => v.timestamp)
  const fromTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)
  const groupedByTimestamp = keyBy(records, (v) => v.timestamp)

  const adjustedTo = isTvsSynced(maxTimestamp) ? maxTimestamp : range[1]

  const startTimestamp = isSingleProject
    ? getChartStartTimestamp({
        rangeStart: range[0],
        firstProjectTimestamp: firstTimestamp,
        dataStart: fromTimestamp,
        resolution,
      })
    : fromTimestamp

  return generateTimestamps([startTimestamp, adjustedTo], resolution, {
    addTarget: true,
  }).flatMap((timestamp) => {
    const record = groupedByTimestamp[timestamp]

    if (!record) {
      return {
        timestamp,
        value: null,
        canonical: null,
        external: null,
        native: null,
        ether: null,
        stablecoin: null,
        other: null,
        btc: null,
        rwaRestricted: null,
        rwaPublic: null,
      }
    }

    const { canonical, customCanonical, ...rest } = record
    return {
      ...rest,
      canonical: canonical + customCanonical,
    }
  })
}
