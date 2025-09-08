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
  blockTarget: number | null
  blockSyncedUntil: UnixTime | null
}

export function toRecord(row: Selectable<SyncMetadata>): SyncMetadataRecord {
  return {
    ...row,
    feature: row.feature as SyncMetadataFeature,
    target: UnixTime.fromDate(row.target),
    syncedUntil: row.syncedUntil ? UnixTime.fromDate(row.syncedUntil) : null,
    blockTarget: row.blockTarget,
    blockSyncedUntil: row.blockSyncedUntil,
  }
}

export function toRow(
  record: Insertable<SyncMetadataRecord>,
): Insertable<SyncMetadata> {
  return {
    ...toRowWithoutTarget(record),
    target: UnixTime.toDate(record.target),
    blockSyncedUntil: record.blockSyncedUntil,
  }
}

export function toRowWithoutTarget(
  record: Omit<Insertable<SyncMetadataRecord>, 'target' | 'blockTarget'>,
): Omit<Insertable<SyncMetadata>, 'target' | 'blockTarget'> {
  return {
    ...record,
    syncedUntil: record.syncedUntil
      ? UnixTime.toDate(record.syncedUntil)
      : null,
    blockSyncedUntil: record.blockSyncedUntil ? record.blockSyncedUntil : null,
  }
}
