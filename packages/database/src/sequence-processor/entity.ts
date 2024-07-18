import { Insertable, Selectable } from 'kysely'
import { SequenceProcessor } from '../kysely/generated/types'

export interface SequenceProcessorRecord {
  id: string
  lastProcessed: number
  latest: number
  syncedOnce: boolean
}

export function toRow(
  record: SequenceProcessorRecord,
): Insertable<SequenceProcessor> {
  return {
    id: record.id,
    last_processed: record.lastProcessed,
    latest: record.latest,
    synced_once: record.syncedOnce,
    updated_at: new Date(),
  }
}

export function toRecord(
  row: Selectable<SequenceProcessor>,
): SequenceProcessorRecord {
  return {
    id: row.id,
    lastProcessed: row.last_processed,
    syncedOnce: row.synced_once,
    latest: row.latest,
  }
}
