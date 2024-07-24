import { type SetRequired } from 'type-fest'
import { BaseRepository } from '../../BaseRepository'
import { toRecord as toNetworkExplorerRecord } from '../network-explorer/entity'
import { selectNetworkExplorer } from '../network-explorer/select'
import { selectNetworkRpc } from '../network-rpc/select'
import { NetworkRecord, toRecord, toRow } from './entity'
import { selectNetwork } from './select'

export class NetworkRepository extends BaseRepository {
  async findMany() {
    const rows = await this.getDb()
      .selectFrom('public.Network')
      .select(selectNetwork)
      .execute()

    return rows.map(toRecord)
  }

  async findManyWithConfigs() {
    const allNetworks = await this.getDb()
      .selectFrom('public.Network')
      .select([...selectNetwork])
      .execute()

    const networkIds = allNetworks.map((network) => network.id)

    const [explorers, rpcs] = await Promise.all([
      this.getDb()
        .selectFrom('public.NetworkExplorer')
        .select(selectNetworkExplorer)
        .where('public.NetworkExplorer.networkId', 'in', networkIds)
        .execute(),
      this.getDb()
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
    const rows = await this.getDb()
      .selectFrom('public.Network')
      .where('public.Network.coingeckoId', 'is not', null)
      .select(selectNetwork)
      .$narrowType<{ coingeckoId: string }>()
      .execute()

    return rows.map(toRecord) as SetRequired<NetworkRecord, 'coingeckoId'>[]
  }

  upsertMany(networks: NetworkRecord[]) {
    const row = networks.map(toRow)

    return this.getDb()
      .insertInto('public.Network')
      .values(row)
      .onConflict((conflict) =>
        conflict.column('coingeckoId').doUpdateSet({
          coingeckoId: (excluded) => excluded.ref('excluded.coingeckoId'),
        }),
      )
      .execute()
  }

  updateWhereCoinGeckoId(coingeckoId: string, Network: NetworkRecord) {
    const row = toRow(Network)

    return this.getDb()
      .updateTable('public.Network')
      .set(row)
      .where('public.Network.coingeckoId', '=', coingeckoId)
      .execute()
  }
}
