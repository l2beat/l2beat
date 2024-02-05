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

export interface LivenessRowWithProjectIdAndType {
  timestamp: Date
  project_id: string
  type: string
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

  async findTxByProjectIdAndTimestamp(
    projectId: ProjectId,
    from: UnixTime,
    to: UnixTime,
    type: LivenessType,
  ): Promise<{ txHash: string; timestamp: UnixTime } | undefined> {
    const knex = await this.knex()
    const rows = await knex('liveness as l')
      .join('liveness_configuration as c', 'l.liveness_id', 'c.id')
      .select('l.tx_hash', 'l.timestamp')
      .where('c.project_id', projectId.toString())
      .andWhere('c.type', type.toString())
      .andWhere('l.timestamp', '<=', from.toDate())
      .andWhere('l.timestamp', '>', to.toDate())
      .orderBy('l.timestamp', 'desc')
      .distinct('l.tx_hash')
      .limit(1)
    if (rows.length === 0) {
      return undefined
    }

    return rows.map(toRecordWithTxHashAndTimestamp)[0]
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

function toRecordWithTxHashAndTimestamp(row: {
  tx_hash: string
  timestamp: Date
}): Pick<LivenessRecord, 'txHash' | 'timestamp'> {
  return {
    txHash: row.tx_hash,
    timestamp: UnixTime.fromDate(row.timestamp),
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
