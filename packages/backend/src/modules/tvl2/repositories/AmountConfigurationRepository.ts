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
  project_id: string
  indexer_id: string
  source: string
  address: string
  origin: string
  type: string
  include_in_total: boolean
  escrow_address: string | null
  since_timestamp_inclusive: Date
  until_timestamp_exclusive: Date | null
}

export interface AmountConfigurationRecord {
  id: number
  projectId: ProjectId
  indexerId: string
  source: string
  address: EthereumAddress | 'native'
  origin: 'canonical' | 'external' | 'native'
  type: 'totalSupply' | 'circulatingSupply' | 'escrow'
  includeInTotal: boolean
  escrowAddress?: EthereumAddress
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
    project_id: row.projectId.toString(),
    indexer_id: row.indexerId,
    source: row.source,
    address: row.address === 'native' ? 'native' : row.address.toString(),
    origin: row.origin,
    type: row.type,
    include_in_total: row.includeInTotal,
    escrow_address: row.escrowAddress?.toString() ?? null,
    since_timestamp_inclusive: row.sinceTimestampInclusive.toDate(),
    until_timestamp_exclusive: row.untilTimestampExclusive?.toDate() ?? null,
  }
}

function toRecord(row: AmountConfigurationRow): AmountConfigurationRecord {
  const r: Omit<AmountConfigurationRecord, 'escrowAddress'> = {
    id: row.id,
    projectId: ProjectId(row.project_id),
    indexerId: row.indexer_id,
    source: row.source,
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
