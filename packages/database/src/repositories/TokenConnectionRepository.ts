import { BaseRepository } from '../BaseRepository'
import type { TokenConnection } from '../kysely/generated/types'
import {
  type AsInsertable,
  type AsSelectable,
  type AsUpdate,
  toRecord,
} from '../utils/typeUtils'

export type TokenConnectionInsertable = AsInsertable<TokenConnection>
export type TokenConnectionSelectable = AsSelectable<TokenConnection>
export type TokenConnectionUpdate = AsUpdate<
  TokenConnection,
  'tokenFromId' | 'tokenToId'
>

export class TokenConnectionRepository extends BaseRepository {
  async upsert(record: TokenConnectionInsertable): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: TokenConnectionInsertable[]): Promise<number> {
    if (records.length === 0) return 0

    await this.batch(records, 1_000, async (batch) => {
      await this.db
        .insertInto('TokenConnection')
        .values(batch)
        .onConflict((oc) =>
          oc
            .columns(['tokenFromId', 'tokenToId', 'type'])
            .doUpdateSet((eb) => ({
              params: eb.ref('excluded.params'),
              comment: eb.ref('excluded.comment'),
            })),
        )
        .execute()
    })

    return records.length
  }

  async getAll(): Promise<TokenConnectionSelectable[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getConnectionsFromOrTo(
    tokenId: string,
  ): Promise<TokenConnectionSelectable[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where((eb) =>
        eb.or([eb('tokenFromId', '=', tokenId), eb('tokenToId', '=', tokenId)]),
      )
      .execute()

    return rows.map(toRecord)
  }

  async getConnectionsFrom(
    tokenId: string,
  ): Promise<TokenConnectionSelectable[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where('tokenFromId', '=', tokenId)
      .execute()

    return rows.map(toRecord)
  }

  async getConnectionsTo(
    tokenId: string,
  ): Promise<TokenConnectionSelectable[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where('tokenToId', '=', tokenId)
      .execute()

    return rows.map(toRecord)
  }

  async getFromTo(
    tokenFromId: string,
    tokenToId: string,
  ): Promise<TokenConnectionSelectable[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where('tokenFromId', '=', tokenFromId)
      .where('tokenToId', '=', tokenToId)
      .execute()

    return rows.map(toRecord)
  }

  async getConnectionsBetween(
    tokenA: string,
    tokenB: string,
  ): Promise<TokenConnectionSelectable[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where((eb) =>
        eb.or([
          eb.and([
            eb('tokenFromId', '=', tokenA),
            eb('tokenToId', '=', tokenB),
          ]),
          eb.and([
            eb('tokenFromId', '=', tokenB),
            eb('tokenToId', '=', tokenA),
          ]),
        ]),
      )
      .execute()

    return rows.map(toRecord)
  }

  async deleteConnectionsFromTo(
    tokenFromId: string,
    tokenToId: string,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('TokenConnection')
      .where('tokenFromId', '=', tokenFromId)
      .where('tokenToId', '=', tokenToId)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByTokenIds(tokenIds: string[]): Promise<number> {
    if (tokenIds.length === 0) return 0

    const result = await this.db
      .deleteFrom('TokenConnection')
      .where((eb) =>
        eb.or([
          eb('tokenFromId', 'in', tokenIds),
          eb('tokenToId', 'in', tokenIds),
        ]),
      )
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('TokenConnection')
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }
}
