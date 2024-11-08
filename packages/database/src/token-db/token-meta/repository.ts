import { BaseRepository } from '../../BaseRepository'
import {
  TokenMetaRecord,
  UpsertableTokenMetaRecord,
  upsertableToRow,
} from './entity'
import { selectTokenMeta } from './select'
import { getAggregatedTokenMeta } from './utils'

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

  async getByTokenIds(tokenIds: string[]): Promise<TokenMetaRecord[]> {
    if (tokenIds.length === 0) return []
    return await this.db
      .selectFrom('TokenMeta')
      .select(selectTokenMeta)
      .where('tokenId', 'in', tokenIds)
      .execute()
  }

  async getByTokenIdAndSource(
    tokenId: string,
    source: string,
  ): Promise<TokenMetaRecord | undefined> {
    return await this.db
      .selectFrom('TokenMeta')
      .select(selectTokenMeta)
      .where('tokenId', '=', tokenId)
      .where('source', '=', source)
      .executeTakeFirst()
  }

  async getByTokenIdsAndSource(
    tokenIds: string[],
    source: string,
  ): Promise<TokenMetaRecord[]> {
    if (tokenIds.length === 0) return []

    return await this.db
      .selectFrom('TokenMeta')
      .select(selectTokenMeta)
      .where('tokenId', 'in', tokenIds)
      .where('source', '=', source)
      .execute()
  }

  async getBySource(source: string): Promise<TokenMetaRecord[]> {
    return await this.db
      .selectFrom('TokenMeta')
      .select(selectTokenMeta)
      .where('source', '=', source)
      .execute()
  }

  async getBasicAggregatedMeta(): Promise<
    { tokenId: string; name: string | null }[]
  > {
    return await this.db
      .selectFrom('TokenMeta')
      .select(['tokenId', 'name'])
      .where('source', '=', 'Aggregate')
      .orderBy('name', 'asc')
      .execute()
  }

  async upsert(
    record: UpsertableTokenMetaRecord,
    updateAggregate = true,
  ): Promise<void> {
    const row = upsertableToRow(record)

    await this.db
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
      .execute()

    if (updateAggregate) {
      const aggregatedRecord = getAggregatedTokenMeta(
        await this.getByTokenId(record.tokenId),
      )
      await this.upsert(aggregatedRecord, false)
    }
  }

  async upsertMany(
    records: Omit<TokenMetaRecord, 'id' | 'createdAt' | 'updatedAt'>[],
    updateAggregate = true,
  ): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(upsertableToRow)

    await this.batch(rows, 100, async (batch) => {
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
        .execute()
    })

    if (updateAggregate) {
      const updatedTokenIds = [...new Set(records.map((r) => r.tokenId))]
      const allMetas = await this.getByTokenIds(updatedTokenIds)
      await this.upsertMany(
        updatedTokenIds.map((id) =>
          getAggregatedTokenMeta(allMetas.filter((r) => r.tokenId === id)),
        ),
        false,
      )
    }

    return records.length
  }

  async deleteByTokenId(tokenId: string): Promise<bigint> {
    const result = await this.db
      .deleteFrom('TokenMeta')
      .where('tokenId', '=', tokenId)
      .executeTakeFirstOrThrow()
    return result.numDeletedRows
  }

  async deleteAll(): Promise<bigint> {
    const result = await this.db.deleteFrom('TokenMeta').executeTakeFirst()
    return result.numDeletedRows
  }
}
