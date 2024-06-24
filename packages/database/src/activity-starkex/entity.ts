import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Starkex as StarkExTransactionCountRow } from '../kysely/generated/types'

export interface StarkExTransactionCount {
  timestamp: UnixTime
  projectId: ProjectId
  count: number
}

export function toRow(
  record: StarkExTransactionCount,
): Insertable<StarkExTransactionCountRow> {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    count: record.count,
  }
}

export function toRecord(
  row: Selectable<StarkExTransactionCountRow>,
): StarkExTransactionCount {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    count: row.count,
  }
}
