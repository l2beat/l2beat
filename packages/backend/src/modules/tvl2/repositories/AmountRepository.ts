import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { SavedConfiguration } from '@l2beat/uif'

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'

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

export interface AmountConfigurationRow {
  id: number
  indexer_id: string
  project_id: string
  chain: string
  address: string
  escrow_address: string | null
  origin: string
  type: string
  include_in_total: boolean
  since_timestamp_inclusive: Date
  until_timestamp_inclusive: Date | null
  last_synced_timestamp: Date | null
}

export interface AmountConfigurationRecord {
  id: number
  indexerId: string
  projectId: ProjectId
  chain: string
  address: EthereumAddress | 'native'
  escrowAddress?: EthereumAddress
  origin: 'canonical' | 'external' | 'native'
  type: 'totalSupply' | 'circulatingSupply' | 'escrow'
  includeInTotal: boolean
  sinceTimestampInclusive: UnixTime
  untilTimestampInclusive?: UnixTime
  lastSyncedTimestamp?: UnixTime
}

export interface AmountWithMetadata
  extends AmountRecord,
    Omit<AmountConfigurationRecord, 'id'> {}

export class AmountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<AmountRepository>>(this)
  }

  // #region amounts
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

  async deleteInRangeByConfigurationId(
    configurationId: number,
    from: UnixTime,
    to: UnixTime,
  ) {
    const knex = await this.knex()
    return await knex('amounts')
      .where('configuration_id', configurationId)
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .delete()
  }

  // #endregion

  // #region configurations

  async addManyConfigurations(
    records: Omit<AmountConfigurationRecord, 'id'>[],
  ): Promise<number[]> {
    const rows: Omit<AmountConfigurationRow, 'id'>[] =
      records.map(toConfigurationRow)

    const knex = await this.knex()
    const inserted = (await knex
      .batchInsert('amounts_configurations', rows, 5_000)
      // @ts-expect-error knex types are wrong
      .returning('id')) as unknown as { id: number }[]

    return inserted.map((row) => row.id)
  }

  async getConfigurationsByIndexerId(
    indexerId: string,
  ): Promise<SavedConfiguration<AmountConfigurationRecord>[]> {
    const knex = await this.knex()
    const rows = await knex('amounts_configurations').where(
      'indexer_id',
      indexerId,
    )
    return rows.map(toConfigurationRecord).map(toSavedConfiguration)
  }

  async setUntilTimestampInclusive(
    id: number,
    untilTimestampInclusive: UnixTime | undefined,
  ): Promise<number> {
    const knex = await this.knex()
    return await knex('amounts_configurations')
      .where({ id })
      .update({
        until_timestamp_inclusive: untilTimestampInclusive
          ? untilTimestampInclusive.toDate()
          : null,
      })
  }

  // #endregion

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

  async getAllConfigurations(): Promise<AmountConfigurationRecord[]> {
    const knex = await this.knex()
    const rows = await knex('amounts_configurations')
    return rows.map(toConfigurationRecord)
  }

  async deleteAllConfigurations() {
    const knex = await this.knex()
    return knex('amounts_configurations').delete()
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
  type OptionalId = Omit<AmountConfigurationRecord, 'id'> & {
    id?: number
  }
  const configurationRecord: OptionalId = toConfigurationRecord(row)
  delete configurationRecord.id

  return {
    configurationId: row.configuration_id,
    timestamp: UnixTime.fromDate(row.timestamp),
    amount: BigInt(row.amount),
    ...configurationRecord,
  }
}

function toConfigurationRow(
  row: Omit<AmountConfigurationRecord, 'id'>,
): Omit<AmountConfigurationRow, 'id'> {
  return {
    indexer_id: row.indexerId,
    project_id: row.projectId.toString(),
    chain: row.chain,
    address: row.address === 'native' ? 'native' : row.address.toString(),
    escrow_address: row.escrowAddress?.toString() ?? null,
    origin: row.origin,
    type: row.type,
    include_in_total: row.includeInTotal,
    since_timestamp_inclusive: row.sinceTimestampInclusive.toDate(),
    until_timestamp_inclusive: row.untilTimestampInclusive?.toDate() ?? null,
    last_synced_timestamp: row.lastSyncedTimestamp?.toDate() ?? null,
  }
}

function toConfigurationRecord(
  row: AmountConfigurationRow,
): AmountConfigurationRecord {
  const r: Omit<AmountConfigurationRecord, 'escrowAddress'> = {
    id: row.id,
    indexerId: row.indexer_id,
    projectId: ProjectId(row.project_id),
    chain: row.chain,
    address: row.address === 'native' ? 'native' : EthereumAddress(row.address),
    ...(row.escrow_address
      ? { escrowAddress: EthereumAddress(row.escrow_address) }
      : {}),
    origin: row.origin as 'canonical' | 'external' | 'native',
    type: row.type as 'totalSupply' | 'circulatingSupply' | 'escrow',
    includeInTotal: row.include_in_total,
    sinceTimestampInclusive: UnixTime.fromDate(row.since_timestamp_inclusive),
    ...(row.until_timestamp_inclusive
      ? {
          untilTimestampInclusive: UnixTime.fromDate(
            row.until_timestamp_inclusive,
          ),
        }
      : {}),
    ...(row.last_synced_timestamp
      ? {
          lastSyncedTimestamp: UnixTime.fromDate(row.last_synced_timestamp),
        }
      : {}),
  }

  return r
}

function toSavedConfiguration(
  record: AmountConfigurationRecord,
): SavedConfiguration<AmountConfigurationRecord> {
  return {
    id: record.id.toString(),
    properties: record,
    minHeight: record.sinceTimestampInclusive.toNumber(),
    maxHeight: record.untilTimestampInclusive?.toNumber() ?? null,
    currentHeight: record.lastSyncedTimestamp?.toNumber() ?? null,
  }
}
