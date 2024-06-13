import { PostgresDatabase } from '../kysely'
import { Network, toRecord, toRow } from './entity'
import { joinExplorer, joinRpc } from './join'
import { selectNetwork } from './select'

export class NetworkRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findMany() {
    const rows = await this.db
      .selectFrom('Network')
      .select(selectNetwork)
      .execute()

    return rows.map(toRecord)
  }

  // Add mappers here
  async findManyWithConfigs() {
    const rows = await this.db
      .selectFrom('Network')
      .innerJoin(...joinExplorer)
      .innerJoin(...joinRpc)
      .select(selectNetwork)
      .execute()

    return rows.map(toRecord)
  }

  async findWithCoingecko() {
    const rows = await this.db
      .selectFrom('Network')
      .where('Network.coingeckoId', 'is not', null)
      .select(selectNetwork)
      .execute()

    return rows.map(toRecord)
  }

  upsertMany(networks: Network[]) {
    const row = networks.map(toRow)

    return this.db
      .insertInto('Network')
      .values(row)
      .onConflict((conflict) =>
        conflict.column('coingeckoId').doUpdateSet({
          coingeckoId: (excluded) => excluded.ref('excluded.coingeckoId'),
        }),
      )
      .execute()
  }

  updateWhereCoinGeckoId(coingeckoId: string, Network: Network) {
    const row = toRow(Network)

    return this.db
      .updateTable('Network')
      .set(row)
      .where('Network.coingeckoId', '=', coingeckoId)
      .execute()
  }
}
