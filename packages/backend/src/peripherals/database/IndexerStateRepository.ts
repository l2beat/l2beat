import { Logger } from '@l2beat/backend-tools'
import { Hash256 } from '@l2beat/shared-pure'
import { IndexerStateRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface IndexerStateRecord {
  indexerId: string
  configHash: Hash256
  safeHeight: number
}

export class IndexerStateRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<IndexerStateRepository>>(this)
  }

  async findConfigHash(indexerId: string): Promise<Hash256 | undefined> {
    const knex = await this.knex()

    const row = await knex('indexer_state')
      .where({
        indexer_id: indexerId,
      })
      .first()

    return row ? Hash256(row.config_hash) : undefined
  }

  async findSafeHeight(indexerId: string): Promise<number | undefined> {
    const knex = await this.knex()

    const row = await knex('indexer_state')
      .where({
        indexer_id: indexerId,
      })
      .first()

    return row?.safe_height
  }

  async addOrUpdate(record: IndexerStateRecord): Promise<string> {
    const knex = await this.knex()

    await knex('indexer_state')
      .insert(toRow(record))
      .onConflict('indexer_id')
      .merge()

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

function toRecord(row: IndexerStateRow) {
  return {
    indexerId: row.indexer_id,
    configHash: Hash256(row.config_hash),
    safeHeight: row.safe_height,
  }
}

function toRow(record: IndexerStateRecord): IndexerStateRow {
  return {
    indexer_id: record.indexerId,
    config_hash: record.configHash.toString(),
    safe_height: record.safeHeight,
  }
}
