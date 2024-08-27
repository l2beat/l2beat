import { Insertable, Selectable } from 'kysely'
import { SequenceProcessor } from '../../kysely/generated/types'

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
    ...record,
    updatedAt: new Date(),
  }
}

export function toRecord(
  row: Selectable<SequenceProcessor>,
): SequenceProcessorRecord {
  return row
}
