import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Activity } from '../kysely/generated/types'

export interface ActivityRecord {
  projectId: ProjectId
  timestamp: UnixTime
  count: number
  start: number
  end: number
}

export function toRecord(row: Selectable<Activity>): ActivityRecord {
  return {
    projectId: ProjectId(row.project_id),
    timestamp: UnixTime.fromDate(row.timestamp),
    count: row.count,
    start: row.start,
    end: row.end,
  }
}

export function toRow(record: ActivityRecord): Insertable<Activity> {
  return {
    project_id: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    count: record.count,
    start: record.start,
    end: record.end,
  }
}
