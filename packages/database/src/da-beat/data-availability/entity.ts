import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { DataAvailability } from '../../kysely/generated/types'

export interface DataAvailabilityRecord {
  projectId: string
  timestamp: UnixTime
  totalSize: number
}

export interface DataAvailabilityRow {
  projectId: string
  timestamp: Date
  totalSize: number
}

export function toRecord(
  row: Selectable<DataAvailability>,
): DataAvailabilityRecord {
  return {
    projectId: row.projectId,
    timestamp: UnixTime.fromDate(row.timestamp),
    totalSize: row.totalSize,
  }
}

export function toRow(
  record: DataAvailabilityRecord,
): Insertable<DataAvailability> {
  return {
    projectId: record.projectId,
    timestamp: record.timestamp.toDate(),
    totalSize: record.totalSize,
  }
}
