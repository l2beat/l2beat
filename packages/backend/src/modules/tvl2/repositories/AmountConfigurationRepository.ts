import { Logger } from '@l2beat/backend-tools'
// import { Database } from '../../../peripherals/database/Database'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'

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
  until_timestamp_exclusive: Date | null
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
  untilTimestampExclusive?: UnixTime
}

export class AmountConfigurationRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<AmountConfigurationRepository>>(this)
  }

  async addMany(
    records: Omit<AmountConfigurationRecord, 'id'>[],
  ): Promise<number[]> {
    const rows: Omit<AmountConfigurationRow, 'id'>[] = records.map(toRow)

    const knex = await this.knex()
    const inserted = (await knex
      .batchInsert('amounts_configurations', rows, 5_000)
      // @ts-expect-error knex types are wrong
      .returning('id')) as unknown as { id: number }[]

    return inserted.map((row) => row.id)
  }

  async getByIndexerId(
    indexerId: string,
  ): Promise<AmountConfigurationRecord[]> {
    const knex = await this.knex()
    const rows = await knex('amounts_configurations').where(
      'indexer_id',
      indexerId,
    )
    return rows.map(toRecord)
  }

  async setUntilTimestampExclusive(
    id: number,
    untilTimestampExclusive: UnixTime | undefined,
  ): Promise<number> {
    const knex = await this.knex()
    return await knex('amounts_configurations')
      .where({ id })
      .update({
        until_timestamp_exclusive: untilTimestampExclusive
          ? untilTimestampExclusive.toDate()
          : null,
      })
  }

  // #region methods used only in tests

  async getAll(): Promise<AmountConfigurationRecord[]> {
    const knex = await this.knex()
    const rows = await knex('amounts_configurations')
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('amounts_configurations').delete()
  }

  // #endregion
}

function toRow(
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
    until_timestamp_exclusive: row.untilTimestampExclusive?.toDate() ?? null,
  }
}

function toRecord(row: AmountConfigurationRow): AmountConfigurationRecord {
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
    ...(row.until_timestamp_exclusive
      ? {
          untilTimestampExclusive: UnixTime.fromDate(
            row.until_timestamp_exclusive,
          ),
        }
      : {}),
  }

  return r
}
