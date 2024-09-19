import { type SetRequired } from 'type-fest'
import { BaseRepository } from '../../BaseRepository'
import { NetworkExplorerRecord } from '../network-explorer/entity'
import { selectNetworkExplorer } from '../network-explorer/select'
import { NetworkRpcRecord } from '../network-rpc/entity'
import { selectNetworkRpc } from '../network-rpc/select'
import {
  NetworkRecord,
  UpsertableNetworkRecord,
  upsertableToRow,
} from './entity'
import { selectNetwork } from './select'

export class NetworkRepository extends BaseRepository {
  async getAll(): Promise<NetworkRecord[]> {
    const rows = await this.db
      .selectFrom('Network')
      .select(selectNetwork)
      .execute()
    return rows
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
      ...network,
      explorers: explorers.filter(
        (explorer) => explorer.networkId === network.id,
      ),
      rpc: rpcs.find((rpc) => rpc.networkId === network.id),
    }))
  }

  async getAllWithConfigsAndAxelarGatewayAddress(): Promise<
    (NetworkRecord & {
      explorers: NetworkExplorerRecord[]
      rpc?: NetworkRpcRecord
    })[]
  > {
    const allNetworks = await this.getAllWithConfigs()
    return allNetworks.filter((n) => n.axelarGatewayAddress)
  }

  async getAllWithOrbitId(): Promise<NetworkRecord[]> {
    const rows = await this.db
      .selectFrom('Network')
      .select(selectNetwork)
      .where('Network.orbitId', 'is not', null)
      .$narrowType<{ orbitId: string }>()
      .execute()
    return rows
  }

  async getAllWithWormholeId(): Promise<NetworkRecord[]> {
    const rows = await this.db
      .selectFrom('Network')
      .select(selectNetwork)
      .where('Network.wormholeId', 'is not', null)
      .$narrowType<{ wormholeId: string }>()
      .execute()
    return rows
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
    return rows as SetRequired<NetworkRecord, 'coingeckoId'>[]
  }

  async findById(id: string): Promise<NetworkRecord | undefined> {
    const row = await this.db
      .selectFrom('Network')
      .select(selectNetwork)
      .where('Network.id', '=', id)
      .limit(1)
      .executeTakeFirst()
    return row
  }

  async findByChainId(chainId: number): Promise<NetworkRecord | undefined> {
    const row = await this.db
      .selectFrom('Network')
      .select(selectNetwork)
      .where('Network.chainId', '=', chainId)
      .limit(1)
      .executeTakeFirst()
    return row
  }

  async findByName(name: string): Promise<NetworkRecord | undefined> {
    const row = await this.db
      .selectFrom('Network')
      .select(selectNetwork)
      .where('Network.name', '=', name)
      .limit(1)
      .executeTakeFirst()
    return row
  }

  async upsertMany(networks: UpsertableNetworkRecord[]): Promise<number> {
    if (networks.length === 0) return 0

    const rows = networks.map(upsertableToRow)
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
    record: UpsertableNetworkRecord,
  ): Promise<void> {
    const row = upsertableToRow(record)
    await this.db
      .updateTable('Network')
      .set(row)
      .where('coingeckoId', '=', coingeckoId)
      .execute()
  }
}
