import { type SetRequired } from 'type-fest'
import { PostgresDatabase } from '../kysely'
import { toRecord as toNetworkExplorerRecord } from '../network-explorer/entity'
import { selectNetworkExplorer } from '../network-explorer/select'
import { selectNetworkRpc } from '../network-rpc/select'
import { Network, toRecord, toRow } from './entity'
import { selectNetwork } from './select'
export class NetworkRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findMany() {
    const rows = await this.db
      .selectFrom('public.Network')
      .select(selectNetwork)
      .execute()

    return rows.map(toRecord)
  }

  async findManyWithConfigs() {
    const allNetworks = await this.db
      .selectFrom('public.Network')
      .select([...selectNetwork])
      .execute()

    const networkIds = allNetworks.map((network) => network.id)

    const [explorers, rpcs] = await Promise.all([
      this.db
        .selectFrom('public.NetworkExplorer')
        .select(selectNetworkExplorer)
        .where('public.NetworkExplorer.networkId', 'in', networkIds)
        .execute(),
      this.db
        .selectFrom('public.NetworkRpc')
        .select(selectNetworkRpc)
        .where('public.NetworkRpc.networkId', 'in', networkIds)
        .execute(),
    ])

    return allNetworks.map((network) => ({
      ...toRecord(network),
      explorers: explorers
        .filter((explorer) => explorer.networkId === network.id)
        .map(toNetworkExplorerRecord),
      rpc: rpcs.find((rpc) => rpc.networkId === network.id),
    }))
  }

  async findWithCoingecko() {
    const rows = await this.db
      .selectFrom('public.Network')
      .where('public.Network.coingeckoId', 'is not', null)
      .select(selectNetwork)
      .$narrowType<{ coingeckoId: string }>()
      .execute()

    return rows.map(toRecord) as SetRequired<Network, 'coingeckoId'>[]
  }

  upsertMany(networks: Network[]) {
    const row = networks.map(toRow)

    return this.db
      .insertInto('public.Network')
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
      .updateTable('public.Network')
      .set(row)
      .where('public.Network.coingeckoId', '=', coingeckoId)
      .execute()
  }
}
