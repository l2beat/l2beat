import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Starkex } from '../../kysely/generated/types'

export interface StarkExTransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  count: number
}

export function toRow(
  record: StarkExTransactionCountRecord,
): Insertable<Starkex> {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    count: record.count,
  }
}

export function toRecord(
  row: Selectable<Starkex>,
): StarkExTransactionCountRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    count: row.count,
  }
}
