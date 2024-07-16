import { Insertable, Selectable } from 'kysely'
import { IndexerConfiguration } from '../kysely/generated/types'

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
  return {
    id: row.id,
    indexerId: row.indexer_id,
    properties: row.properties,
    currentHeight: row.current_height,
    minHeight: row.min_height,
    maxHeight: row.max_height,
  }
}
export function toRow(
  record: IndexerConfigurationRecord,
): Insertable<IndexerConfiguration> {
  return {
    id: record.id,
    indexer_id: record.indexerId,
    properties: record.properties,
    current_height: record.currentHeight,
    min_height: record.minHeight,
    max_height: record.maxHeight,
  }
}
