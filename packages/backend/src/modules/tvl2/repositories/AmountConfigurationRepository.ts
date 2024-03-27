import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'

export interface AmountConfigurationRow {
  id: number
  project_id: string
  indexer_id: string
  chain: string
  address: string
  origin: string
  type: string
  include_in_total: boolean
  escrow_address: string | null
}

export interface AmountConfigurationRecord {
  id: number
  projectId: ProjectId
  indexerId: string
  chain: string
  address: EthereumAddress | 'native'
  origin: 'canonical' | 'external' | 'native'
  type: 'totalSupply' | 'circulatingSupply' | 'escrow'
  includeInTotal: boolean
  escrowAddress?: EthereumAddress
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
    chain: row.chain,
    address: row.address === 'native' ? 'native' : row.address.toString(),
    origin: row.origin,
    type: row.type,
    include_in_total: row.includeInTotal,
    escrow_address: row.escrowAddress?.toString() ?? null,
  }
}

function toRecord(row: AmountConfigurationRow): AmountConfigurationRecord {
  const r: Omit<AmountConfigurationRecord, 'escrowAddress'> = {
    id: row.id,
    projectId: ProjectId(row.project_id),
    indexerId: row.indexer_id,
    chain: row.chain,
    address: row.address === 'native' ? 'native' : EthereumAddress(row.address),
    origin: row.origin as 'canonical' | 'external' | 'native',
    type: row.type as 'totalSupply' | 'circulatingSupply' | 'escrow',
    includeInTotal: row.include_in_total,
  }

  if (row.escrow_address) {
    return {
      ...r,
      escrowAddress: EthereumAddress(row.escrow_address),
    }
  }

  return r
}
