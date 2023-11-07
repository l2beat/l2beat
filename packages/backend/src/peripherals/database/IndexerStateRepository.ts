import { Logger } from '@l2beat/backend-tools'
import { Hash256, UnixTime } from '@l2beat/shared-pure'
import { IndexerStateRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface IndexerStateRecord {
  indexerId: string
  configHash: Hash256
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
      .where({
        indexer_id: indexerId,
      })
      .first()

    return row ? toRecord(row) : undefined
  }

  async setSafeHeight(indexerId: string, safeHeight: UnixTime) {
    const knex = await this.knex()

    return await knex('indexer_state')
      .where({
        indexer_id: indexerId,
      })
      .update({
        safe_height: safeHeight.toNumber(),
      })
  }

  async setConfigHash(indexerId: string, configHash: Hash256) {
    const knex = await this.knex()

    return await knex('indexer_state')
      .where({
        indexer_id: indexerId,
      })
      .update({
        config_hash: configHash.toString(),
      })
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

function toRecord(row: IndexerStateRow): IndexerStateRecord {
  return {
    indexerId: row.indexer_id,
    configHash: Hash256(row.config_hash),
    safeHeight: row.safe_height,
    minTimestamp: row.min_timestamp
      ? UnixTime.fromDate(row.min_timestamp)
      : undefined,
  }
}

function toRow(record: IndexerStateRecord): IndexerStateRow {
  return {
    indexer_id: record.indexerId,
    config_hash: record.configHash.toString(),
    safe_height: record.safeHeight,
    min_timestamp: record.minTimestamp?.toDate(),
  }
}
