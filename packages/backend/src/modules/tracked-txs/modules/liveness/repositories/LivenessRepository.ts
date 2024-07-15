import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { LivenessRow } from 'knex/types/tables'

import { TrackedTxId } from '@l2beat/shared'
import {
  BaseRepository,
  CheckConvention,
} from '../../../../../peripherals/database/BaseRepository'
import { Database } from '../../../../../peripherals/database/Database'

export interface LivenessRecord {
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  configurationId: TrackedTxId
}

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

  async getByConfigurationIdSince(
    configurationIds: TrackedTxId[],
    since: UnixTime,
  ): Promise<LivenessRecord[]> {
    const knex = await this.knex()

    const rows = await knex('liveness')
      .select('*')
      .whereIn('configuration_id', configurationIds)
      .andWhere('timestamp', '>=', since.toDate())
      .distinctOn('timestamp', 'configuration_id')
      .orderBy('timestamp', 'desc')

    return rows.map(toRecord)
  }

  async getByConfigurationIdUpTo(
    configurationIds: TrackedTxId[],
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const knex = await this.knex()

    const rows = await knex('liveness')
      .select('*')
      .whereIn('configuration_id', configurationIds)
      .andWhere('timestamp', '<', to.toDate())
      .distinctOn('timestamp', 'configuration_id')
      .orderBy('timestamp', 'desc')

    return rows.map(toRecord)
  }

  async getByConfigurationIdWithinTimeRange(
    configurationIds: TrackedTxId[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const knex = await this.knex()
    const rows = await knex('liveness')
      .select('*')
      .whereIn('configuration_id', configurationIds)
      .andWhere('timestamp', '>=', from.toDate())
      .andWhere('timestamp', '<', to.toDate())
      .distinctOn('timestamp', 'configuration_id')
      .orderBy('timestamp', 'desc')

    return rows.map(toRecord)
  }

  async addMany(transactions: LivenessRecord[], trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    const rows: LivenessRow[] = transactions.map(toRow)
    await knex.batchInsert('liveness', rows, 10_000)
    return rows.length
  }

  async deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    return knex('liveness')
      .where('configuration_id', id)
      .andWhere('timestamp', '>=', deleteFromInclusive.toDate())
      .delete()
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('liveness').delete()
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ) {
    const knex = await this.knex()
    return knex('liveness')
      .where('configuration_id', configId)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .delete()
  }

  // #region Status page

  async getUsedConfigsIds(): Promise<string[]> {
    const knex = await this.knex()
    const rows = await knex('liveness').distinct('configuration_id')
    return rows.map((row) => row.configuration_id)
  }

  // #endregion
}

function toRecord(row: LivenessRow): LivenessRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    blockNumber: row.block_number,
    txHash: row.tx_hash,
    configurationId: row.configuration_id,
  }
}

function toRow(record: LivenessRecord): LivenessRow {
  return {
    timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
    tx_hash: record.txHash,
    configuration_id: record.configurationId.toString(),
  }
}
