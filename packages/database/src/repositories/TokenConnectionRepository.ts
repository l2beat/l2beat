import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TokenConnection } from '../kysely/generated/types'

export interface TokenConnectionParams {
  type: 'canonical' | 'wrapper'
}

export interface TokenConnectionRecord {
  tokenFromId: number
  tokenToId: number
  type: string
  params: TokenConnectionParams | undefined
  comment: string | undefined
}

export function toRecord(
  row: Selectable<TokenConnection>,
): TokenConnectionRecord {
  return {
    tokenFromId: row.tokenFromId,
    tokenToId: row.tokenToId,
    type: row.type,
    params:
      row.params !== null
        ? (row.params as unknown as TokenConnectionParams)
        : undefined,
    comment: row.comment ?? undefined,
  }
}

export function toRow(
  record: TokenConnectionRecord,
): Insertable<TokenConnection> {
  return {
    tokenFromId: record.tokenFromId,
    tokenToId: record.tokenToId,
    type: record.type,
    params: record.params ? JSON.stringify(record.params) : null,
    comment: record.comment,
  }
}

export class TokenConnectionRepository extends BaseRepository {
  async upsert(record: TokenConnectionRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: TokenConnectionRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
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

  async getAll(): Promise<TokenConnectionRecord[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getConnectionsFromOrTo(
    tokenId: number,
  ): Promise<TokenConnectionRecord[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where((eb) =>
        eb.or([eb('tokenFromId', '=', tokenId), eb('tokenToId', '=', tokenId)]),
      )
      .execute()

    return rows.map(toRecord)
  }

  async getConnectionsFrom(tokenId: number): Promise<TokenConnectionRecord[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where('tokenFromId', '=', tokenId)
      .execute()

    return rows.map(toRecord)
  }

  async getConnectionsTo(tokenId: number): Promise<TokenConnectionRecord[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where('tokenToId', '=', tokenId)
      .execute()

    return rows.map(toRecord)
  }

  async getFromTo(
    tokenFromId: number,
    tokenToId: number,
  ): Promise<TokenConnectionRecord[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where('tokenFromId', '=', tokenFromId)
      .where('tokenToId', '=', tokenToId)
      .execute()

    return rows.map(toRecord)
  }

  async getConnectionsBetween(
    tokenA: number,
    tokenB: number,
  ): Promise<TokenConnectionRecord[]> {
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
    tokenFromId: number,
    tokenToId: number,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('TokenConnection')
      .where('tokenFromId', '=', tokenFromId)
      .where('tokenToId', '=', tokenToId)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByTokenIds(tokenIds: number[]): Promise<number> {
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
