import { PostgresDatabase } from '../kysely'
import { toRecord as toNetworkExplorerRecord } from '../network-explorer/entity'
import { selectNetworkExplorer } from '../network-explorer/select'
import { toRecord as toNetworkRpcRecord } from '../network-rpc/entity'
import { selectNetworkRpc } from '../network-rpc/select'
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

  async findManyWithConfigs() {
    const rows = await this.db
      .selectFrom('Network')
      .innerJoin(...joinExplorer)
      .innerJoin(...joinRpc)
      .select([...selectNetwork, ...selectNetworkExplorer, ...selectNetworkRpc])
      .execute()

    return rows.map((row) => ({
      ...toRecord(row),
      explorer: toNetworkExplorerRecord(row),
      rpc: toNetworkRpcRecord(row),
    }))
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
