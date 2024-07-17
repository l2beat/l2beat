import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { TvlCleaner } from '../kysely/generated/types'

export interface TvlCleanerRecord {
  repositoryName: string
  hourlyCleanedUntil: UnixTime | null
  sixHourlyCleanedUntil: UnixTime | null
}

export function toRow(record: TvlCleanerRecord): Insertable<TvlCleaner> {
  return {
    repository_name: record.repositoryName,
    hourly_cleaned_until: record.hourlyCleanedUntil?.toDate() ?? null,
    six_hourly_cleaned_until: record.sixHourlyCleanedUntil?.toDate() ?? null,
  }
}

export function toRecord(row: Selectable<TvlCleaner>): TvlCleanerRecord {
  return {
    repositoryName: row.repository_name,
    hourlyCleanedUntil: row.hourly_cleaned_until
      ? UnixTime.fromDate(row.hourly_cleaned_until)
      : null,
    sixHourlyCleanedUntil: row.six_hourly_cleaned_until
      ? UnixTime.fromDate(row.six_hourly_cleaned_until)
      : null,
  }
}
