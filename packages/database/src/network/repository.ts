import { PostgresDatabase } from '../kysely'
import { Network, fromEntity, toEntity } from './entity'
import { joinExplorer, joinRpc } from './join'

export class NetworkRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findMany() {
    const entities = await this.db.selectFrom('network').selectAll().execute()

    return entities.map(fromEntity)
  }

  async findManyWithConfigs() {
    const entities = await this.db
      .selectFrom('network')
      .innerJoin(...joinExplorer)
      .innerJoin(...joinRpc)
      .selectAll()
      .execute()

    return entities.map(fromEntity)
  }

  async findWithCoingecko() {
    const entities = await this.db
      .selectFrom('network')
      .where('network.coingecko_id', 'is not', null)
      .selectAll()
      .execute()

    return entities.map(fromEntity)
  }

  upsertMany(networks: Network[]) {
    const entity = networks.map(toEntity)

    return this.db
      .insertInto('network')
      .values(entity)
      .onConflict((conflict) =>
        conflict.column('coingecko_id').doUpdateSet({
          coingecko_id: (excluded) => excluded.ref('excluded.coingecko_id'),
        }),
      )
      .execute()
  }

  updateWhereCoinGeckoId(coingeckoId: string, network: Network) {
    const entity = toEntity(network)

    return this.db
      .updateTable('network')
      .set(entity)
      .where('network.coingecko_id', '=', coingeckoId)
      .execute()
  }
}
