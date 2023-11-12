import { Logger } from '@l2beat/backend-tools'
import { ChainId } from '@l2beat/discovery'
import type { DiscoveryCacheRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface DiscoveryCacheRecord {
  key: string
  value: string
  chainId: ChainId
  blockNumber: number
}

export class DiscoveryCacheRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<DiscoveryCacheRepository>>(this)
  }

  async addOrUpdate(record: DiscoveryCacheRecord): Promise<string> {
    const row = toRow(record)
    const knex = await this.knex()
    await knex('discovery_cache').insert(row).onConflict('key').merge()

    return row.key
  }

  async findByKey(key: string): Promise<DiscoveryCacheRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('discovery_cache').where({ key }).first()

    if (row) {
      return toRecord(row)
    }
  }

  async getAll(): Promise<DiscoveryCacheRecord[]> {
    const knex = await this.knex()
    const rows = await knex('discovery_cache').select('*')

    return rows.map(toRecord)
  }
  async deleteAfter(blockNumber: number, chainId: ChainId): Promise<number> {
    const knex = await this.knex()
    return knex('discovery_cache')
      .where('block_number', '>', blockNumber)
      .andWhere('chain_id', Number(chainId))
      .delete()
  }

  async deleteAll(): Promise<number> {
    const knex = await this.knex()
    return knex('discovery_cache').delete()
  }
}

function toRow(record: DiscoveryCacheRecord): DiscoveryCacheRow {
  return {
    key: record.key,
    value: record.value,
    chain_id: Number(record.chainId),
    block_number: record.blockNumber,
  }
}

function toRecord(row: DiscoveryCacheRow): DiscoveryCacheRecord {
  return {
    key: row.key,
    value: row.value,
    chainId: ChainId(row.chain_id),
    blockNumber: row.block_number,
  }
}
