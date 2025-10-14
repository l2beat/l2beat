import type {
  Database,
  SummedByTimestampProjectValueRecord,
} from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getTimestampedValuesRange } from '../../utils/getTimestampedValuesRange'
import { rangeToResolution } from '../../utils/range'
import type { TvsRange, TvsResultItem } from './types'

export async function getTvsData(
  db: Database,
  range: TvsRange,
  projectIds: ProjectId[],
): Promise<TvsResultItem[]> {
  const type = projectIds.length === 1 ? 'PROJECT' : 'SUMMARY'

  const resolution = rangeToResolution(range)

  const [from, to] = getTimestampedValuesRange(range, resolution, {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })

  const [latest, valueRecords] = await Promise.all([
    db.tvsProjectValue.getLatestValues(type, projectIds),
    db.tvsProjectValue.getSummedByTimestamp(projectIds, type, [from, to]),
  ])

  const latestTimestamp = latest.at(-1)?.timestamp
  if (!latestTimestamp || valueRecords.length === 0) {
    return []
  }
  const delayedRecords = latest.filter((v) => v.timestamp < latestTimestamp)

  if (delayedRecords.length > 0) {
    for (const record of valueRecords) {
      const delayedRecordsForTimestamp = delayedRecords.filter(
        (v) => v.timestamp < record.timestamp,
      )
      if (delayedRecordsForTimestamp.length > 0) {
        record.value += delayedRecordsForTimestamp.reduce(
          (acc, curr) => acc + curr.value,
          0,
        )
        record.canonical += delayedRecordsForTimestamp.reduce(
          (acc, curr) => acc + curr.canonical,
          0,
        )
        record.external += delayedRecordsForTimestamp.reduce(
          (acc, curr) => acc + curr.external,
          0,
        )
        record.native += delayedRecordsForTimestamp.reduce(
          (acc, curr) => acc + curr.native,
          0,
        )
        record.ether += delayedRecordsForTimestamp.reduce(
          (acc, curr) => acc + curr.ether,
          0,
        )
        record.stablecoin += delayedRecordsForTimestamp.reduce(
          (acc, curr) => acc + curr.stablecoin,
          0,
        )
        record.btc += delayedRecordsForTimestamp.reduce(
          (acc, curr) => acc + curr.btc,
          0,
        )
        record.other += delayedRecordsForTimestamp.reduce(
          (acc, curr) => acc + curr.other,
          0,
        )
      }
    }
  }

  const timestamps = valueRecords.map((v) => v.timestamp)
  const fromTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)
  const groupedByTimestamp = keyBy(valueRecords, (v) => v.timestamp)

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
    },
  }
}

function mapRecord(record: SummedByTimestampProjectValueRecord): TvsResultItem {
  return {
    timestamp: record.timestamp,
    totalTvs: record.value,
    bySource: {
      native: record.native ?? 0,
      canonical: record.canonical ?? 0,
      external: record.external ?? 0,
    },
    byCategory: {
      stablecoins: record.stablecoin ?? 0,
      eth: record.ether ?? 0,
      btc: record.btc ?? 0,
      other: record.other ?? 0,
    },
  }
}
