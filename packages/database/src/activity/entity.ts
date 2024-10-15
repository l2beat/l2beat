import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Activity } from '../kysely/generated/types'

export interface ActivityRecord {
  projectId: ProjectId
  timestamp: UnixTime
  count: number
  uopsCount: number | null
  ratio: number | null
  start: number
  end: number
}

export function toRecord(row: Selectable<Activity>): ActivityRecord {
  return {
    ...row,
    projectId: ProjectId(row.projectId),
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: ActivityRecord): Insertable<Activity> {
  return {
    ...record,
    projectId: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
  }
}
