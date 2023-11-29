import { Logger } from '@l2beat/backend-tools'
import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { LivenessRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface LivenessRecord {
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  livenessConfigurationId: number
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

  async getAllWithProjectIdAndType(): Promise<
    LivenessRecordWithProjectIdAndType[]
  > {
    const knex = await this.knex()
    const rows = await knex('liveness as l')
      .join(
        'liveness_configuration as c',
        'l.liveness_configuration_id',
        'c.id',
      )
      .select('l.timestamp', 'c.type', 'c.project_id')
    return rows.map(toRecordWithProjectIdAndType)
  }

  async getWithTypeDistinctTimestamp(
    projectId: ProjectId,
  ): Promise<LivenessRecordWithType[]> {
    const knex = await this.knex()
    const rows = await knex('liveness as l')
      .join(
        'liveness_configuration as c',
        'l.liveness_configuration_id',
        'c.id',
      )
      .select('l.timestamp', 'c.type', 'c.project_id')
      .where('c.project_id', projectId.toString())
      .distinct('l.timestamp')

    return rows.map(toRecordWithTimestampAndType)
  }

  async getByProjectIdAndType(
    projectId: ProjectId,
    type: LivenessType,
    since: UnixTime,
  ): Promise<LivenessRecordWithType[]> {
    const knex = await this.knex()
    const rows = await knex('liveness as l')
      .join(
        'liveness_configuration as c',
        'l.liveness_configuration_id',
        'c.id',
      )
      .select('l.timestamp', 'c.type', 'c.project_id')
      .where('c.project_id', projectId.toString())
      .andWhere('c.type', type)
      .andWhere('l.timestamp', '>=', since.toDate())
      .distinct('l.timestamp')

    return rows.map(toRecordWithTimestampAndType)
  }

  async addMany(transactions: LivenessRecord[], trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    const rows: LivenessRow[] = transactions.map(toRow)
    await knex.batchInsert('liveness', rows, 10_000)
    return rows.length
  }

  async deleteAfter(
    livenessConfigurationId: number,
    after: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    return knex('liveness')
      .where('liveness_configuration_id', livenessConfigurationId)
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
    livenessConfigurationId: row.liveness_configuration_id,
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

function toRecordWithProjectIdAndType(
  row: LivenessRowWithProjectIdAndType,
): LivenessRecordWithProjectIdAndType {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    projectId: ProjectId(row.project_id),
    type: LivenessType(row.type),
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
