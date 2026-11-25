import type {
  Database,
  SummedByTimestampTokenValueRecord,
} from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getTimestampedValuesRange } from '../../utils/getTimestampedValuesRange'
import { rangeToResolution } from '../../utils/range'
import type { TokenExclusions, TvsRange, TvsResultItem } from './types'

export async function getTvsData(
  db: Database,
  range: TvsRange,
  projectIds: ProjectId[],
  exclusions: TokenExclusions,
): Promise<TvsResultItem[]> {
  const resolution = rangeToResolution(range)
  const [from, to] = getTimestampedValuesRange(range, resolution, {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })

  const forSummary = projectIds.length !== 1

  const records = await db.tvsTokenValue.getSummedByTimestampByProjects(
    projectIds,
    from,
    to,
    { forSummary, ...exclusions },
  )

  if (records.length === 0) {
    return []
  }

  const timestamps = records.map((r) => r.timestamp)
  const fromTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)
  const groupedByTimestamp = keyBy(records, (r) => r.timestamp)
  return generateTimestamps([fromTimestamp, maxTimestamp], resolution).flatMap(
    (timestamp: UnixTime) => {
      const record = groupedByTimestamp[timestamp]
      // A timestamp without a record is missing data, not a TVS of zero, so
      // it gets no point
      if (!record) {
        return []
      }
      return mapRecord(record)
    },
  )
}

function mapRecord({
  timestamp,
  value,
  canonical,
  customCanonical,
  external,
  native,
  ether,
  stablecoin,
  btc,
  rwaRestricted,
  rwaPublic,
  other,
}: SummedByTimestampTokenValueRecord): TvsResultItem {
  return {
    timestamp,
    totalTvs: value,
    bySource: {
      native,
      canonical: canonical + customCanonical,
      external,
    },
    byCategory: {
      stablecoins: stablecoin,
      eth: ether,
      btc,
      other,
      publicRwa: rwaPublic,
      restrictedRwa: rwaRestricted,
    },
  }
}
