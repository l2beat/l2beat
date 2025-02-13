import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { DataAvailability } from '../../kysely/generated/types'

export interface DataAvailabilityRecord {
  projectId: string
  timestamp: UnixTime
  totalSize: bigint
}

export function toRecord(
  row: Omit<Selectable<DataAvailability>, 'daLayer'>,
): DataAvailabilityRecord {
  return {
    projectId: row.projectId,
    timestamp: UnixTime.fromDate(row.timestamp),
    totalSize: BigInt(row.totalSize),
  }
}

export function toRow(
  record: DataAvailabilityRecord,
): Insertable<DataAvailability> {
  return {
    projectId: record.projectId,
    // Temporary solution until next PR is merged
    // Indexer writing to this table is disabled
    // DataAvailability table has been cleaned as well
    daLayer: 'UNKNOWN',
    timestamp: record.timestamp.toDate(),
    totalSize: record.totalSize.toString(),
  }
}
