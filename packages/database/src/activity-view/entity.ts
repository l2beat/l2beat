import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Selectable } from 'kysely'
import { Generated, Timestamp } from '../kysely/generated/types'

export interface DailyTransactionCountRecord {
  projectId: ProjectId
  timestamp: UnixTime
  count: number
}

export interface DailyTransactionCountRow {
  project_id: string
  // postgres keeps it as bigint, because it is a sum of integers
  count: string
  unix_timestamp: Generated<Timestamp>
}

export function toRecord(
  row: Selectable<DailyTransactionCountRow>,
): DailyTransactionCountRecord {
  return {
    projectId: ProjectId(row.project_id),
    count: Number(row.count),
    timestamp: UnixTime.fromDate(row.unix_timestamp),
  }
}
