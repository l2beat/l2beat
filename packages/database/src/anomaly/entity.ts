import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Anomaly as AnomalyRow } from '../kysely/generated/types'

export interface Anomaly {
  timestamp: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  duration: number
}

export function toRow(record: Anomaly): Insertable<AnomalyRow> {
  return {
    timestamp: record.timestamp.toDate(),
    project_id: record.projectId,
    subtype: record.subtype,
    duration: record.duration,
  }
}

export function toRecord(row: Selectable<AnomalyRow>): Anomaly {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    projectId: row.project_id,
    subtype: row.subtype as TrackedTxsConfigSubtype,
    duration: row.duration,
  }
}
