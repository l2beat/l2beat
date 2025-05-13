import { type TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { AggregatedLiveness } from '../../kysely/generated/types'

export interface AggregatedLivenessRecord {
  timestamp: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  min: number
  avg: number
  max: number
  numberOfRecords: number
}

export function toRow(
  record: AggregatedLivenessRecord,
): Insertable<AggregatedLiveness> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export function toRecord(
  row: Selectable<AggregatedLiveness>,
): AggregatedLivenessRecord {
  return {
    ...row,
    subtype: row.subtype as TrackedTxsConfigSubtype,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}
