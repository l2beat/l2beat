import { Logger } from '@l2beat/backend-tools'
import { SavedConfiguration } from '@l2beat/uif'

import {
  BaseRepository,
  CheckConvention,
} from '../../peripherals/database/BaseRepository'
import { Database } from '../../peripherals/database/Database'

export interface IndexerConfigurationRow {
  id: string
  indexer_id: string
  properties: string
  current_height: number | null
  min_height: number
  max_height: number | null
}
export interface IndexerConfigurationRecord {
  id: string
  indexerId: string
  properties: string
  currentHeight: number | null
  minHeight: number
  maxHeight: number | null
}

export class IndexerConfigurationRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<IndexerConfigurationRepository>>(this)
  }

  async getSavedConfigurations(
    indexerId: string,
  ): Promise<SavedConfiguration<string>[]> {
    const knex = await this.knex()

    const rows = await knex('indexer_configurations').where(
      'indexer_id',
      indexerId,
    )
    return rows.map(toRecord)
  }

  async addManySavedConfigurations(
    configurations: SavedConfiguration<string>[],
    indexerId: string,
  ) {
    const knex = await this.knex()

    const rows = configurations.map((record) => toRow(indexerId, record))
    await knex.batchInsert('indexer_configurations', rows, 5_000)

    return rows.length
  }

  async removeSavedConfigurations(
    indexerId: string,
    configurationIds: string[],
  ) {
    const knex = await this.knex()

    return knex('indexer_configurations')
      .where('indexer_id', indexerId)
      .whereIn('id', configurationIds)
      .delete()
  }

  async updateSavedConfigurations(
    indexerId: string,
    configurationIds: string[],
    currentHeight: number | null,
  ) {
    const knex = await this.knex()

    return knex('indexer_configurations')
      .where('indexer_id', indexerId)
      .whereIn('id', configurationIds)
      .update({ current_height: currentHeight })
  }
}

function toRow(
  indexer_id: string,
  record: SavedConfiguration<string>,
): IndexerConfigurationRow {
  return {
    id: record.id,
    indexer_id,
    properties: record.properties,
    current_height: record.currentHeight,
    min_height: record.minHeight,
    max_height: record.maxHeight,
  }
}

function toRecord(row: IndexerConfigurationRow): IndexerConfigurationRecord {
  return {
    id: row.id,
    indexerId: row.indexer_id,
    properties: row.properties,
    currentHeight: row.current_height,
    minHeight: row.min_height,
    maxHeight: row.max_height,
  }
}
