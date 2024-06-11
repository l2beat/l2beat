import { Insertable } from 'kysely'
import { PostgresDatabase } from '../../kysely'
import { Network } from '../../kysely/generated/types'
import { joinExplorer, joinRpc } from './join'

export class NetworkRepository {
  constructor(private readonly db: PostgresDatabase) {}

  findMany() {
    return this.db.selectFrom('Network').selectAll().execute()
  }

  findManyWithConfigs() {
    return this.db
      .selectFrom('Network')
      .innerJoin(...joinExplorer)
      .innerJoin(...joinRpc)
      .selectAll()
      .execute()
  }

  upsertMany(data: Insertable<Network>[]) {
    return this.db
      .insertInto('Network')
      .values(data)
      .onConflict((conflict) =>
        conflict.column('coingeckoId').doUpdateSet({
          coingeckoId: (excluded) => excluded.ref('excluded.coingeckoId'),
        }),
      )
      .execute()
  }
}
