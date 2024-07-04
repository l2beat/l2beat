import { assert, Logger } from '@l2beat/backend-tools'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
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
    const configRows = await knex('indexer_configurations')
    const projectConfigs = configRows
      .map((c) => {
        const properties = JSON.parse(c.properties)

        if (
          properties.projectId === projectId.toString() &&
          properties.type === 'liveness'
        ) {
          return [c.id, properties.subtype]
        }
      })
      .filter(notUndefined) as [string, TrackedTxsConfigSubtype][]

    const configsMap = new Map<string, TrackedTxsConfigSubtype>(projectConfigs)
    const livenessRows = await knex('liveness')
      .select('timestamp', 'configuration_id')
      .whereIn('configuration_id', Array.from(configsMap.keys()))
      .distinct('timestamp')
      .orderBy('timestamp', 'desc')

    const rows = livenessRows.map((row) => {
      const subtype = configsMap.get(row.configuration_id)
      assert(subtype, `Cannot find subtype for ${row.configuration_id}`)
      return {
        timestamp: row.timestamp,
        subtype,
        project_id: projectId,
      }
    })

    return rows.map(toRecordWithTimestampAndSubtype)
  }

  /**
   *
   * @param configurationIds Filter only transactions for a specific configurations.
   * @param from Lower bound timestamp, inclusive.
   * @param to Upper bound timestamp, exclusive.
   * @returns An array of transactions that fall within the specified time range.
   */
  async getTransactionsWithinTimeRangeByConfigurationsIds(
    configurationIds: string[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    assert(from.toNumber() < to.toNumber(), 'From must be less than to')
    const knex = await this.knex()

    const rows = await knex('liveness')
      .select('timestamp', 'block_number', 'tx_hash', 'configuration_id')
      .whereIn('configuration_id', configurationIds)
      .andWhere('timestamp', '>=', from.toDate())
      .andWhere('timestamp', '<', to.toDate())
      .orderBy('timestamp', 'asc')

    return rows.map(toRecord)
  }

  async getTransactionWithSubtypeDistinctTimestamp(
    projectId: ProjectId,
    since: UnixTime,
  ): Promise<LivenessTransactionsRecordWithSubtype[]> {
    const knex = await this.knex()

    const configRows = await knex('indexer_configurations')
    const projectConfigs = configRows
      .map((c) => {
        const properties = JSON.parse(c.properties)

        if (
          properties.projectId === projectId.toString() &&
          properties.type === 'liveness'
        ) {
          return [c.id, properties.subtype]
        }
      })
      .filter(notUndefined) as [string, TrackedTxsConfigSubtype][]

    const configsMap = new Map<string, TrackedTxsConfigSubtype>(projectConfigs)

    const livenessRows = await knex('liveness')
      .select('timestamp', 'configuration_id', 'tx_hash')
      .whereIn('configuration_id', Array.from(configsMap.keys()))
      .andWhere('timestamp', '>=', since.toDate())
      .distinct('timestamp')
      .orderBy('timestamp', 'desc')

    const rows = livenessRows.map((row) => {
      const subtype = configsMap.get(row.configuration_id)
      assert(subtype, `Cannot find subtype for ${row.configuration_id}`)
      return {
        timestamp: row.timestamp,
        subtype,
        project_id: projectId,
        tx_hash: row.tx_hash,
      }
    })

    return rows.map(toTransactionRecordWithTimestamp)
  }

  async getByProjectIdAndType(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    since: UnixTime,
  ): Promise<LivenessRecordWithSubtype[]> {
    const knex = await this.knex()

    const configRows = await knex('indexer_configurations')
    const projectConfigs = configRows
      .map((c) => {
        const properties = JSON.parse(c.properties)

        if (
          properties.projectId === projectId.toString() &&
          properties.subtype === subtype.toString() &&
          properties.type === 'liveness'
        ) {
          return [c.id, properties.subtype]
        }
      })
      .filter(notUndefined) as [string, TrackedTxsConfigSubtype][]

    const configsMap = new Map<string, TrackedTxsConfigSubtype>(projectConfigs)

    const livenessRows = await knex('liveness')
      .select('timestamp', 'configuration_id')
      .whereIn('configuration_id', Array.from(configsMap.keys()))
      .andWhere('timestamp', '>=', since.toDate())
      .distinct('timestamp')
      .orderBy('timestamp', 'desc')

    const rows = livenessRows.map((row) => {
      const subtype = configsMap.get(row.configuration_id)
      assert(subtype, `Cannot find subtype for ${row.configuration_id}`)
      return {
        timestamp: row.timestamp,
        subtype,
        project_id: projectId,
      }
    })

    return rows.map(toRecordWithTimestampAndSubtype)
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
    configuration_id: record.configurationId.toString(),
  }
}
