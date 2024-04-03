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

  // TODO: update convention and change name
  async addOrUpdateMany(
    records: (Omit<AmountConfigurationRecord, 'id'> & { id?: number })[],
  ): Promise<number[]> {
    const rows: (Omit<AmountConfigurationRow, 'id'> & { id?: number })[] =
      records.map(toConfigurationRow)

    const knex = await this.knex()

    const ids: number[] = []

    await knex.transaction(async (trx) => {
      for (let i = 0; i < rows.length; i += 5000) {
        const chunk = rows.slice(i, i + 5000)

        const inserted = await trx('amounts_configurations')
          .insert(chunk)
          .onConflict('id')
          .merge()
          .returning('id')

        ids.push(...inserted.map((row: { id: number }) => row.id))
      }

      return ids
    })

    return ids
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

  async deleteConfigurationsNotInList(indexerId: string, ids: number[]) {
    const knex = await this.knex()
    return await knex('amounts_configurations')
      .where('indexer_id', indexerId)
      .whereNotIn('id', ids)
      .delete()
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
  record: Omit<AmountConfigurationRecord, 'id'> & { id?: number },
): Omit<AmountConfigurationRow, 'id'> & { id?: number } {
  return {
    id: record.id,
    indexer_id: record.indexerId,
    project_id: record.projectId.toString(),
    chain: record.chain,
    address: record.address === 'native' ? 'native' : record.address.toString(),
    escrow_address: record.escrowAddress?.toString() ?? null,
    origin: record.origin,
    type: record.type,
    include_in_total: record.includeInTotal,
    since_timestamp_inclusive: record.sinceTimestampInclusive.toDate(),
    until_timestamp_inclusive: record.untilTimestampInclusive?.toDate() ?? null,
    last_synced_timestamp: record.lastSyncedTimestamp?.toDate() ?? null,
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
