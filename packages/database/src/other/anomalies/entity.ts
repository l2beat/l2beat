import { type TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { Anomaly } from '../../kysely/generated/types'

export interface AnomalyRecord {
  timestamp: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  duration: number
}

export function toRow(record: AnomalyRecord): Insertable<Anomaly> {
  return {
    ...record,
    timestamp: record.timestamp.toDate(),
  }
}

export function toRecord(row: Selectable<Anomaly>): AnomalyRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    subtype: row.subtype as TrackedTxsConfigSubtype,
  }
}
