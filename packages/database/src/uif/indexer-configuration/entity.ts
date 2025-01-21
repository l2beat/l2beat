import type { Insertable, Selectable } from 'kysely'
import type { IndexerConfiguration } from '../../kysely/generated/types'

export interface IndexerConfigurationRecord {
  id: string
  indexerId: string
  properties: string
  currentHeight: number | null
  minHeight: number
  maxHeight: number | null
}

export function toRecord(
  row: Selectable<IndexerConfiguration>,
): IndexerConfigurationRecord {
  return row
}

export function toRecordWithoutIndexerId(
  row: Selectable<Omit<IndexerConfiguration, 'indexerId'>>,
): Omit<IndexerConfigurationRecord, 'indexerId'> {
  return {
    id: row.id,
    properties: row.properties,
    currentHeight: row.currentHeight,
    minHeight: row.minHeight,
    maxHeight: row.maxHeight,
  }
}

export function toRow(
  record: IndexerConfigurationRecord,
): Insertable<IndexerConfiguration> {
  return record
}
