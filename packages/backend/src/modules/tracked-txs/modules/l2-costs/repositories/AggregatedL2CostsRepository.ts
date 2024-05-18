import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { AggregatedL2CostsRow } from 'knex/types/tables'

import {
  BaseRepository,
  CheckConvention,
} from '../../../../../peripherals/database/BaseRepository'
import { Database } from '../../../../../peripherals/database/Database'

export interface AggregatedL2CostsRecord {
  timestamp: UnixTime
  projectId: ProjectId
  totalGas: number
  totalGasEth: number
  totalGasUsd: number
  blobsGas: number | null
  blobsGasEth: number | null
  blobsGasUsd: number | null
  calldataGas: number
  calldataGasEth: number
  calldataGasUsd: number
  computeGas: number
  computeGasEth: number
  computeGasUsd: number
  overheadGas: number
  overheadGasEth: number
  overheadGasUsd: number
}

export class AggregatedL2CostsRepository extends BaseRepository {
  private readonly TABLE_NAME = 'aggregated_l2_costs'

  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<AggregatedL2CostsRepository>>(this)
  }

  async getAll() {
    const knex = await this.knex()
    const rows = await knex(this.TABLE_NAME)
    return rows.map(toRecord)
  }

  async addMany(records: AggregatedL2CostsRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex.batchInsert(this.TABLE_NAME, rows, 10_000)
    return rows.length
  }

  async deleteAfter(from: UnixTime) {
    const knex = await this.knex()
    return await knex(this.TABLE_NAME)
      .where('timestamp', '>', from.toDate())
      .delete()
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex(this.TABLE_NAME).delete()
  }

  async getByProjectAndTimeRange(
    projectId: ProjectId,
    timeRange: [UnixTime, UnixTime],
  ): Promise<AggregatedL2CostsRecord[]> {
    const [from, to] = timeRange
    const knex = await this.knex()
    const rows = await knex(this.TABLE_NAME)
      .where('project_id', projectId)
      .andWhere('timestamp', '>=', from.toDate())
      .andWhere('timestamp', '<', to.toDate())
      .orderBy('timestamp', 'asc')
    return rows.map(toRecord)
  }
}

function toRow(record: AggregatedL2CostsRecord): AggregatedL2CostsRow {
  return {
    timestamp: record.timestamp.toDate(),
    project_id: record.projectId,
    total_gas: record.totalGas,
    total_gas_eth: record.totalGasEth,
    total_gas_usd: record.totalGasUsd,
    blobs_gas: record.blobsGas,
    blobs_gas_eth: record.blobsGasEth,
    blobs_gas_usd: record.blobsGasUsd,
    calldata_gas: record.calldataGas,
    calldata_gas_eth: record.calldataGasEth,
    calldata_gas_usd: record.calldataGasUsd,
    compute_gas: record.computeGas,
    compute_gas_eth: record.computeGasEth,
    compute_gas_usd: record.computeGasUsd,
    overhead_gas: record.overheadGas,
    overhead_gas_eth: record.overheadGasEth,
    overhead_gas_usd: record.overheadGasUsd,
  }
}

function toRecord(row: AggregatedL2CostsRow): AggregatedL2CostsRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    projectId: ProjectId(row.project_id),
    totalGas: row.total_gas,
    totalGasEth: row.total_gas_eth,
    totalGasUsd: row.total_gas_usd,
    blobsGas: row.blobs_gas,
    blobsGasEth: row.blobs_gas_eth,
    blobsGasUsd: row.blobs_gas_usd,
    calldataGas: row.calldata_gas,
    calldataGasEth: row.calldata_gas_eth,
    calldataGasUsd: row.calldata_gas_usd,
    computeGas: row.compute_gas,
    computeGasEth: row.compute_gas_eth,
    computeGasUsd: row.compute_gas_usd,
    overheadGas: row.overhead_gas,
    overheadGasEth: row.overhead_gas_eth,
    overheadGasUsd: row.overhead_gas_usd,
  }
}
