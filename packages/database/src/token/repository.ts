import { PostgresDatabase } from '../kysely'
import { Token, fromEntity, toEntity } from './entity'
import { joinDeployment, joinNetwork, joinTokenMeta } from './join'

export class TokenRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsertMany(tokens: Token[]) {
    const entities = tokens.map(toEntity)

    return this.db
      .insertInto('token')
      .values(entities)
      .onConflict((conflict) =>
        conflict.columns(['network_id', 'address']).doUpdateSet({
          network_id: (excluded) => excluded.ref('excluded.network_id'),
          address: (excluded) => excluded.ref('excluded.address'),
        }),
      )
      .returning('token.id')
      .execute()
  }

  async findManyByChain(chainId: number) {
    const entities = await this.db
      .selectFrom('token')
      .innerJoin(...joinNetwork)
      .selectAll()
      .where('network.chain_id', '=', chainId)
      .execute()

    return entities.map(fromEntity)
  }

  async findManyByNetworkData(
    constraints: { address: string; networkId: string }[],
  ) {
    const entities = await this.db
      .selectFrom('token')
      .selectAll()
      .where((eb) =>
        eb.or(
          constraints.map((constraint) =>
            eb.and([
              eb('network_id', '=', constraint.networkId),
              eb('address', '=', constraint.address),
            ]),
          ),
        ),
      )
      .execute()

    return entities.map(fromEntity)
  }

  async findManyByDeploymentTarget(constraints: {
    to: string[]
    networkId: string
    contractName: string
  }) {
    const entities = await this.db
      .selectFrom('token')
      .selectAll()
      .innerJoin(...joinDeployment)
      .innerJoin(...joinTokenMeta)
      .innerJoin(...joinNetwork)
      .where((eb) =>
        eb.and([
          eb.or(constraints.to.map((to) => eb('deployment.to', 'ilike', to))),
          eb('token_meta.contract_name', '=', constraints.contractName),
          eb('network.id', '=', constraints.networkId),
        ]),
      )
      .execute()

    return entities.map(fromEntity)
  }

  async findByNetworkData(constraints: { network: string; address: string }) {
    const entity = await this.db
      .selectFrom('token')
      .innerJoin(...joinNetwork)
      .selectAll()
      .where((eb) =>
        eb.and([
          eb('network.name', '=', constraints.network),
          eb('token.address', 'ilike', constraints.address),
        ]),
      )
      .limit(1)
      .executeTakeFirst()

    return entity ? fromEntity(entity) : null
  }

  async findById(id: Token['id']) {
    const entity = await this.db
      .selectFrom('token')
      .selectAll()
      .where('token.id', '=', id)
      .limit(1)
      .executeTakeFirst()

    return entity ? fromEntity(entity) : null
  }

  async findManyByIds(ids: Token['id'][]) {
    const entities = await this.db
      .selectFrom('token')
      .selectAll()
      .where('token.id', 'in', ids)
      .execute()

    return entities.map(fromEntity)
  }
}
