import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { LivenessRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface LivenessRecord {
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  livenessConfigurationId: number
}

// TODO: add index when we will write controler
export class LivenessRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<LivenessRepository>>(this)
  }

  async getAll(): Promise<LivenessRecord[]> {
    const knex = await this.knex()
    const rows = await knex('liveness')
    return rows.map(toRecord)
  }

  async addMany(transactions: LivenessRecord[]) {
    const rows: LivenessRow[] = transactions.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('liveness', rows, 10_000)
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('liveness').delete()
  }
}

function toRecord(row: LivenessRow): LivenessRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    blockNumber: row.block_number,
    txHash: row.tx_hash,
    livenessConfigurationId: row.liveness_configuration_id,
  }
}

function toRow(record: LivenessRecord): LivenessRow {
  return {
    timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
    tx_hash: record.txHash,
    liveness_configuration_id: record.livenessConfigurationId,
  }
}
