import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { SyncMetadata } from '../../kysely/generated/types'

export type SyncMetadataFeature =
  | 'activity'
  | 'l2costs'
  | 'liveness'
  | 'anomalies'
  | 'dataAvailability'
  | 'tvs'

export interface SyncMetadataRecord {
  feature: SyncMetadataFeature
  id: string
  target: UnixTime
  syncedUntil: UnixTime | null
}

export function toRecord(row: Selectable<SyncMetadata>): SyncMetadataRecord {
  return {
    ...row,
    feature: row.feature as SyncMetadataFeature,
    target: UnixTime.fromDate(row.target),
    syncedUntil: row.syncedUntil ? UnixTime.fromDate(row.syncedUntil) : null,
  }
}

export function toRow(
  record: Insertable<SyncMetadataRecord>,
): Insertable<SyncMetadata> {
  return {
    ...toRowWithoutTarget(record),
    target: UnixTime.toDate(record.target),
  }
}

export function toRowWithoutTarget(
  record: Omit<Insertable<SyncMetadataRecord>, 'target'>,
): Omit<Insertable<SyncMetadata>, 'target'> {
  return {
    ...record,
    syncedUntil: record.syncedUntil
      ? UnixTime.toDate(record.syncedUntil)
      : null,
  }
}
