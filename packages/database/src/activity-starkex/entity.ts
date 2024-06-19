import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Starkex as StarkexTransactionCountRow } from '../kysely/generated/types'

export interface StarkexTransactionCount {
  timestamp: UnixTime
  projectId: ProjectId
  count: number
}

export function toRow(
  record: StarkexTransactionCount,
): Insertable<StarkexTransactionCountRow> {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    count: record.count,
  }
}

export function toRecord(
  row: Selectable<StarkexTransactionCountRow>,
): StarkexTransactionCount {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    count: row.count,
  }
}
