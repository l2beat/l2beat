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

export function toRecord(
  row: Selectable<Omit<Activity, 'uopsCount' | 'ratio'>>,
): ActivityRecord {
  return {
    projectId: ProjectId(row.projectId),
    timestamp: UnixTime.fromDate(row.timestamp),
    count: row.count,
    start: row.start,
    end: row.end,
  }
}

export function toRow(record: ActivityRecord): Insertable<Activity> {
  return {
    projectId: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    count: record.count,
    start: record.start,
    end: record.end,
  }
}
