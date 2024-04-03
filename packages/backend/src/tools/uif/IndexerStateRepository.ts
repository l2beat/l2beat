import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { IndexerStateRow } from 'knex/types/tables'

import {
  BaseRepository,
  CheckConvention,
} from '../../peripherals/database/BaseRepository'
import { Database } from '../../peripherals/database/Database'

export interface IndexerStateRecord {
  indexerId: string
  safeHeight: number
  minTimestamp?: UnixTime
}

export class IndexerStateRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<IndexerStateRepository>>(this)
  }

  async findIndexerState(
    indexerId: string,
  ): Promise<IndexerStateRecord | undefined> {
    const knex = await this.knex()

    const row = await knex('indexer_state')
      .where({ indexer_id: indexerId })
      .first()

    return row ? toRecord(row) : undefined
  }

  async setSafeHeight(
    indexerId: string,
    safeHeight: number,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)

    return await knex('indexer_state')
      .where({ indexer_id: indexerId })
      .update({ safe_height: safeHeight })
  }

  async add(
    record: IndexerStateRecord,
    trx?: Knex.Transaction,
  ): Promise<string> {
    const knex = await this.knex(trx)

    await knex('indexer_state').insert(toRow(record))

    return `[${record.indexerId}]: ${record.safeHeight}`
  }

  async getAll(): Promise<IndexerStateRecord[]> {
    const knex = await this.knex()
    const rows = await knex('indexer_state')
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('indexer_state').delete()
  }
}

function toRecord(row: IndexerStateRow): IndexerStateRecord {
  return {
    indexerId: row.indexer_id,
    safeHeight: row.safe_height,
    minTimestamp: row.min_timestamp
      ? UnixTime.fromDate(row.min_timestamp)
      : undefined,
  }
}

function toRow(record: IndexerStateRecord): IndexerStateRow {
  return {
    indexer_id: record.indexerId,
    safe_height: record.safeHeight,
    min_timestamp: record.minTimestamp?.toDate(),
  }
}
