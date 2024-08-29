import { BaseRepository } from '../../BaseRepository'
import { TokenRecord, toRecord, toRow } from './entity'
import { joinDeployment, joinNetwork, joinTokenMeta } from './join'
import { selectToken } from './select'

export class TokenRepository extends BaseRepository {
  async upsertMany(records: TokenRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('Token')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['networkId', 'address']).doUpdateSet((eb) => ({
            networkId: eb.ref('excluded.networkId'),
            address: eb.ref('excluded.address'),
          })),
        )
        .returning('Token.id')
        .execute()
    })
    return records.length
  }

  async getByChainId(chainId: number): Promise<TokenRecord[]> {
    const rows = await this.db
      .selectFrom('Token')
      .innerJoin(...joinNetwork)
      .select(selectToken)
      .where('Network.chainId', '=', chainId)
      .execute()
    return rows.map(toRecord)
  }

  async getByNetworks(
    networks: { address: string; networkId: string }[],
  ): Promise<TokenRecord[]> {
    if (networks.length === 0) return []

    const rows = await this.db
      .selectFrom('Token')
      .select(selectToken)
      .where((eb) =>
        eb.or(
          networks.map(({ address, networkId }) =>
            eb.and([
              eb('address', '=', address),
              eb('networkId', '=', networkId),
            ]),
          ),
        ),
      )
      .execute()
    return rows.map(toRecord)
  }

  async getByDeploymentTarget(target: {
    to: string[]
    networkId: string
    contractName: string
  }): Promise<TokenRecord[]> {
    const rows = await this.db
      .selectFrom('Token')
      .select(selectToken)
      .innerJoin(...joinDeployment)
      .innerJoin(...joinTokenMeta)
      .innerJoin(...joinNetwork)
      .where((eb) =>
        eb.or(target.to.map((to) => eb('Deployment.to', 'ilike', to))),
      )
      .where('TokenMeta.contractName', '=', target.contractName)
      .where('Network.id', '=', target.networkId)
      .execute()
    return rows.map(toRecord)
  }

  async findByNetwork(network: { network: string; address: string }): Promise<
    TokenRecord | undefined
  > {
    const row = await this.db
      .selectFrom('Token')
      .innerJoin(...joinNetwork)
      .select(selectToken)
      .where('Network.name', '=', network.network)
      .where('Token.address', 'ilike', network.address)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async findById(id: string): Promise<TokenRecord | undefined> {
    const row = await this.db
      .selectFrom('Token')
      .select(selectToken)
      .where('Token.id', '=', id)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getByIds(ids: string[]): Promise<TokenRecord[]> {
    if (ids.length === 0) return []

    const rows = await this.db
      .selectFrom('Token')
      .select(selectToken)
      .where('Token.id', 'in', ids)
      .execute()
    return rows.map(toRecord)
  }
}
