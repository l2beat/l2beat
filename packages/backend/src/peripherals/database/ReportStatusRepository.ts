import { Logger } from '@l2beat/shared'
import { ChainId, Hash256, UnixTime, ValueType } from '@l2beat/shared-pure'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'
import { NullableDict } from './shared/types'

export interface ReportStatusRecord {
  configHash: Hash256
  timestamp: UnixTime
}

export class ReportStatusRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<ReportStatusRepository>>(this)
  }

  // TODO(radomski): Add different config hashes for value_type and chain_id
  // after the config the updated
  async getByConfigHash(
    configHash: Hash256,
    chainId: ChainId,
    valueType: ValueType,
  ): Promise<UnixTime[]> {
    const knex = await this.knex()
    const rows = await knex('reports_status')
      .where({
        config_hash: configHash.toString(),
        chain_id: chainId.valueOf(),
        asset_type: valueType.toString(),
      })
      .select('unix_timestamp')

    return rows.map((r) => UnixTime.fromDate(r.unix_timestamp))
  }

  async add(record: {
    configHash: Hash256
    timestamp: UnixTime
    chainId: ChainId
    valueType: ValueType
  }): Promise<Hash256> {
    const knex = await this.knex()
    await knex.transaction(async (trx) => {
      await trx('reports_status')
        .where({
          unix_timestamp: record.timestamp.toDate(),
          chain_id: record.chainId.valueOf(),
          asset_type: record.valueType.toString(),
        })
        .delete()
      await trx('reports_status').insert({
        config_hash: record.configHash.toString(),
        unix_timestamp: record.timestamp.toDate(),
        chain_id: record.chainId.valueOf(),
        asset_type: record.valueType.toString(),
      })
    })
    return record.configHash
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('reports_status').delete()
  }

  async getBetween(
    from: UnixTime,
    to: UnixTime,
    chainId: ChainId,
    valueType: ValueType,
  ): Promise<ReportStatusRecord[]> {
    const knex = await this.knex()

    const rows = await knex('reports_status')
      .where('unix_timestamp', '>=', from.toDate())
      .andWhere('unix_timestamp', '<=', to.toDate())
      .andWhere({
        chain_id: chainId.valueOf(),
        asset_type: valueType.toString(),
      })

    return rows.map((r) => ({
      timestamp: UnixTime.fromDate(r.unix_timestamp),
      configHash: Hash256(r.config_hash),
    }))
  }

  async findLatestTimestamp(
    chainId: ChainId,
    valueType: ValueType,
  ): Promise<UnixTime | undefined> {
    const knex = await this.knex()
    // note: we need to provide better types manually here
    const row = (await knex('reports_status')
      .where({ chain_id: chainId.valueOf(), asset_type: valueType.toString() })
      .max('unix_timestamp')
      .first()) as NullableDict<Date> | undefined
    if (!row || row.max === null) {
      return undefined
    }

    return UnixTime.fromDate(row.max)
  }
}
