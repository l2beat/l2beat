import { Logger } from '@l2beat/backend-tools'
import { AssetId, ChainId, UnixTime } from '@l2beat/shared-pure'
import { CirculatingSupplyRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface CirculatingSupplyRecord {
  timestamp: UnixTime
  circulatingSupply: number
  assetId: AssetId
  chainId: ChainId
}

export interface DataBoundary {
  earliest: UnixTime
  latest: UnixTime
}

export class CirculatingSupplyRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<CirculatingSupplyRepository>>(this)
  }

  async getByTimestamp(
    chainId: ChainId,
    timestamp: UnixTime,
  ): Promise<CirculatingSupplyRecord[]> {
    const knex = await this.knex()
    const rows = await knex('circulating_supplies').where({
      unix_timestamp: timestamp.toDate(),
      chain_id: Number(chainId),
    })

    return rows.map(toRecord)
  }

  async addMany(circulatingSupplies: CirculatingSupplyRecord[]) {
    const rows = circulatingSupplies.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('circulating_supplies', rows, 10_000)

    return rows.length
  }

  async findDataBoundaries(): Promise<Map<AssetId, DataBoundary>> {
    const knex = await this.knex()
    const rows = await knex('circulating_supplies')
      .min('unix_timestamp')
      .max('unix_timestamp')
      .select('asset_id')
      .groupBy('asset_id')

    return new Map(
      rows.map((row) => [
        AssetId(row.asset_id),
        {
          earliest: UnixTime.fromDate(row.min),
          latest: UnixTime.fromDate(row.max),
        },
      ]),
    )
  }

  async getAll(): Promise<CirculatingSupplyRecord[]> {
    const knex = await this.knex()
    const rows = await knex('circulating_supplies')
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('circulating_supplies').delete()
  }
}

function toRecord(row: CirculatingSupplyRow): CirculatingSupplyRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    assetId: AssetId(row.asset_id),
    circulatingSupply: +row.circulating_supply,
    chainId: ChainId(row.chain_id),
  }
}

function toRow(record: CirculatingSupplyRecord): CirculatingSupplyRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    asset_id: record.assetId.toString(),
    circulating_supply: record.circulatingSupply.toString(),
    chain_id: Number(record.chainId),
  }
}
