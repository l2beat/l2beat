import { PostgresDatabase } from '../kysely'
import { Token, toRecord, toRow } from './entity'
import { joinDeployment, joinNetwork, joinTokenMeta } from './join'
import { selectToken } from './select'

export class TokenRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsertMany(tokens: Token[]) {
    const rows = tokens.map(toRow)

    return this.db
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
    const rows = await this.db
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
    const rows = await this.db
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
    const rows = await this.db
      .selectFrom('public.Token')
      .select(selectToken)
      .innerJoin(...joinDeployment)
      .innerJoin(...joinTokenMeta)
      .innerJoin(...joinNetwork)
      .where((eb) =>
        eb.and([
          eb.or(
            constraints.to.map((to) => eb('public.Deployment.to', 'ilike', to)),
          ),
          eb('public.TokenMeta.contractName', '=', constraints.contractName),
          eb('public.Network.id', '=', constraints.networkId),
        ]),
      )
      .execute()

    return rows.map(toRecord)
  }

  async findByNetworkData(constraints: { network: string; address: string }) {
    const row = await this.db
      .selectFrom('public.Token')
      .innerJoin(...joinNetwork)
      .select(selectToken)
      .where((eb) =>
        eb.and([
          eb('public.Network.name', '=', constraints.network),
          eb('public.Token.address', 'ilike', constraints.address),
        ]),
      )
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : null
  }

  async findById(id: Token['id']) {
    const row = await this.db
      .selectFrom('public.Token')
      .select(selectToken)
      .where('public.Token.id', '=', id)
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : null
  }

  async findManyByIds(ids: Token['id'][]) {
    const rows = await this.db
      .selectFrom('public.Token')
      .select(selectToken)
      .where('public.Token.id', 'in', ids)
      .execute()

    return rows.map(toRecord)
  }
}
