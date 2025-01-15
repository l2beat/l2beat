import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'

export interface DaRecord {
  project: string
  timestamp: UnixTime
  totalSize: number
}

export interface DaRow {
  project: string
  timestamp: Date
  totalSize: number
}

export function toRecord(row: Selectable<DaRow>): DaRecord {
  return {
    project: row.project,
    timestamp: UnixTime.fromDate(row.timestamp),
    totalSize: row.totalSize,
  }
}

export function toRow(record: DaRecord): Insertable<DaRow> {
  return {
    project: record.project,
    timestamp: record.timestamp.toDate(),
    totalSize: record.totalSize,
  }
}
