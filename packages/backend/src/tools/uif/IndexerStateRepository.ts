import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

import {
  BaseRepository,
  CheckConvention,
} from '../../peripherals/database/BaseRepository'
import { Database } from '../../peripherals/database/Database'

export interface IndexerStateRow {
  indexer_id: string
  safe_height: number
  config_hash: string | null
  min_timestamp: Date | null
}

export interface IndexerStateRecord {
  indexerId: string
  safeHeight: number
  // TODO: make it required in every indexer
  configHash?: string
  // TODO: phase out minTimestamp
  minTimestamp?: UnixTime
}

export class IndexerStateRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<IndexerStateRepository>>(this)
  }

  async addOrUpdate(
    record: IndexerStateRecord,
    trx?: Knex.Transaction,
  ): Promise<string> {
    const knex = await this.knex(trx)
    await knex('indexer_state')
      .insert(toRow(record))
      .onConflict('indexer_id')
      .merge()

    return `[${record.indexerId}]: ${record.safeHeight}`
  }

  async getByIndexerIdLike(
    indexerIdLike: string,
  ): Promise<IndexerStateRecord[]> {
    const knex = await this.knex()

    const rows = await knex('indexer_state').whereLike(
      'indexer_id',
      indexerIdLike,
    )

    return rows.map(toRecord)
  }

  async getByIndexerIds(ids: string[]): Promise<IndexerStateRecord[]> {
    const knex = await this.knex()

    const rows = await knex('indexer_state').whereIn('indexer_id', ids)

    return rows.map(toRecord)
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

  // #region methods used only in tests

  async getAll(): Promise<IndexerStateRecord[]> {
    const knex = await this.knex()
    const rows = await knex('indexer_state')
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('indexer_state').delete()
  }

  // #endregion
}

function toRecord(row: IndexerStateRow): IndexerStateRecord {
  return {
    indexerId: row.indexer_id,
    safeHeight: row.safe_height,
    configHash: row.config_hash ?? undefined,
    minTimestamp: row.min_timestamp
      ? UnixTime.fromDate(row.min_timestamp)
      : undefined,
  }
}

function toRow(record: IndexerStateRecord): IndexerStateRow {
  return {
    indexer_id: record.indexerId,
    safe_height: record.safeHeight,
    config_hash: record.configHash ?? null,
    min_timestamp: record.minTimestamp?.toDate() ?? null,
  }
}
