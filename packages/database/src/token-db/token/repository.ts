import { assert } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { TokenRecord, UpsertableTokenRecord, upsertableToRow } from './entity'
import { joinDeployment, joinNetwork, joinTokenMeta } from './join'
import { selectToken, selectTokenWithPrefix } from './select'

export class TokenRepository extends BaseRepository {
  async upsert(record: UpsertableTokenRecord): Promise<{ id: string }> {
    const row = upsertableToRow(record)
    return await this.db
      .insertInto('Token')
      .values(row)
      .onConflict((cb) =>
        cb.columns(['networkId', 'address']).doUpdateSet((eb) => ({
          updatedAt: eb.ref('excluded.updatedAt'),
        })),
      )
      .returning('Token.id')
      .executeTakeFirstOrThrow()
  }

  async upsertMany(records: UpsertableTokenRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(upsertableToRow)
    await this.batch(rows, 100, async (batch) => {
      await this.db
        .insertInto('Token')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['networkId', 'address']).doUpdateSet((eb) => ({
            updatedAt: eb.ref('excluded.updatedAt'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async getAll(): Promise<TokenRecord[]> {
    const rows = await this.db.selectFrom('Token').select(selectToken).execute()
    return rows
  }

  async getByChainId(chainId: number): Promise<TokenRecord[]> {
    const rows = await this.db
      .selectFrom('Token')
      .innerJoin(...joinNetwork)
      .select(selectTokenWithPrefix('Token'))
      .where('Network.chainId', '=', chainId)
      .execute()
    return rows
  }

  async getByNetworks(
    networks: { address: string; networkId: string }[],
  ): Promise<TokenRecord[]> {
    if (networks.length === 0) return []

    const allRows: TokenRecord[] = []

    await this.batch(networks, 1000, async (batch) => {
      const rows = await this.db
        .selectFrom('Token')
        .select(selectToken)
        .where((eb) =>
          eb.or(
            batch.map(({ address, networkId }) =>
              eb.and([
                eb('address', '=', address),
                eb('networkId', '=', networkId),
              ]),
            ),
          ),
        )
        .execute()

      allRows.push(...rows)
    })

    return allRows
  }

  async getByNetworksAndContractName(
    networks: { address: string; networkId: string }[],
    contractName: string,
  ): Promise<TokenRecord[]> {
    const rows = await this.db
      .selectFrom('Token')
      .select(selectTokenWithPrefix('Token'))
      .innerJoin(...joinDeployment)
      .innerJoin(...joinTokenMeta)
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
      .where('TokenMeta.contractName', '=', contractName)
      .execute()
    return rows
  }

  async getByDeployment({
    networkId,
    deploymentConstraints,
  }: {
    networkId: string
    deploymentConstraints: (
      | { to: string; from: string }
      | { from: string; to?: undefined }
      | { to: string; from?: undefined }
    )[]
  }): Promise<TokenRecord[]> {
    let statement = this.db
      .selectFrom('Token')
      .select(selectTokenWithPrefix('Token'))
      .innerJoin(...joinDeployment)
      .innerJoin(...joinTokenMeta)
      .innerJoin(...joinNetwork)
      .where('Network.id', '=', networkId)

    for (const constraint of deploymentConstraints) {
      statement = statement.where((eb) => {
        if (constraint.to && constraint.from) {
          return eb('Deployment.to', 'ilike', constraint.to).and(
            'Deployment.from',
            'ilike',
            constraint.from,
          )
        }

        if (constraint.to) {
          return eb('Deployment.to', 'ilike', constraint.to)
        }

        assert(constraint.from, 'Invalid constraint')

        return eb('Deployment.from', 'ilike', constraint.from)
      })
    }

    return await statement.execute()
  }

  async getByDeploymentTargetAndContractName(target: {
    to: string[]
    networkId: string
    contractName: string
  }): Promise<TokenRecord[]> {
    const rows = await this.db
      .selectFrom('Token')
      .select(selectTokenWithPrefix('Token'))
      .innerJoin(...joinDeployment)
      .innerJoin(...joinTokenMeta)
      .innerJoin(...joinNetwork)
      .where((eb) =>
        eb.or(target.to.map((to) => eb('Deployment.to', 'ilike', to))),
      )
      .where('TokenMeta.contractName', '=', target.contractName)
      .where('Network.id', '=', target.networkId)
      .execute()
    return rows
  }

  async findByNetwork(network: { network: string; address: string }): Promise<
    TokenRecord | undefined
  > {
    const row = await this.db
      .selectFrom('Token')
      .innerJoin(...joinNetwork)
      .select(selectTokenWithPrefix('Token'))
      .where('Network.name', '=', network.network)
      .where('Token.address', 'ilike', network.address)
      .limit(1)
      .executeTakeFirst()
    return row
  }

  async findById(id: string): Promise<TokenRecord | undefined> {
    const row = await this.db
      .selectFrom('Token')
      .select(selectToken)
      .where('Token.id', '=', id)
      .limit(1)
      .executeTakeFirst()
    return row
  }

  async getByIds(ids: string[]): Promise<TokenRecord[]> {
    if (ids.length === 0) return []

    const rows = await this.db
      .selectFrom('Token')
      .select(selectToken)
      .where('Token.id', 'in', ids)
      .execute()
    return rows
  }

  async deleteAll(): Promise<bigint> {
    const result = await this.db.deleteFrom('Token').executeTakeFirstOrThrow()
    return result.numDeletedRows
  }
}
