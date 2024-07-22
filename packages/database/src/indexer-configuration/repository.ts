import { PostgresDatabase, Transaction } from '../kysely'
import { IndexerConfigurationRecord, toRecord, toRow } from './entity'
import { selectIndexerConfiguration } from './select'

const BATCH_SIZE = 5_000

export class IndexerConfigurationRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdateMany(record: IndexerConfigurationRecord[]) {
    const rows = record.map(toRow)

    await this.db.transaction().execute(async (trx) => {
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        await trx
          .insertInto('public.indexer_configurations')
          .values(rows.slice(i, i + BATCH_SIZE))
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
      }
    })
  }

  async getSavedConfigurations(indexerId: string) {
    const rows = await this.db
      .selectFrom('public.indexer_configurations')
      .select(selectIndexerConfiguration)
      .where('indexer_id', '=', indexerId)
      .execute()

    return rows.map(toRecord)
  }

  async getSavedConfigurationsByIds(configurationIds: string[]) {
    const rows = await this.db
      .selectFrom('public.indexer_configurations')
      .select(selectIndexerConfiguration)
      .where('id', 'in', configurationIds)
      .execute()

    return rows.map(toRecord)
  }

  updateSavedConfigurations(
    indexerId: string,
    configurationsIds: string[],
    currentHeight: number | null,
    trx?: Transaction,
  ) {
    const scope = trx ?? this.db

    return scope
      .updateTable('public.indexer_configurations')
      .where('indexer_id', '=', indexerId)
      .where('id', 'in', configurationsIds)
      .set('current_height', currentHeight)
      .execute()
  }

  async deleteConfigurationsExcluding(
    indexerId: string,
    configurationIds: string[],
  ) {
    return await this.db
      .deleteFrom('public.indexer_configurations')
      .where('indexer_id', '=', indexerId)
      .where('id', 'not in', configurationIds)
      .execute()
  }

  async getAll() {
    const rows = await this.db
      .selectFrom('public.indexer_configurations')
      .select(selectIndexerConfiguration)
      .execute()

    return rows.map(toRecord)
  }

  deleteAll() {
    return this.db.deleteFrom('public.indexer_configurations').execute()
  }
}
