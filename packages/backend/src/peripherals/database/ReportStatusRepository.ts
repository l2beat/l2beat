import { Hash256, Logger, UnixTime } from '@l2beat/shared'

import { Metrics } from '../../Metrics'
import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'
import { NullableDict } from './shared/types'

export interface ReportStatusRecord {
  configHash: Hash256
  timestamp: UnixTime
}

export class ReportStatusRepository extends BaseRepository {
  constructor(database: Database, logger: Logger, metrics: Metrics) {
    super(database, logger, metrics)
    this.autoWrap<CheckConvention<ReportStatusRepository>>(this)
  }

  async getByConfigHash(configHash: Hash256): Promise<UnixTime[]> {
    const knex = await this.knex()
    const rows = await knex('report_status')
      .where({ config_hash: configHash.toString() })
      .select('unix_timestamp')

    return rows.map((r) => UnixTime.fromDate(r.unix_timestamp))
  }

  async add(record: {
    configHash: Hash256
    timestamp: UnixTime
  }): Promise<Hash256> {
    const knex = await this.knex()
    await knex.transaction(async (trx) => {
      await trx('report_status')
        .where({
          unix_timestamp: record.timestamp.toDate(),
        })
        .delete()
      await trx('report_status').insert({
        config_hash: record.configHash.toString(),
        unix_timestamp: record.timestamp.toDate(),
      })
    })
    return record.configHash
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('report_status').delete()
  }

  async getBetween(
    from: UnixTime,
    to: UnixTime,
  ): Promise<ReportStatusRecord[]> {
    const knex = await this.knex()

    const rows = await knex('report_status')
      .where('unix_timestamp', '>=', from.toDate())
      .andWhere('unix_timestamp', '<=', to.toDate())

    return rows.map((r) => ({
      timestamp: UnixTime.fromDate(r.unix_timestamp),
      configHash: Hash256(r.config_hash),
    }))
  }

  async findLatestTimestamp(): Promise<UnixTime | undefined> {
    const knex = await this.knex()
    // note: we need to provide better types manually here
    const row = (await knex('report_status').max('unix_timestamp').first()) as
      | NullableDict<Date>
      | undefined
    if (!row || row.max === null) {
      return undefined
    }

    return UnixTime.fromDate(row.max)
  }
}
