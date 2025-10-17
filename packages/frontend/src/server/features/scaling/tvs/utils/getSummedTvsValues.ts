import type { SummedByTimestampTvsValuesRecord } from '@l2beat/dal'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { queryExecutor } from '~/server/queryExecutor'
import { getTimestampedValuesRange } from '~/utils/range/range'
import { isTvsSynced } from './isTvsSynced'
import type { TvsChartRange } from './range'
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
  projectIds: ProjectId[],
  range: { type: TvsChartRange } | { type: 'custom'; from: number; to: number },
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
  const db = getDb()
  const resolution = rangeToResolution(range)

  const [from, to] = getTimestampedValuesRange(range, resolution, {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })

  const valueRecords = env.REDIS_URL
    ? (
        await queryExecutor.execute({
          name: 'getSummedByTimestampTvsValuesQuery',
          args: [
            projectIds,
            [from, to],
            forSummary,
            excludeAssociatedTokens,
            includeRwaRestrictedTokens,
          ],
        })
      ).map(mapArrayToObject)
    : await db.tvsProjectValue.getSummedByTimestamp(
        projectIds,
        getType(forSummary, excludeAssociatedTokens),
        [from, to],
      )

  if (valueRecords.length === 0) {
    return []
  }

  const timestamps = valueRecords.map((v) => v.timestamp)
  const fromTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)
  const groupedByTimestamp = keyBy(valueRecords, (v) => v.timestamp)

  const adjustedTo = isTvsSynced(maxTimestamp) ? maxTimestamp : to

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

function getType(forSummary: boolean, excludeAssociatedTokens: boolean) {
  if (!forSummary) {
    return excludeAssociatedTokens ? 'PROJECT_WA' : 'PROJECT'
  }
  return excludeAssociatedTokens ? 'SUMMARY_WA' : 'SUMMARY'
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
