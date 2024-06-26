import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { TvlCleaner as TvlCleanerRow } from '../kysely/generated/types'

export interface TvlCleaner {
  repositoryName: string
  hourlyCleanedUntil: UnixTime | null
  sixHourlyCleanedUntil: UnixTime | null
}

export function toRow(record: TvlCleaner): Insertable<TvlCleanerRow> {
  return {
    repository_name: record.repositoryName,
    hourly_cleaned_until: record.hourlyCleanedUntil?.toDate() ?? null,
    six_hourly_cleaned_until: record.sixHourlyCleanedUntil?.toDate() ?? null,
  }
}

export function toRecord(row: Selectable<TvlCleanerRow>): TvlCleaner {
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
