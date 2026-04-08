import type { ProjectId } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import type { ChartRange } from '~/utils/range/range'
import { isTvsSynced } from './isTvsSynced'
import { rangeToResolution } from './range'

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

  const records = await db.tvsTokenValue.getSummedByTimestampByProjects(
    projects,
    range[0],
    range[1],
    {
      forSummary,
      excludeAssociatedTokens,
      excludeRwaRestrictedTokens,
    },
  )

  if (records.length === 0) {
    return []
  }

  const timestamps = records.map((v) => v.timestamp)
  const fromTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)
  const groupedByTimestamp = keyBy(records, (v) => v.timestamp)

  const adjustedTo = isTvsSynced(maxTimestamp) ? maxTimestamp : range[1]

  return generateTimestamps([fromTimestamp, adjustedTo], resolution, {
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
