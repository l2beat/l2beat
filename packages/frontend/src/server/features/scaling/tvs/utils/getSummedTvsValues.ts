import type {
  ProjectWithRanges,
  SummedByTimestampTvsValuesRecord,
} from '@l2beat/dal'
import type { ProjectId } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { queryExecutor } from '~/server/queryExecutor'
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
  projects: ProjectId[] | ProjectWithRanges[],
  range: ChartRange,
  {
    forSummary,
    excludeAssociatedTokens,
    includeRwaRestrictedTokens,
  }: {
    forSummary: boolean
    excludeAssociatedTokens: boolean
    includeRwaRestrictedTokens: boolean
  },
): Promise<SummedTvsValues[]> {
  const resolution = rangeToResolution(range)

  const records = await queryExecutor.execute({
    name: 'getSummedByTimestampTvsValuesQuery',
    args: [
      projects,
      range,
      forSummary,
      excludeAssociatedTokens,
      includeRwaRestrictedTokens,
    ],
  })

  const valueRecords = records.map(mapArrayToObject)

  if (valueRecords.length === 0) {
    return []
  }

  const timestamps = valueRecords.map((v) => v.timestamp)
  const fromTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)
  const groupedByTimestamp = keyBy(valueRecords, (v) => v.timestamp)

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
    return record
  })
}

function mapArrayToObject([
  timestamp,
  value,
  canonical,
  external,
  native,
  ether,
  stablecoin,
  btc,
  rwaRestricted,
  rwaPublic,
  other,
]: SummedByTimestampTvsValuesRecord) {
  return {
    timestamp,
    value,
    canonical,
    external,
    native,
    ether,
    stablecoin,
    btc,
    rwaRestricted,
    rwaPublic,
    other,
  }
}
