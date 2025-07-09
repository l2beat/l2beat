import { type TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { RealTimeAnomaly } from '../../kysely/generated/types'

export interface RealTimeAnomalyRecord {
  start: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  isOngoing: boolean
  isApproved: boolean
  end?: UnixTime
}

export function toRow(
  record: RealTimeAnomalyRecord,
): Insertable<RealTimeAnomaly> {
  return {
    ...record,
    start: UnixTime.toDate(record.start),
    end: record.end ? UnixTime.toDate(record.end) : undefined,
  }
}

export function toRecord(
  row: Selectable<RealTimeAnomaly>,
): RealTimeAnomalyRecord {
  return {
    ...row,
    start: UnixTime.fromDate(row.start),
    end: row.end ? UnixTime.fromDate(row.end) : undefined,
    subtype: row.subtype as TrackedTxsConfigSubtype,
  }
}
