import { Insertable } from 'kysely'
import { PostgresDatabase } from '../../kysely'
import { Token } from '../../kysely/generated/types'

export class TokenRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsertMany(data: Insertable<Token>[]) {
    return this.db
      .insertInto('Token')
      .values(data)
      .onConflict((conflict) =>
        conflict.columns(['networkId', 'address']).doUpdateSet({
          networkId: (excluded) => excluded.ref('excluded.networkId'),
          address: (excluded) => excluded.ref('excluded.address'),
        }),
      )
      .execute()
  }

  findManyByChain(chainId: number) {
    return this.db
      .selectFrom('Token')
      .innerJoin('Network', 'Network.id', 'Token.networkId')
      .where('Network.chainId', '=', chainId)
      .execute()
  }

  findManyByNetworkData(constraints: { address: string; networkId: string }[]) {
    return this.db
      .selectFrom('Token')
      .select(['id', 'networkId', 'address'])
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
  }

  findManyByDeploymentTarget(constraints: {
    to: string[]
    networkId: string
    contractName: string
  }) {
    return this.db
      .selectFrom('Token')
      .selectAll()
      .innerJoin('Deployment', 'Deployment.tokenId', 'Token.id')
      .innerJoin('TokenMeta', 'TokenMeta.tokenId', 'Token.id')
      .innerJoin('Network', 'Network.id', 'Token.networkId')
      .where((eb) =>
        eb.and([
          eb.or(constraints.to.map((to) => eb('Deployment.to', 'ilike', to))),
          eb('TokenMeta.contractName', '=', constraints.contractName),
          eb('Network.id', '=', constraints.networkId),
        ]),
      )
      .execute()
  }

  findByNetworkData(constraints: { network: string; address: string }) {
    return this.db
      .selectFrom('Token')
      .innerJoin('Network', 'Network.id', 'Token.networkId')
      .selectAll()
      .where((eb) =>
        eb.and([
          eb('Network.name', '=', constraints.network),
          eb('Token.address', 'ilike', constraints.address),
        ]),
      )
      .limit(1)
      .executeTakeFirst()
  }

  findById(constraints: { id: string }) {
    return this.db
      .selectFrom('Token')
      .selectAll()
      .where('Token.id', '=', constraints.id)
      .limit(1)
      .executeTakeFirst()
  }

  findManyByIds(constraints: { ids: string[] }) {
    return this.db
      .selectFrom('Token')
      .selectAll()
      .where((eb) =>
        eb.or(constraints.ids.map((id) => eb('Token.id', '=', id))),
      )
      .execute()
  }
}
