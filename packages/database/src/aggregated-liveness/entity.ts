import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { AggregatedLiveness as AggregatedLivenessRow } from '../kysely/generated/types'

export type AggregatedLivenessRange = '30D' | '90D' | 'MAX'

export interface AggregatedLiveness {
  projectId: string
  subtype: TrackedTxsConfigSubtype
  range: AggregatedLivenessRange
  min: number
  avg: number
  max: number
  timestamp: UnixTime
}

export function toRow(
  record: AggregatedLiveness,
): Insertable<AggregatedLivenessRow> {
  return {
    project_id: record.projectId,
    subtype: record.subtype,
    range: record.range,
    min: record.min,
    avg: record.avg,
    max: record.max,
    timestamp: record.timestamp.toDate(),
  }
}

export function toRecord(
  row: Selectable<AggregatedLivenessRow>,
): AggregatedLiveness {
  return {
    projectId: row.project_id,
    subtype: row.subtype as TrackedTxsConfigSubtype,
    range: row.range as AggregatedLivenessRange,
    min: row.min,
    avg: row.avg,
    max: row.max,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}
