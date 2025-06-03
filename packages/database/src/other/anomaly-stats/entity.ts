import { type TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { AnomalyStats } from '../../kysely/generated/types'

export interface AnomalyStatsRecord {
  timestamp: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  mean: number
  stdDev: number
}

export function toRow(record: AnomalyStatsRecord): Insertable<AnomalyStats> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export function toRecord(row: Selectable<AnomalyStats>): AnomalyStatsRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    subtype: row.subtype as TrackedTxsConfigSubtype,
  }
}
