import type { ProjectId, ProjectValueType } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getRangeWithMax } from '~/utils/range/range'
import { getTvsTargetTimestamp } from './get-tvs-target-timestamp'
import type { TvsChartRange } from './range'
import { rangeToResolution } from './range'

export async function getSummedTvsValues(
  projectIds: ProjectId[],
  range: TvsChartRange,
  type?: ProjectValueType,
) {
  const db = getDb()
  const resolution = rangeToResolution(range)
  const target = getTvsTargetTimestamp()
  const [from] = getRangeWithMax(range, resolution, {
    now: target,
  })
  const [latest, valueRecords] = await Promise.all([
    db.tvsProjectValue.getLatestValues(type ?? 'SUMMARY', projectIds),
    db.tvsProjectValue.getSummedByTimestamp(projectIds, type ?? 'SUMMARY', [
      from,
      target,
    ]),
  ])

  const latestTimestamp = latest.at(-1)?.timestamp
  if (!latestTimestamp) {
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
        record.other += delayedRecordsForTimestamp.reduce(
          (acc, curr) => acc + curr.other,
          0,
        )
        record.associated += delayedRecordsForTimestamp.reduce(
          (acc, curr) => acc + curr.associated,
          0,
        )
      }
    }
  }

  const timestamps = valueRecords.map((v) => v.timestamp)
  const fromTimestamp = Math.min(...timestamps)
  const groupedByTimestamp = keyBy(valueRecords, (v) => v.timestamp)

  return generateTimestamps([fromTimestamp, target], resolution, {
    addTarget: true,
  }).flatMap((timestamp) => {
    const record = groupedByTimestamp[timestamp]
    if (!record) {
      return []
    }
    return record
  })
}
