import { BaseRepository } from '../../BaseRepository'
import {
  TokenMetaRecord,
  UpsertableTokenMetaRecord,
  upsertableToRow,
} from './entity'
import { selectTokenMeta } from './select'

export class TokenMetaRepository extends BaseRepository {
  async getAll(): Promise<TokenMetaRecord[]> {
    const rows = await this.db
      .selectFrom('TokenMeta')
      .select(selectTokenMeta)
      .execute()
    return rows
  }

  async getByTokenId(tokenId: string): Promise<TokenMetaRecord[]> {
    return await this.db
      .selectFrom('TokenMeta')
      .select(selectTokenMeta)
      .where('tokenId', '=', tokenId)
      .execute()
  }

  async upsert(record: UpsertableTokenMetaRecord): Promise<{ id: string }> {
    const row = upsertableToRow(record)

    return await this.db
      .insertInto('TokenMeta')
      .values(row)
      .onConflict((cb) =>
        cb.columns(['tokenId', 'source']).doUpdateSet((eb) => ({
          externalId: eb.ref('excluded.externalId'),
          name: eb.ref('excluded.name'),
          symbol: eb.ref('excluded.symbol'),
          decimals: eb.ref('excluded.decimals'),
          logoUrl: eb.ref('excluded.logoUrl'),
          contractName: eb.ref('excluded.contractName'),
          updatedAt: eb.ref('excluded.updatedAt'),
        })),
      )
      .returning('TokenMeta.id')
      .executeTakeFirstOrThrow()
  }

  async upsertMany(
    records: Omit<TokenMetaRecord, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(upsertableToRow)

    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('TokenMeta')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['tokenId', 'source']).doUpdateSet((eb) => ({
            externalId: eb.ref('excluded.externalId'),
            name: eb.ref('excluded.name'),
            symbol: eb.ref('excluded.symbol'),
            decimals: eb.ref('excluded.decimals'),
            logoUrl: eb.ref('excluded.logoUrl'),
            contractName: eb.ref('excluded.contractName'),
            updatedAt: eb.ref('excluded.updatedAt'),
          })),
        )
        .returning('TokenMeta.id')
        .execute()
    })
    return records.length
  }

  async deleteAll(): Promise<bigint> {
    const result = await this.db.deleteFrom('TokenMeta').executeTakeFirst()
    return result.numDeletedRows
  }
}
