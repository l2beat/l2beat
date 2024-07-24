import { BaseRepository } from '../../BaseRepository'
import { TokenRecord, toRecord, toRow } from './entity'
import { joinDeployment, joinNetwork, joinTokenMeta } from './join'
import { selectToken } from './select'

export class TokenRepository extends BaseRepository {
  upsertMany(tokens: TokenRecord[]) {
    const rows = tokens.map(toRow)

    return this.getDb()
      .insertInto('public.Token')
      .values(rows)
      .onConflict((conflict) =>
        conflict.columns(['networkId', 'address']).doUpdateSet({
          networkId: (excluded) => excluded.ref('excluded.networkId'),
          address: (excluded) => excluded.ref('excluded.address'),
        }),
      )
      .returning('public.Token.id')
      .execute()
  }

  async findManyByChain(chainId: number) {
    const rows = await this.getDb()
      .selectFrom('public.Token')
      .innerJoin(...joinNetwork)
      .select(selectToken)
      .where('public.Network.chainId', '=', chainId)
      .execute()

    return rows.map(toRecord)
  }

  async findManyByNetworkData(
    constraints: { address: string; networkId: string }[],
  ) {
    const rows = await this.getDb()
      .selectFrom('public.Token')
      .select(selectToken)
      .where((eb) =>
        eb.or(
          constraints.map((constraint) =>
            eb.and([
              eb('networkId', '=', constraint.networkId),
              eb('address', '=', constraint.address),
            ]),
          ),
        ),
      )
      .execute()

    return rows.map(toRecord)
  }

  async findManyByDeploymentTarget(constraints: {
    to: string[]
    networkId: string
    contractName: string
  }) {
    const rows = await this.getDb()
      .selectFrom('public.Token')
      .select(selectToken)
      .innerJoin(...joinDeployment)
      .innerJoin(...joinTokenMeta)
      .innerJoin(...joinNetwork)
      .where((eb) =>
        eb.or(
          constraints.to.map((to) => eb('public.Deployment.to', 'ilike', to)),
        ),
      )
      .where('public.TokenMeta.contractName', '=', constraints.contractName)
      .where('public.Network.id', '=', constraints.networkId)
      .execute()

    return rows.map(toRecord)
  }

  async findByNetworkData(constraints: { network: string; address: string }) {
    const row = await this.getDb()
      .selectFrom('public.Token')
      .innerJoin(...joinNetwork)
      .select(selectToken)
      .where('public.Network.name', '=', constraints.network)
      .where('public.Token.address', 'ilike', constraints.address)
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : null
  }

  async findById(id: TokenRecord['id']) {
    const row = await this.getDb()
      .selectFrom('public.Token')
      .select(selectToken)
      .where('public.Token.id', '=', id)
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : null
  }

  async findManyByIds(ids: TokenRecord['id'][]) {
    if (ids.length === 0) {
      return []
    }
    const rows = await this.getDb()
      .selectFrom('public.Token')
      .select(selectToken)
      .where('public.Token.id', 'in', ids)
      .execute()

    return rows.map(toRecord)
  }
}
