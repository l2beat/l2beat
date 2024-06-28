import { assert, Logger } from '@l2beat/backend-tools'
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
  trackedTxId: TrackedTxId
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

  async getWithProjectIdByTimeRange(
    timeRange: [UnixTime, UnixTime],
  ): Promise<L2CostsRecordWithProjectId[]> {
    const [from, to] = timeRange
    const knex = await this.knex()
    const l2costsRows = await knex('l2_costs')
      .where('timestamp', '>=', from.toDate())
      .andWhere('timestamp', '<=', to.toDate())
      .distinct('tx_hash')
      .select('*')
      .orderBy('timestamp', 'asc')

    if (l2costsRows.length === 0) {
      return []
    }

    const configRows = await knex('indexer_configurations').whereIn(
      'id',
      l2costsRows.map((r) => r.tracked_tx_id),
    )

    const resultRows = l2costsRows.map((l2costsRow) => {
      const config = configRows.find(
        (configRow) => configRow.id === l2costsRow.tracked_tx_id,
      )
      assert(config?.id, `Cannot found config with id: ${config?.id}`)
      return {
        ...l2costsRow,
        project_id: JSON.parse(config.properties).projectId,
      }
    })

    return resultRows.map(toRecordWithProjectId)
  }

  async deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    return knex('l2_costs')
      .where('tracked_tx_id', id)
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
      .where('tracked_tx_id', configId)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .delete()
  }

  // #region Status page

  async getUsedConfigsIds(): Promise<string[]> {
    const knex = await this.knex()
    const rows = await knex('l2_costs').distinct('tracked_tx_id')
    return rows.map((row) => row.tracked_tx_id)
  }

  // #endregion
}

function toRow(record: L2CostsRecord): L2CostsRow {
  return {
    timestamp: record.timestamp.toDate(),
    tx_hash: record.txHash,
    tracked_tx_id: record.trackedTxId.toString(),
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
    trackedTxId: row.tracked_tx_id,
    gasUsed: row.gas_used,
    gasPrice: BigInt(row.gas_price),
    calldataGasUsed: row.calldata_gas_used,
    calldataLength: row.calldata_length,
    blobGasUsed: row.blob_gas_used,
    blobGasPrice: row.blob_gas_price ? BigInt(row.blob_gas_price) : null,
  }
}

function toRecordWithProjectId(
  row: L2CostsRow & { project_id: string },
): L2CostsRecord & { projectId: ProjectId } {
  return {
    ...toRecord(row),
    projectId: ProjectId(row.project_id),
  }
}
