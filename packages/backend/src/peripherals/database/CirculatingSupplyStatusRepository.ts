import { Logger } from '@l2beat/shared'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface CirculatingSupplyStatusRecord {
  chainId: ChainId
  configHash: Hash256
  timestamp: UnixTime
}

export class CirculatingSupplyStatusRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<CirculatingSupplyStatusRepository>>(this)
  }

  async getByConfigHash(
    chainId: ChainId,
    configHash: Hash256,
  ): Promise<UnixTime[]> {
    const knex = await this.knex()
    const rows = await knex('circulating_supplies_status')
      .where({ config_hash: configHash.toString(), chain_id: Number(chainId) })
      .select('unix_timestamp')

    return rows.map((r) => UnixTime.fromDate(r.unix_timestamp))
  }

  async add(record: CirculatingSupplyStatusRecord): Promise<string> {
    const knex = await this.knex()
    await knex.transaction(async (trx) => {
      await trx('circulating_supplies_status')
        .where({
          chain_id: Number(record.chainId),
          unix_timestamp: record.timestamp.toDate(),
        })
        .delete()
      await trx('circulating_supplies_status').insert({
        chain_id: Number(record.chainId),
        config_hash: record.configHash.toString(),
        unix_timestamp: record.timestamp.toDate(),
      })
    })

    return `[chainId | ${record.chainId.toString()}]: ${record.configHash.toString()}`
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('circulating_supplies_status').delete()
  }

  async getBetween(
    chainId: ChainId,
    from: UnixTime,
    to: UnixTime,
  ): Promise<CirculatingSupplyStatusRecord[]> {
    const knex = await this.knex()

    const rows = await knex('circulating_supplies_status')
      .where({ chain_id: Number(chainId) })
      .andWhere('unix_timestamp', '>=', from.toDate())
      .andWhere('unix_timestamp', '<=', to.toDate())

    return rows.map((r) => ({
      timestamp: UnixTime.fromDate(r.unix_timestamp),
      configHash: Hash256(r.config_hash),
      chainId: ChainId(r.chain_id),
    }))
  }
}
