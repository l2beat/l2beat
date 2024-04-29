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
  totalGasUsed: number
  calldataGasUsed: number
  blobsGasUsed: number | null
  computeGasUsed: number
  overheadGasUsed: number
}

export class AggregatedL2CostsRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<AggregatedL2CostsRepository>>(this)
  }

  async getAll() {
    const knex = await this.knex()
    const rows = await knex('aggregated_l2_costs')
    return rows.map(toRecord)
  }

  async addMany(records: AggregatedL2CostsRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex.batchInsert('aggregated_l2_costs', rows, 10_000)
    return rows.length
  }

  async deleteFrom(from: UnixTime) {
    const knex = await this.knex()
    return await knex('aggregated_l2_costs')
      .where('timestamp', '>=', from.toDate())
      .delete()
  }
}

function toRow(record: AggregatedL2CostsRecord): AggregatedL2CostsRow {
  return {
    timestamp: record.timestamp.toDate(),
    project_id: record.projectId,
    total_gas_used: record.totalGasUsed,
    calldata_gas_used: record.calldataGasUsed,
    blobs_gas_used: record.blobsGasUsed,
    compute_gas_used: record.computeGasUsed,
    overhead_gas_used: record.overheadGasUsed,
  }
}

function toRecord(row: AggregatedL2CostsRow): AggregatedL2CostsRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    projectId: ProjectId(row.project_id),
    totalGasUsed: row.total_gas_used,
    calldataGasUsed: row.calldata_gas_used,
    blobsGasUsed: row.blobs_gas_used,
    computeGasUsed: row.compute_gas_used,
    overheadGasUsed: row.overhead_gas_used,
  }
}
