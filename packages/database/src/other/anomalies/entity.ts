import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Anomaly } from '../../kysely/generated/types'

export interface AnomalyRecord {
  timestamp: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  duration: number
}

export function toRow(record: AnomalyRecord): Insertable<Anomaly> {
  return {
    timestamp: record.timestamp.toDate(),
    project_id: record.projectId,
    subtype: record.subtype,
    duration: record.duration,
  }
}

export function toRecord(row: Selectable<Anomaly>): AnomalyRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    projectId: row.project_id,
    subtype: row.subtype as TrackedTxsConfigSubtype,
    duration: row.duration,
  }
}
