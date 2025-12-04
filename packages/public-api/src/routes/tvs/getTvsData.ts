import type {
  QueryExecutor,
  SummedByTimestampTvsValuesRecord,
} from '@l2beat/dal'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getTimestampedValuesRange } from '../../utils/getTimestampedValuesRange'
import { rangeToResolution } from '../../utils/range'
import type { TvsRange, TvsResultItem } from './types'

export async function getTvsData(
  queryExecutor: QueryExecutor,
  range: TvsRange,
  projectIds: ProjectId[],
): Promise<TvsResultItem[]> {
  const resolution = rangeToResolution(range)
  const [from, to] = getTimestampedValuesRange(range, resolution, {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })

  const forSummary = projectIds.length !== 1

  const records = await queryExecutor.execute({
    name: 'getSummedByTimestampTvsValuesQuery',
    args: [projectIds, [from, to], forSummary, false, true],
  })

  if (records.length === 0) {
    return []
  }

  const timestamps = records.map(([timestamp]) => timestamp)
  const fromTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)
  const groupedByTimestamp = keyBy(records, ([timestamp]) => timestamp)

  return generateTimestamps([fromTimestamp, maxTimestamp], resolution).flatMap(
    (timestamp: UnixTime) => {
      const record = groupedByTimestamp[timestamp]
      if (!record) {
        return createEmptyRecord(timestamp)
      }
      return mapRecord(record)
    },
  )
}

function createEmptyRecord(timestamp: UnixTime): TvsResultItem {
  return {
    timestamp: timestamp,
    totalTvs: 0,
    bySource: {
      native: 0,
      canonical: 0,
      external: 0,
    },
    byCategory: {
      stablecoins: 0,
      eth: 0,
      btc: 0,
      other: 0,
      publicRwa: 0,
      restrictedRwa: 0,
    },
  }
}

function mapRecord([
  timestamp,
  totalTvs,
  canonical,
  external,
  native,
  ether,
  stablecoin,
  btc,
  restrictedRwa,
  publicRwa,
  other,
]: SummedByTimestampTvsValuesRecord): TvsResultItem {
  return {
    timestamp,
    totalTvs,
    bySource: {
      native: native ?? 0,
      canonical: canonical ?? 0,
      external: external ?? 0,
    },
    byCategory: {
      stablecoins: stablecoin ?? 0,
      eth: ether ?? 0,
      btc: btc ?? 0,
      other: other ?? 0,
      publicRwa: publicRwa ?? 0,
      restrictedRwa: restrictedRwa ?? 0,
    },
  }
}
