import { Insertable, Selectable } from 'kysely'
import { SequenceProcessor as SequenceProcessorRow } from '../kysely/generated/types'

export interface SequenceProcessor {
  id: string
  lastProcessed: number
  latest: number
  syncedOnce: boolean
}

export function toRow(
  record: SequenceProcessor,
): Insertable<SequenceProcessorRow> {
  return {
    id: record.id,
    last_processed: record.lastProcessed,
    latest: record.latest,
    synced_once: record.syncedOnce,
    updated_at: new Date(),
  }
}

export function toRecord(
  row: Selectable<SequenceProcessorRow>,
): SequenceProcessor {
  return {
    id: row.id,
    lastProcessed: row.last_processed,
    syncedOnce: row.synced_once,
    latest: row.latest,
  }
}
