import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { L2CostsRow } from 'knex/types/tables'

import { TrackedTxId } from '@l2beat/shared'
import {
  BaseRepository,
  CheckConvention,
} from '../../../../../peripherals/database/BaseRepository'
import { Database } from '../../../../../peripherals/database/Database'

export interface L2CostsRecord {
  timestamp: UnixTime
  txHash: string
  configurationId: TrackedTxId
  gasUsed: number
  gasPrice: bigint
  calldataLength: number
  calldataGasUsed: number
  blobGasUsed: number | null
  blobGasPrice: bigint | null
}

export interface L2CostsRecordWithProjectId extends L2CostsRecord {
  projectId: ProjectId
}

export class L2CostsRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<L2CostsRepository>>(this)
  }

  async getAll(): Promise<L2CostsRecord[]> {
    const knex = await this.knex()
    const rows = await knex('l2_costs')
    return rows.map(toRecord)
  }

  async addMany(
    records: L2CostsRecord[],
    trx?: Knex.Transaction,
  ): Promise<number> {
    const knex = await this.knex(trx)
    const rows = records.map(toRow)
    await knex.batchInsert('l2_costs', rows, 1_000)
    return rows.length
  }

  async getByTimeRange(
    timeRange: [UnixTime, UnixTime],
  ): Promise<L2CostsRecord[]> {
    const [from, to] = timeRange
    const knex = await this.knex()
    const rows = await knex('l2_costs')
      .andWhere('timestamp', '>=', from.toDate())
      .andWhere('timestamp', '<=', to.toDate())
      .distinct('tx_hash')
      .select('*')
      .orderBy('timestamp', 'asc')

    return rows.map(toRecord)
  }

  async deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    return knex('l2_costs')
      .where('configuration_id', id)
      .andWhere('timestamp', '>=', deleteFromInclusive.toDate())
      .delete()
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('l2_costs').delete()
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ) {
    const knex = await this.knex()
    return knex('l2_costs')
      .where('configuration_id', configId)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .delete()
  }

  // #region Status page

  async getUsedConfigsIds(): Promise<string[]> {
    const knex = await this.knex()
    const rows = await knex('l2_costs').distinct('configuration_id')
    return rows.map((row) => row.configuration_id)
  }

  // #endregion
}

function toRow(record: L2CostsRecord): L2CostsRow {
  return {
    timestamp: record.timestamp.toDate(),
    tx_hash: record.txHash,
    configuration_id: record.configurationId.toString(),
    gas_used: record.gasUsed,
    gas_price: record.gasPrice.toString(),
    calldata_gas_used: record.calldataGasUsed,
    calldata_length: record.calldataLength,
    blob_gas_used: record.blobGasUsed,
    blob_gas_price: record.blobGasPrice?.toString() ?? null,
  }
}

function toRecord(row: L2CostsRow): L2CostsRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    txHash: row.tx_hash,
    configurationId: row.configuration_id,
    gasUsed: row.gas_used,
    gasPrice: BigInt(row.gas_price),
    calldataGasUsed: row.calldata_gas_used,
    calldataLength: row.calldata_length,
    blobGasUsed: row.blob_gas_used,
    blobGasPrice: row.blob_gas_price ? BigInt(row.blob_gas_price) : null,
  }
}
