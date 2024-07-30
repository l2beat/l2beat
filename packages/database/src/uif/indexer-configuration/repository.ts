import { BaseRepository } from '../../BaseRepository'
import {
  IndexerConfigurationRecord,
  toRecord,
  toRecordWithoutIndexerId,
  toRow,
} from './entity'
import { selectIndexerConfiguration } from './select'

export class IndexerConfigurationRepository extends BaseRepository {
  async upsertMany(record: IndexerConfigurationRecord[]): Promise<number> {
    if (record.length === 0) return 0

    const rows = record.map(toRow)
    await this.batch(rows, 5_000, async (batch) => {
      await this.db
        .insertInto('public.indexer_configurations')
        .values(batch)
        .onConflict((cb) =>
          cb.column('id').doUpdateSet((eb) => ({
            id: eb.ref('excluded.id'),
            indexer_id: eb.ref('excluded.indexer_id'),
            properties: eb.ref('excluded.properties'),
            current_height: eb.ref('excluded.current_height'),
            min_height: eb.ref('excluded.min_height'),
            max_height: eb.ref('excluded.max_height'),
          })),
        )
        .execute()
    })
    return record.length
  }

  async addMany(record: IndexerConfigurationRecord[]) {
    const rows = record.map(toRow)

    await this.batch(rows, 5_000, async (batch) => {
      await this.db
        .insertInto('public.indexer_configurations')
        .values(batch)
        .execute()
    })
  }

  async getByIndexerId(
    indexerId: string,
  ): Promise<IndexerConfigurationRecord[]> {
    const rows = await this.db
      .selectFrom('public.indexer_configurations')
      .select(selectIndexerConfiguration)
      .where('indexer_id', '=', indexerId)
      .execute()
    return rows.map(toRecord)
  }

  async getConfigurationsWithoutIndexerId(indexerId: string) {
    const rows = await this.db
      .selectFrom('public.indexer_configurations')
      .select([
        'id',
        'max_height',
        'min_height',
        'current_height',
        'properties',
      ])
      .where('indexer_id', '=', indexerId)
      .execute()

    return rows.map(toRecordWithoutIndexerId)
  }

  async getByConfigurationIds(configurationIds: string[]) {
    if (configurationIds.length === 0) return []

    const rows = await this.db
      .selectFrom('public.indexer_configurations')
      .select(selectIndexerConfiguration)
      .where('id', 'in', configurationIds)
      .execute()
    return rows.map(toRecord)
  }

  async getIdsByIndexer(indexerId: string): Promise<string[]> {
    const rows = await this.db
      .selectFrom('public.indexer_configurations')
      .select('id')
      .where('indexer_id', '=', indexerId)
      .execute()
    return rows.map((r) => r.id)
  }

  async updateCurrentHeights(
    indexerId: string,
    currentHeight: number | null,
  ): Promise<void> {
    await this.db
      .updateTable('public.indexer_configurations')
      .set('current_height', currentHeight)
      .where('indexer_id', '=', indexerId)
      .where('min_height', '<=', currentHeight)
      .where((eb) =>
        eb.or([
          eb('max_height', 'is', null),
          eb('max_height', '>=', currentHeight),
        ]),
      )
      .where((eb) =>
        eb.or([
          eb('current_height', 'is', null),
          eb('current_height', '<', currentHeight),
        ]),
      )
      .execute()
  }

  async deleteConfigurations(
    indexerId: string,
    ids: string[],
  ): Promise<number> {
    if (ids.length === 0) return 0

    await this.batch(ids, 10_000, async (batch) => {
      await this.db
        .deleteFrom('public.indexer_configurations')
        .where('indexer_id', '=', indexerId)
        .where('id', 'in', batch)
        .executeTakeFirst()
    })

    return Number(ids.length)
  }

  async getAll(): Promise<IndexerConfigurationRecord[]> {
    const rows = await this.db
      .selectFrom('public.indexer_configurations')
      .select(selectIndexerConfiguration)
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.indexer_configurations')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
