import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { SyncMetadata } from '../../kysely/generated/types'

export type SyncMetadataFeature =
  | 'activity'
  | 'l2Cost'
  | 'liveness'
  | 'anomalies'

export interface SyncMetadataRecord {
  feature: SyncMetadataFeature
  id: string
  target: UnixTime
  syncedUntil: UnixTime
}

export function toRecord(row: Selectable<SyncMetadata>): SyncMetadataRecord {
  return {
    ...row,
    feature: row.feature as SyncMetadataFeature,
    target: UnixTime.fromDate(row.target),
    syncedUntil: UnixTime.fromDate(row.syncedUntil),
  }
}

export function toRow(record: SyncMetadataRecord): Insertable<SyncMetadata> {
  return {
    ...record,
    target: UnixTime.toDate(record.target),
    syncedUntil: UnixTime.toDate(record.syncedUntil),
  }
}
