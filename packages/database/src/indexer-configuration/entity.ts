import { Insertable, Selectable } from 'kysely'
import { IndexerConfiguration as IndexerConfigurationRow } from '../kysely/generated/types'

export interface IndexerConfiguration {
  id: string
  indexerId: string
  properties: string
  currentHeight: number | null
  minHeight: number
  maxHeight: number | null
}

export function toRecord(
  row: Selectable<IndexerConfigurationRow>,
): IndexerConfiguration {
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
  record: IndexerConfiguration,
): Insertable<IndexerConfigurationRow> {
  return {
    id: record.id,
    indexer_id: record.indexerId,
    properties: record.properties,
    current_height: record.currentHeight,
    min_height: record.minHeight,
    max_height: record.maxHeight,
  }
}
