import { Logger } from '@l2beat/backend-tools'
import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { LivenessRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface LivenessRecord {
  projectId: ProjectId
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  type: LivenessType
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
    return await knex('liveness').delete()
  }
}

function toRecord(row: LivenessRow): LivenessRecord {
  return {
    projectId: ProjectId(row.project_id),
    timestamp: UnixTime.fromDate(row.timestamp),
    blockNumber: row.block_number,
    txHash: row.tx_hash,
    type: LivenessType(row.type),
  }
}

function toRow(record: LivenessRecord): LivenessRow {
  return {
    project_id: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
    tx_hash: record.txHash,
    type: record.type,
  }
}
