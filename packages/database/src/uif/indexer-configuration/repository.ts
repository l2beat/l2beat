import { BaseRepository } from '../../BaseRepository'
import {
  type IndexerConfigurationRecord,
  toRecord,
  toRecordWithoutIndexerId,
  toRow,
} from './entity'

export class IndexerConfigurationRepository extends BaseRepository {
  async upsertMany(record: IndexerConfigurationRecord[]): Promise<number> {
    if (record.length === 0) return 0

    const rows = record.map(toRow)
    await this.batch(rows, 5_000, async (batch) => {
      await this.db
        .insertInto('IndexerConfiguration')
        .values(batch)
        .onConflict((cb) =>
          cb.column('id').doUpdateSet((eb) => ({
            id: eb.ref('excluded.id'),
            indexerId: eb.ref('excluded.indexerId'),
            properties: eb.ref('excluded.properties'),
            currentHeight: eb.ref('excluded.currentHeight'),
            minHeight: eb.ref('excluded.minHeight'),
            maxHeight: eb.ref('excluded.maxHeight'),
          })),
        )
        .execute()
    })
    return record.length
  }

  async insertMany(records: IndexerConfigurationRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 5_000, async (batch) => {
      await this.db.insertInto('IndexerConfiguration').values(batch).execute()
    })
    return records.length
  }

  async getByIndexerId(
    indexerId: string,
  ): Promise<IndexerConfigurationRecord[]> {
    const rows = await this.db
      .selectFrom('IndexerConfiguration')
      .selectAll()
      .where('indexerId', '=', indexerId)
      .execute()
    return rows.map(toRecord)
  }

  async getByIndexerIds(indexerIds: string[]) {
    if (indexerIds.length === 0) return []

    const rows = await this.db
      .selectFrom('IndexerConfiguration')
      .selectAll()
      .where('indexerId', 'in', indexerIds)
      .execute()
    return rows.map(toRecord)
  }

  async getConfigurationsWithoutIndexerId(
    indexerId: string,
  ): Promise<Omit<IndexerConfigurationRecord, 'indexerId'>[]> {
    const rows = await this.db
      .selectFrom('IndexerConfiguration')
      .select(['id', 'maxHeight', 'minHeight', 'currentHeight', 'properties'])
      .where('indexerId', '=', indexerId)
      .execute()
    return rows.map(toRecordWithoutIndexerId)
  }

  /** WARNING: Use only if you are sure there will be a reasonable amount of configurations */
  async getByConfigurationIds(configurationIds: string[]) {
    if (configurationIds.length === 0) return []

    const rows = await this.db
      .selectFrom('IndexerConfiguration')
      .selectAll()
      .where('id', 'in', configurationIds)
      .execute()
    return rows.map(toRecord)
  }

  async getIdsByIndexer(indexerId: string): Promise<string[]> {
    const rows = await this.db
      .selectFrom('IndexerConfiguration')
      .select('id')
      .where('indexerId', '=', indexerId)
      .execute()
    return rows.map((r) => r.id)
  }

  async updateCurrentHeights(
    indexerId: string,
    currentHeight: number | null,
  ): Promise<void> {
    await this.db
      .updateTable('IndexerConfiguration')
      .set('currentHeight', currentHeight)
      .where('indexerId', '=', indexerId)
      .where('minHeight', '<=', currentHeight)
      .where((eb) =>
        eb.or([
          eb('maxHeight', 'is', null),
          eb('maxHeight', '>=', currentHeight),
        ]),
      )
      .where((eb) =>
        eb.or([
          eb('currentHeight', 'is', null),
          eb('currentHeight', '<', currentHeight),
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
        .deleteFrom('IndexerConfiguration')
        .where('indexerId', '=', indexerId)
        .where('id', 'in', batch)
        .executeTakeFirst()
    })

    return Number(ids.length)
  }

  async getAll(): Promise<IndexerConfigurationRecord[]> {
    const rows = await this.db
      .selectFrom('IndexerConfiguration')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('IndexerConfiguration')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
