import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { DataAvailability } from '../../kysely/generated/types'

export interface DataAvailabilityRecord {
  projectId: string
  daLayer: string
  timestamp: UnixTime
  totalSize: bigint
}

export function toRecord(
  row: Selectable<DataAvailability>,
): DataAvailabilityRecord {
  return {
    projectId: row.projectId,
    daLayer: row.daLayer,
    timestamp: UnixTime.fromDate(row.timestamp),
    totalSize: BigInt(row.totalSize),
  }
}

export function toRow(
  record: DataAvailabilityRecord,
): Insertable<DataAvailability> {
  return {
    projectId: record.projectId,
    daLayer: record.daLayer,
    timestamp: record.timestamp.toDate(),
    totalSize: record.totalSize.toString(),
  }
}
