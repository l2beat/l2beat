import { type TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { AggregatedLiveness } from '../../kysely/generated/types'

export type AggregatedLivenessRange = '30D' | '90D' | 'MAX'

export interface AggregatedLivenessRecord {
  projectId: string
  subtype: TrackedTxsConfigSubtype
  range: AggregatedLivenessRange
  min: number
  avg: number
  max: number
  updatedAt: UnixTime
}

export function toRow(
  record: AggregatedLivenessRecord,
): Insertable<AggregatedLiveness> {
  return {
    ...record,
    updatedAt: record.updatedAt.toDate(),
  }
}

export function toRecord(
  row: Selectable<AggregatedLiveness>,
): AggregatedLivenessRecord {
  return {
    ...row,
    subtype: row.subtype as TrackedTxsConfigSubtype,
    range: row.range as AggregatedLivenessRange,
    updatedAt: UnixTime.fromDate(row.updatedAt),
  }
}
