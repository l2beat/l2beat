import { Logger } from '@l2beat/backend-tools'
import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { LivenessRow } from 'knex/types/tables'

import { LivenessId } from '../../core/liveness/types/LivenessId'
import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface LivenessRecord {
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  livenessId: LivenessId
}

export interface LivenessRecordWithProjectIdAndType {
  timestamp: UnixTime
  projectId: ProjectId
  type: LivenessType
}

export interface LivenessRecordWithType {
  timestamp: UnixTime
  type: LivenessType
}
export interface LivenessTransactionsRecordWithType {
  timestamp: UnixTime
  txHash: string
  type: LivenessType
}

export interface LivenessRowWithProjectIdAndType {
  timestamp: Date
  project_id: string
  type: string
}
export interface LivenessTransactionRowWithAndType {
  timestamp: Date
  type: string
  tx_hash: string
}

// TODO: add index when we will write controller
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

  async getWithTypeDistinctTimestamp(
    projectId: ProjectId,
  ): Promise<LivenessRecordWithType[]> {
    const knex = await this.knex()
    const rows = await knex('liveness as l')
      .join('liveness_configuration as c', 'l.liveness_id', 'c.id')
      .select('l.timestamp', 'c.type', 'c.project_id')
      .where('c.project_id', projectId.toString())
      .distinct('l.timestamp')
      .orderBy('l.timestamp', 'desc')

    return rows.map(toRecordWithTimestampAndType)
  }

  async getTransactionWithTypeDistinctTimestamp(
    projectId: ProjectId,
    since: UnixTime,
  ): Promise<LivenessTransactionsRecordWithType[]> {
    const knex = await this.knex()
    const rows = await knex('liveness as l')
      .join('liveness_configuration as c', 'l.liveness_id', 'c.id')
      .select('l.timestamp', 'c.type', 'l.tx_hash', 'c.project_id')
      .where('c.project_id', projectId.toString())
      .andWhere('l.timestamp', '>=', since.toDate())
      .distinct('l.timestamp')
      .orderBy('l.timestamp', 'desc')

    return rows.map(toTransactionRecordWithTimestamp)
  }

  async getByProjectIdAndType(
    projectId: ProjectId,
    type: LivenessType,
    since: UnixTime,
  ): Promise<LivenessRecordWithType[]> {
    const knex = await this.knex()
    const rows = await knex('liveness as l')
      .join('liveness_configuration as c', 'l.liveness_id', 'c.id')
      .select('l.timestamp', 'c.type', 'c.project_id')
      .where('c.project_id', projectId.toString())
      .andWhere('c.type', type)
      .andWhere('l.timestamp', '>=', since.toDate())
      .distinct('l.timestamp')
      .orderBy('l.timestamp', 'desc')

    return rows.map(toRecordWithTimestampAndType)
  }

  async addMany(transactions: LivenessRecord[], trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    const rows: LivenessRow[] = transactions.map(toRow)
    await knex.batchInsert('liveness', rows, 10_000)
    return rows.length
  }

  async deleteAfter(
    livenessId: LivenessId,
    after: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    return knex('liveness')
      .where('liveness_id', livenessId)
      .andWhere('timestamp', '>', after.toDate())
      .delete()
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
    livenessId: LivenessId.unsafe(row.liveness_id),
  }
}

function toRecordWithTimestampAndType(
  row: LivenessRowWithProjectIdAndType,
): Omit<LivenessRecordWithProjectIdAndType, 'projectId'> {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    type: LivenessType(row.type),
  }
}
function toTransactionRecordWithTimestamp(
  row: LivenessTransactionRowWithAndType,
): LivenessTransactionsRecordWithType {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    type: LivenessType(row.type),
    txHash: row.tx_hash,
  }
}

function toRow(record: LivenessRecord): LivenessRow {
  return {
    timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
    tx_hash: record.txHash,
    liveness_id: record.livenessId.toString(),
  }
}
