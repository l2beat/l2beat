import { type SetRequired } from 'type-fest'
import { BaseRepository } from '../../BaseRepository'
import {
  NetworkExplorerRecord,
  toRecord as toNetworkExplorerRecord,
} from '../network-explorer/entity'
import { selectNetworkExplorer } from '../network-explorer/select'
import { NetworkRpcRecord } from '../network-rpc/entity'
import { selectNetworkRpc } from '../network-rpc/select'
import { NetworkRecord, toRecord, toRow } from './entity'
import { selectNetwork } from './select'

export class NetworkRepository extends BaseRepository {
  async getAll(): Promise<NetworkRecord[]> {
    const rows = await this.db
      .selectFrom('Network')
      .select(selectNetwork)
      .execute()
    return rows.map(toRecord)
  }

  async getAllWithConfigs(): Promise<
    (NetworkRecord & {
      explorers: NetworkExplorerRecord[]
      rpc?: NetworkRpcRecord
    })[]
  > {
    const allNetworks = await this.db
      .selectFrom('Network')
      .select([...selectNetwork])
      .execute()

    const networkIds = allNetworks.map((network) => network.id)

    const [explorers, rpcs] = await Promise.all([
      this.db
        .selectFrom('NetworkExplorer')
        .select(selectNetworkExplorer)
        .where('NetworkExplorer.networkId', 'in', networkIds)
        .execute(),
      this.db
        .selectFrom('NetworkRpc')
        .select(selectNetworkRpc)
        .where('NetworkRpc.networkId', 'in', networkIds)
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

  async getAllWithCoingeckoId(): Promise<
    SetRequired<NetworkRecord, 'coingeckoId'>[]
  > {
    const rows = await this.db
      .selectFrom('Network')
      .where('Network.coingeckoId', 'is not', null)
      .select(selectNetwork)
      .$narrowType<{ coingeckoId: string }>()
      .execute()
    return rows.map(toRecord) as SetRequired<NetworkRecord, 'coingeckoId'>[]
  }

  async upsertMany(networks: NetworkRecord[]): Promise<number> {
    if (networks.length === 0) return 0

    const rows = networks.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('Network')
        .values(batch)
        .onConflict((cb) =>
          cb.column('coingeckoId').doUpdateSet((eb) => ({
            coingeckoId: eb.ref('excluded.coingeckoId'),
          })),
        )
        .execute()
    })
    return networks.length
  }

  async updateByCoingeckoId(
    coingeckoId: string,
    record: NetworkRecord,
  ): Promise<void> {
    const row = toRow(record)
    await this.db
      .updateTable('Network')
      .set(row)
      .where('coingeckoId', '=', coingeckoId)
      .execute()
  }
}
