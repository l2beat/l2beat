import { PostgresDatabase, Transaction } from '../kysely'
import { IndexerConfiguration, toRecord, toRow } from './entity'
import { selectIndexerConfiguration } from './select'

const BATCH_SIZE = 5_000

export class IndexerConfigurationRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdateMany(record: IndexerConfiguration[]) {
    const rows = record.map(toRow)

    await this.db.transaction().execute(async (trx) => {
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        await trx
          .insertInto('indexer_configurations')
          .values(rows.slice(i, i + BATCH_SIZE))
          .onConflict((cb) =>
            cb.column('id').doUpdateSet({
              id: (eb) => eb.ref('excluded.id'),
              indexer_id: (eb) => eb.ref('excluded.indexer_id'),
              properties: (eb) => eb.ref('excluded.properties'),
              current_height: (eb) => eb.ref('excluded.current_height'),
              min_height: (eb) => eb.ref('excluded.min_height'),
              max_height: (eb) => eb.ref('excluded.max_height'),
            }),
          )
          .execute()
      }
    })
  }

  async getSavedConfigurations(indexerId: string) {
    const rows = await this.db
      .selectFrom('indexer_configurations')
      .select(selectIndexerConfiguration)
      .where('indexer_id', '=', indexerId)
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
      .updateTable('indexer_configurations')
      .where((eb) =>
        eb.and([
          eb('indexer_id', '=', indexerId),
          eb('id', 'in', configurationsIds),
        ]),
      )
      .set('current_height', currentHeight)
      .execute()
  }

  async deleteConfigurationsExcluding(
    indexerId: string,
    configurationIds: string[],
  ) {
    return this.db
      .deleteFrom('indexer_configurations')
      .where((eb) =>
        eb.and([
          eb('indexer_id', '=', indexerId),
          eb('id', 'in', configurationIds),
        ]),
      )
      .execute()
  }

  async getAll() {
    const rows = await this.db
      .selectFrom('indexer_configurations')
      .select(selectIndexerConfiguration)
      .execute()

    return rows.map(toRecord)
  }

  deleteAll() {
    return this.db.deleteFrom('indexer_configurations').execute()
  }
}
