import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { AggregatedLiveness } from '../kysely/generated/types'

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
    project_id: record.projectId,
    subtype: record.subtype,
    range: record.range,
    min: record.min,
    avg: record.avg,
    max: record.max,
    updated_at: record.updatedAt.toDate(),
  }
}

export function toRecord(
  row: Selectable<AggregatedLiveness>,
): AggregatedLivenessRecord {
  return {
    projectId: row.project_id,
    subtype: row.subtype as TrackedTxsConfigSubtype,
    range: row.range as AggregatedLivenessRange,
    min: row.min,
    avg: row.avg,
    max: row.max,
    updatedAt: UnixTime.fromDate(row.updated_at),
  }
}
