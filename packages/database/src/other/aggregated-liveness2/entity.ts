import { type TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { AggregatedLiveness2 } from '../../kysely/generated/types'

export interface AggregatedLiveness2Record {
  timestamp: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  min: number
  avg: number
  max: number
}

export function toRow(
  record: AggregatedLiveness2Record,
): Insertable<AggregatedLiveness2> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export function toRecord(
  row: Selectable<AggregatedLiveness2>,
): AggregatedLiveness2Record {
  return {
    ...row,
    subtype: row.subtype as TrackedTxsConfigSubtype,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}
