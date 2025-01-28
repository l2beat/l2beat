import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { TvlCleaner } from '../../kysely/generated/types'

export interface TvlCleanerRecord {
  repositoryName: string
  hourlyCleanedUntil: UnixTime | null
  sixHourlyCleanedUntil: UnixTime | null
}

export function toRow(record: TvlCleanerRecord): Insertable<TvlCleaner> {
  return {
    repositoryName: record.repositoryName,
    hourlyCleanedUntil: record.hourlyCleanedUntil?.toDate() ?? null,
    sixHourlyCleanedUntil: record.sixHourlyCleanedUntil?.toDate() ?? null,
  }
}

export function toRecord(row: Selectable<TvlCleaner>): TvlCleanerRecord {
  return {
    repositoryName: row.repositoryName,
    hourlyCleanedUntil: row.hourlyCleanedUntil
      ? UnixTime.fromDate(row.hourlyCleanedUntil)
      : null,
    sixHourlyCleanedUntil: row.sixHourlyCleanedUntil
      ? UnixTime.fromDate(row.sixHourlyCleanedUntil)
      : null,
  }
}
