import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { L2CostsRow } from 'knex/types/tables'

import {
  BaseRepository,
  CheckConvention,
} from '../../../../../peripherals/database/BaseRepository'
import { Database } from '../../../../../peripherals/database/Database'
import { TrackedTxId } from '../../../types/TrackedTxId'
import { TransactionData } from '../types/TransactionData'

export interface L2CostsRecord<
  T extends TransactionData['type'] = TransactionData['type'],
> {
  timestamp: UnixTime
  txHash: string
  trackedTxId: TrackedTxId
  data: Extract<TransactionData, { type: T }>
}

export interface L2CostsRecordWithProjectId<
  T extends TransactionData['type'] = TransactionData['type'],
> extends L2CostsRecord<T> {
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
    await knex.batchInsert('l2_costs', rows, 10_000)
    return rows.length
  }

  async getByType<T extends TransactionData['type']>(
    type: T,
  ): Promise<L2CostsRecord<T>[]> {
    const knex = await this.knex()
    const rows = await knex('l2_costs')
      .whereRaw("data->>'type' = ?", [type])
      .orderBy('timestamp', 'desc')
      .select()
    return rows.map((r) => toRecord(r))
  }

  async getWithProjectIdByTimeRange(
    timeRange: [UnixTime, UnixTime],
  ): Promise<L2CostsRecordWithProjectId[]> {
    const [from, to] = timeRange
    const knex = await this.knex()
    const rows = await knex('l2_costs')
      .where('timestamp', '>=', from.toDate())
      .andWhere('timestamp', '<=', to.toDate())
      .join(
        'tracked_txs_configs',
        'l2_costs.tracked_tx_id',
        'tracked_txs_configs.id',
      )
      .select('project_id', 'tracked_tx_id', 'tx_hash', 'timestamp', 'data')
      .orderBy('timestamp', 'asc')
    return rows.map(toRecordWithProjectId)
  }

  async findCountByProjectAndTimeRange(
    projectId: ProjectId,
    timeRange: [UnixTime, UnixTime],
  ): Promise<{ count: number }> {
    const [from, to] = timeRange
    const knex = await this.knex()
    const count = await knex('l2_costs as l')
      .join('tracked_txs_configs as c', 'l.tracked_tx_id', 'c.id')
      .where('c.project_id', projectId)
      .andWhere('l.timestamp', '>=', from.toDate())
      .andWhere('l.timestamp', '<', to.toDate())
      .count('* as count')

    if (count.length === 0) {
      return { count: 0 }
    }
    if (count.length > 1) {
      throw new Error('Expected exactly one row')
    }
    if (typeof count[0].count !== 'string') {
      throw new Error('Expected count to be a string')
    }

    return { count: parseInt(count[0].count) }
  }

  async getByProjectAndTimeRangePaginated(
    projectId: ProjectId,
    timeRange: [UnixTime, UnixTime],
    start: number,
    limit: number,
  ): Promise<L2CostsRecord[]> {
    const [from, to] = timeRange
    const knex = await this.knex()
    const rows = await knex('l2_costs as l')
      .join('tracked_txs_configs as c', 'l.tracked_tx_id', 'c.id')
      .where('c.project_id', projectId)
      .andWhere('l.timestamp', '>=', from.toDate())
      .andWhere('l.timestamp', '<', to.toDate())
      .distinct('l.tx_hash')
      .select('l.timestamp', 'l.tx_hash', 'l.tracked_tx_id', 'l.data')
      .orderBy('l.timestamp', 'asc')
      .offset(start)
      .limit(limit)
    return rows.map(toRecord)
  }

  async deleteFrom(
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
}

function toRow(record: L2CostsRecord): L2CostsRow {
  return {
    timestamp: record.timestamp.toDate(),
    tx_hash: record.txHash,
    tracked_tx_id: record.trackedTxId.toString(),
    data: record.data,
  }
}

function toRecord<T extends TransactionData['type']>(
  row: L2CostsRow,
): L2CostsRecord<T> {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    txHash: row.tx_hash,
    trackedTxId: TrackedTxId.unsafe(row.tracked_tx_id),
    data: row.data as L2CostsRecord<T>['data'],
  }
}

function toRecordWithProjectId(
  row: L2CostsRow & { project_id: string },
): L2CostsRecord & { projectId: ProjectId } {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    txHash: row.tx_hash,
    trackedTxId: TrackedTxId.unsafe(row.tracked_tx_id),
    data: row.data,
    projectId: ProjectId(row.project_id),
  }
}
