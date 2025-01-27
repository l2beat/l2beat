import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { IndexerState } from '../../kysely/generated/types'

export interface IndexerStateRecord {
  indexerId: string
  safeHeight: number
  // TODO: make it required in every indexer
  configHash?: string
  // TODO: phase out minTimestamp
  minTimestamp?: UnixTime
}

export function toRow(record: IndexerStateRecord): Insertable<IndexerState> {
  return {
    ...record,
    minTimestamp: record.minTimestamp?.toDate(),
  }
}

export function toRecord(row: Selectable<IndexerState>): IndexerStateRecord {
  return {
    ...row,
    configHash: row.configHash ?? undefined,
    minTimestamp: row.minTimestamp
      ? UnixTime.fromDate(row.minTimestamp)
      : undefined,
  }
}
