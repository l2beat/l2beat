import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { IndexerState as IndexerStateRow } from '../kysely/generated/types'

export interface IndexerState {
  indexerId: string
  safeHeight: number
  // TODO: make it required in every indexer
  configHash?: string
  // TODO: phase out minTimestamp
  minTimestamp?: UnixTime
}

export function toRow(record: IndexerState): Insertable<IndexerStateRow> {
  return {
    indexer_id: record.indexerId,
    safe_height: record.safeHeight,
    config_hash: record.configHash,
    min_timestamp: record.minTimestamp?.toDate(),
  }
}

export function toRecord(row: Selectable<IndexerStateRow>): IndexerState {
  return {
    indexerId: row.indexer_id,
    safeHeight: row.safe_height,
    configHash: row.config_hash ?? undefined,
    minTimestamp: row.min_timestamp
      ? UnixTime.fromDate(row.min_timestamp)
      : undefined,
  }
}
