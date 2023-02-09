import { Hash256, Logger, UnixTime } from '@l2beat/shared'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface BalanceStatusRecord {
  configHash: Hash256
  timestamp: UnixTime
}

export class BalanceStatusRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<BalanceStatusRepository>>(this)
  }

  async getByConfigHash(configHash: Hash256): Promise<UnixTime[]> {
    const knex = await this.knex()
    const rows = await knex('balance_status')
      .where({ config_hash: configHash.toString() })
      .select('unix_timestamp')

    return rows.map((r) => UnixTime.fromDate(r.unix_timestamp))
  }

  async add(record: BalanceStatusRecord): Promise<Hash256> {
    const knex = await this.knex()
    await knex.transaction(async (trx) => {
      await trx('balance_status')
        .where({
          unix_timestamp: record.timestamp.toDate(),
        })
        .delete()
      await trx('balance_status').insert({
        config_hash: record.configHash.toString(),
        unix_timestamp: record.timestamp.toDate(),
      })
    })
    return record.configHash
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('balance_status').delete()
  }

  async getBetween(
    from: UnixTime,
    to: UnixTime,
  ): Promise<BalanceStatusRecord[]> {
    const knex = await this.knex()

    const rows = await knex('balance_status')
      .where('unix_timestamp', '>=', from.toDate())
      .andWhere('unix_timestamp', '<=', to.toDate())

    return rows.map((r) => ({
      timestamp: UnixTime.fromDate(r.unix_timestamp),
      configHash: Hash256(r.config_hash),
    }))
  }
}
