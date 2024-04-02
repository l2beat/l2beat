import { assert, Logger } from '@l2beat/backend-tools'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { LivenessRow } from 'knex/types/tables'

import {
  BaseRepository,
  CheckConvention,
} from '../../../../../peripherals/database/BaseRepository'
import { Database } from '../../../../../peripherals/database/Database'
import { TrackedTxId } from '../../../types/TrackedTxId'

export interface LivenessRecord {
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  trackedTxId: TrackedTxId
}

export interface LivenessRecordWithProjectIdAndSubtype {
  timestamp: UnixTime
  projectId: ProjectId
  subtype: TrackedTxsConfigSubtype
}

export interface LivenessRecordWithSubtype {
  timestamp: UnixTime
  subtype: TrackedTxsConfigSubtype
}

export interface LivenessTransactionsRecordWithSubtype {
  timestamp: UnixTime
  txHash: string
  subtype: TrackedTxsConfigSubtype
}

export interface LivenessRowWithProjectIdAndSubtype {
  timestamp: Date
  project_id: string
  subtype: string
}

export interface LivenessTransactionRowWithAndSubtype {
  timestamp: Date
  subtype: string
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

  async getWithSubtypeDistinctTimestamp(
    projectId: ProjectId,
  ): Promise<LivenessRecordWithSubtype[]> {
    const knex = await this.knex()
    const rows = await knex('liveness as l')
      .join('tracked_txs_configs as c', 'l.tracked_tx_id', 'c.id')
      .select('l.timestamp', 'c.subtype', 'c.project_id')
      .where('c.project_id', projectId.toString())
      .distinct('l.timestamp')
      .orderBy('l.timestamp', 'desc')

    return rows.map(toRecordWithTimestampAndSubtype)
  }

  /**
   *
   * @param projectId Filter only transactions for a specific project.
   * @param subtype Filter only transactions of a specific subtype.
   * @param from Lower bound timestamp, inclusive.
   * @param to Upper bound timestamp, exclusive.
   * @returns An array of transactions that fall within the specified time range.
   */
  async getTransactionsWithinTimeRange(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    assert(from.toNumber() < to.toNumber(), 'From must be less than to')
    const knex = await this.knex()
    const rows = await knex('liveness as l')
      .join('tracked_txs_configs as c', 'l.tracked_tx_id', 'c.id')
      .select('l.timestamp', 'l.block_number', 'l.tx_hash', 'l.tracked_tx_id')
      .where('c.project_id', projectId.toString())
      .andWhere('c.subtype', subtype.toString())
      .andWhere('l.timestamp', '>=', from.toDate())
      .andWhere('l.timestamp', '<', to.toDate())
      .orderBy('l.timestamp', 'asc')

    return rows.map(toRecord)
  }

  async getTransactionWithSubtypeDistinctTimestamp(
    projectId: ProjectId,
    since: UnixTime,
  ): Promise<LivenessTransactionsRecordWithSubtype[]> {
    const knex = await this.knex()
    const rows = await knex('liveness as l')
      .join('tracked_txs_configs as c', 'l.tracked_tx_id', 'c.id')
      .select('l.timestamp', 'c.subtype', 'l.tx_hash', 'c.project_id')
      .where('c.project_id', projectId.toString())
      .andWhere('l.timestamp', '>=', since.toDate())
      .distinct('l.timestamp')
      .orderBy('l.timestamp', 'desc')

    return rows.map(toTransactionRecordWithTimestamp)
  }

  async getByProjectIdAndType(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    since: UnixTime,
  ): Promise<LivenessRecordWithSubtype[]> {
    const knex = await this.knex()
    const rows = await knex('liveness as l')
      .join('tracked_txs_configs as c', 'l.tracked_tx_id', 'c.id')
      .select('l.timestamp', 'c.subtype', 'c.project_id')
      .where('c.project_id', projectId.toString())
      .andWhere('c.subtype', subtype)
      .andWhere('l.timestamp', '>=', since.toDate())
      .distinct('l.timestamp')
      .orderBy('l.timestamp', 'desc')

    return rows.map(toRecordWithTimestampAndSubtype)
  }

  async addMany(transactions: LivenessRecord[], trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    const rows: LivenessRow[] = transactions.map(toRow)
    await knex.batchInsert('liveness', rows, 10_000)
    return rows.length
  }

  async deleteFrom(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    return knex('liveness')
      .where('tracked_tx_id', id)
      .andWhere('timestamp', '>=', deleteFromInclusive.toDate())
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
    trackedTxId: TrackedTxId.unsafe(row.tracked_tx_id),
  }
}

function toRecordWithTimestampAndSubtype(
  row: LivenessRowWithProjectIdAndSubtype,
): Omit<LivenessRecordWithProjectIdAndSubtype, 'projectId'> {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    subtype: TrackedTxsConfigSubtype.parse(row.subtype),
  }
}
function toTransactionRecordWithTimestamp(
  row: LivenessTransactionRowWithAndSubtype,
): LivenessTransactionsRecordWithSubtype {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    subtype: TrackedTxsConfigSubtype.parse(row.subtype),
    txHash: row.tx_hash,
  }
}

function toRow(record: LivenessRecord): LivenessRow {
  return {
    timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
    tx_hash: record.txHash,
    tracked_tx_id: record.trackedTxId.toString(),
  }
}
