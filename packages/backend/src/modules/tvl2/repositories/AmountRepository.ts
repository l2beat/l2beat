import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'
import {
  AmountConfigurationRecord,
  AmountConfigurationRow,
} from './AmountConfigurationRepository'

export interface AmountRow {
  configuration_id: number
  timestamp: Date
  amount: string
}

export interface AmountRecord {
  configurationId: number
  timestamp: UnixTime
  amount: bigint
}

export interface AmountWithMetadata
  extends AmountRecord,
    Omit<AmountConfigurationRecord, 'id'> {}

export class AmountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<AmountRepository>>(this)
  }

  async addMany(records: AmountRecord[]) {
    const rows: AmountRow[] = records.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('amounts', rows, 10_000)
    return rows.length
  }

  // POC for the architecture with joins, if it won't be needed - remove it
  async getByIndexerProjectAndTimestamp(
    indexerId: string,
    projectId: ProjectId,
    timestamp: UnixTime,
  ): Promise<AmountRecord[]> {
    const knex = await this.knex()

    const subquery = knex
      .select('id')
      .from('amounts_configurations')
      .where('indexer_id', indexerId)
      .where('project_id', projectId)

    const rows = await knex
      .select('*')
      .from('amounts')
      .whereIn('configuration_id', subquery)
      .where('timestamp', timestamp.toDate())
      .join('amounts_configurations', {
        'amounts.configuration_id': 'amounts_configurations.id',
      })

    return rows.map(toRecordWithMetadata)
  }

  async deleteAfterExclusiveByIndexerId(
    indexerId: string,
    timestamp: UnixTime,
  ) {
    const knex = await this.knex()

    const subquery = knex
      .select('id')
      .from('amounts_configurations')
      .where('indexer_id', indexerId)

    return await knex('amounts')
      .whereIn('configuration_id', subquery)
      .where('timestamp', '>', timestamp.toDate())
      .delete()
  }

  // #region methods used only in tests

  async getAll(): Promise<AmountRecord[]> {
    const knex = await this.knex()
    const rows = await knex('amounts')
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('amounts').delete()
  }

  // #endregion
}

function toRecord(row: AmountRow): AmountRecord {
  return {
    configurationId: row.configuration_id,
    timestamp: UnixTime.fromDate(row.timestamp),
    amount: BigInt(row.amount),
  }
}

function toRow(record: AmountRecord): AmountRow {
  return {
    configuration_id: record.configurationId,
    timestamp: record.timestamp.toDate(),
    amount: record.amount.toString(),
  }
}

function toRecordWithMetadata(
  row: AmountRow & AmountConfigurationRow,
): AmountWithMetadata {
  return {
    configurationId: row.configuration_id,
    timestamp: UnixTime.fromDate(row.timestamp),
    amount: BigInt(row.amount),

    projectId: ProjectId(row.project_id),
    indexerId: row.indexer_id,
    chain: row.chain,
    address: row.address === 'native' ? 'native' : EthereumAddress(row.address),
    ...(row.escrow_address
      ? { escrowAddress: EthereumAddress(row.escrow_address) }
      : {}),
    origin: row.origin as 'canonical' | 'external' | 'native',
    type: row.type as 'totalSupply' | 'circulatingSupply' | 'escrow',
    includeInTotal: row.include_in_total,
    sinceTimestampInclusive: UnixTime.fromDate(row.since_timestamp_inclusive),
    ...(row.until_timestamp_exclusive
      ? {
          untilTimestampExclusive: UnixTime.fromDate(
            row.until_timestamp_exclusive,
          ),
        }
      : {}),
  }
}
