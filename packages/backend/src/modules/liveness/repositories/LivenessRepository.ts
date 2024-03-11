import { Logger } from '@l2beat/backend-tools'
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
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'
import { TrackedTxId } from '../../tracked-txs/types/TrackedTxId'

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
   * Searches for the transaction with the closest timestamp to "target", but no older than "floor".
   * The search is inclusive of "target" and exclusive of "floor".
   *
   * @param projectId Filter only transactions for a specific project.
   * @param subtype Filter only transactions of a specific subtype.
   * @param targetTimestamp Query will try to find the closest or equal timestamp to target, but no older than floor.
   * @param floorTimestamp The oldest timestamp search can go to.
   * @returns An object containing the transaction hash and timestamp if found, otherwise undefined.
   */
  async findTransactionWithinTimeRange(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    targetTimestamp: UnixTime,
    floorTimestamp: UnixTime,
  ): Promise<{ txHash: string; timestamp: UnixTime } | undefined> {
    const knex = await this.knex()

    const rows = await knex('liveness as l')
      .join('tracked_txs_configs as c', 'l.tracked_tx_id', 'c.id')
      .select('l.tx_hash', 'l.timestamp')
      .where('c.project_id', projectId.toString())
      .andWhere('c.subtype', subtype.toString())
      .andWhere('l.timestamp', '<=', targetTimestamp.toDate())
      .andWhere('l.timestamp', '>', floorTimestamp.toDate())
      .orderBy('l.timestamp', 'desc')
      .distinct('l.tx_hash')
      .limit(1)

    if (rows.length === 0) {
      return undefined
    }

    return rows.map(toRecordWithTxHashAndTimestamp)[0]
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

  async deleteAfter(id: TrackedTxId, after: UnixTime, trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    return knex('liveness')
      .where('tracked_tx_id', id)
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

function toRecordWithTxHashAndTimestamp(row: {
  tx_hash: string
  timestamp: Date
}): { txHash: string; timestamp: UnixTime } {
  return { txHash: row.tx_hash, timestamp: UnixTime.fromDate(row.timestamp) }
}

function toRow(record: LivenessRecord): LivenessRow {
  return {
    timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
    tx_hash: record.txHash,
    tracked_tx_id: record.trackedTxId.toString(),
  }
}
