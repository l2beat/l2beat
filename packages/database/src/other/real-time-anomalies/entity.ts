import { type TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { RealTimeAnomaly } from '../../kysely/generated/types'

export type RealTimeAnomalyStatus = 'ongoing' | 'recovered'

export interface RealTimeAnomalyRecord<
  T extends RealTimeAnomalyStatus = RealTimeAnomalyStatus,
> {
  start: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  status: T
  isApproved: boolean
  end?: UnixTime
}

export function toRow<T extends RealTimeAnomalyStatus = RealTimeAnomalyStatus>(
  record: RealTimeAnomalyRecord<T>,
): Insertable<RealTimeAnomaly> {
  return {
    ...record,
    start: UnixTime.toDate(record.start),
    end: record.end ? UnixTime.toDate(record.end) : undefined,
  }
}

export function toRecord<T extends RealTimeAnomalyStatus>(
  row: Selectable<RealTimeAnomaly>,
): RealTimeAnomalyRecord<T> {
  return {
    ...row,
    start: UnixTime.fromDate(row.start),
    end: row.end ? UnixTime.fromDate(row.end) : undefined,
    subtype: row.subtype as TrackedTxsConfigSubtype,
    status: row.status as T,
  }
}
