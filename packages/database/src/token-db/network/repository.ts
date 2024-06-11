import { PostgresDatabase } from '../../kysely'
import { Network } from '../../kysely/generated/types'
import { Clean } from '../../utils'
import { joinExplorer, joinRpc } from './join'

export class NetworksRepository {
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

  upsertMany(data: Clean<Network>[]) {
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
