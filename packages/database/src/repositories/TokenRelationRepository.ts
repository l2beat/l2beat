import type { InteropBridgeType } from '@l2beat/shared-pure'
import type { Insertable, Selectable, Updateable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TokenRelation } from '../kysely/generated/types'
import type { DeployedTokenPrimaryKey } from './DeployedTokenRepository'

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

/**
 * TRANSITIONAL: the endpoint columns are now named `tokenA*`/`tokenB*`, but the
 * record this repository hands out still uses the old `tokenFrom*`/`tokenTo*`
 * names, so every caller keeps compiling and keeps working across the column
 * rename. The follow-up release renames the record fields too and this mismatch
 * disappears — do not build anything on the old names.
 */
export type TokenRelationRecord = {
  tokenFromChain: string
  tokenFromAddress: string
  tokenToChain: string
  tokenToAddress: string
  plugin: string
  bridgeType: InteropBridgeType
  transfer: JsonValue
}

export type TokenRelationRoute = Omit<TokenRelationRecord, 'transfer'>

export type TokenRelationPrimaryKey = Pick<
  TokenRelationRecord,
  | 'tokenFromChain'
  | 'tokenFromAddress'
  | 'tokenToChain'
  | 'tokenToAddress'
  | 'plugin'
  | 'bridgeType'
>

export type TokenRelationUpdateable = Omit<
  Updateable<TokenRelationRecord>,
  keyof TokenRelationPrimaryKey
>

// Columns are listed explicitly rather than spread, both because the record
// names differ from the column names for now and so that a column the record
// type does not model yet — `lockedToken` — cannot leak into API responses and
// history snapshots.
function toRecord(row: Selectable<TokenRelation>): TokenRelationRecord {
  return {
    tokenFromChain: row.tokenAChain,
    tokenFromAddress: row.tokenAAddress,
    tokenToChain: row.tokenBChain,
    tokenToAddress: row.tokenBAddress,
    plugin: row.plugin,
    bridgeType: row.bridgeType as InteropBridgeType,
    transfer: row.transfer as JsonValue,
  }
}

function toRow(record: TokenRelationRecord): Insertable<TokenRelation> {
  return {
    tokenAChain: record.tokenFromChain,
    tokenAAddress: record.tokenFromAddress.toLowerCase(),
    tokenBChain: record.tokenToChain,
    tokenBAddress: record.tokenToAddress.toLowerCase(),
    plugin: record.plugin,
    bridgeType: record.bridgeType,
    transfer: record.transfer,
  }
}

// Keeps each query's composite-key tuple list small enough to avoid
// overflowing both the Kysely query compiler and the Postgres parser stack.
const BATCH_SIZE = 1000

export class TokenRelationRepository extends BaseRepository {
  async insert(record: TokenRelationRecord): Promise<void> {
    await this.db.insertInto('TokenRelation').values(toRow(record)).execute()
  }

  async findByPrimaryKey(
    pk: TokenRelationPrimaryKey,
  ): Promise<TokenRelationRecord | undefined> {
    const row = await this.db
      .selectFrom('TokenRelation')
      .selectAll()
      .where('tokenAChain', '=', pk.tokenFromChain)
      .where('tokenAAddress', '=', pk.tokenFromAddress.toLowerCase())
      .where('tokenBChain', '=', pk.tokenToChain)
      .where('tokenBAddress', '=', pk.tokenToAddress.toLowerCase())
      .where('plugin', '=', pk.plugin)
      .where('bridgeType', '=', pk.bridgeType)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getByPrimaryKeys(
    keys: TokenRelationPrimaryKey[],
  ): Promise<TokenRelationRecord[]> {
    const rows: Selectable<TokenRelation>[] = []

    await this.batch(keys, BATCH_SIZE, async (batch) => {
      const keysByBridgeType = new Map<
        InteropBridgeType,
        TokenRelationPrimaryKey[]
      >()
      for (const key of batch) {
        const matchingKeys = keysByBridgeType.get(key.bridgeType) ?? []
        matchingKeys.push(key)
        keysByBridgeType.set(key.bridgeType, matchingKeys)
      }
      rows.push(
        ...(await this.db
          .selectFrom('TokenRelation')
          .selectAll()
          .where((eb) =>
            eb.or(
              [...keysByBridgeType].map(([bridgeType, matchingKeys]) =>
                eb.and([
                  eb('bridgeType', '=', bridgeType),
                  eb(
                    eb.refTuple(
                      'tokenAChain',
                      'tokenAAddress',
                      'tokenBChain',
                      'tokenBAddress',
                      'plugin',
                    ),
                    'in',
                    matchingKeys.map((key) =>
                      eb.tuple(
                        key.tokenFromChain,
                        key.tokenFromAddress.toLowerCase(),
                        key.tokenToChain,
                        key.tokenToAddress.toLowerCase(),
                        key.plugin,
                      ),
                    ),
                  ),
                ]),
              ),
            ),
          )
          .execute()),
      )
    })

    return rows.map(toRecord)
  }

  async updateByPrimaryKey(
    pk: TokenRelationPrimaryKey,
    patch: TokenRelationUpdateable,
  ): Promise<number> {
    const result = await this.db
      .updateTable('TokenRelation')
      .set(patch)
      .where('tokenAChain', '=', pk.tokenFromChain)
      .where('tokenAAddress', '=', pk.tokenFromAddress.toLowerCase())
      .where('tokenBChain', '=', pk.tokenToChain)
      .where('tokenBAddress', '=', pk.tokenToAddress.toLowerCase())
      .where('plugin', '=', pk.plugin)
      .where('bridgeType', '=', pk.bridgeType)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async getAll(): Promise<TokenRelationRecord[]> {
    const rows = await this.db.selectFrom('TokenRelation').selectAll().execute()
    return rows.map(toRecord)
  }

  async getAllRoutes(): Promise<TokenRelationRoute[]> {
    const rows = await this.db
      .selectFrom('TokenRelation')
      .select([
        'tokenAChain',
        'tokenAAddress',
        'tokenBChain',
        'tokenBAddress',
        'plugin',
        'bridgeType',
      ])
      .execute()

    return rows.map((row) => ({
      tokenFromChain: row.tokenAChain,
      tokenFromAddress: row.tokenAAddress,
      tokenToChain: row.tokenBChain,
      tokenToAddress: row.tokenBAddress,
      plugin: row.plugin,
      bridgeType: row.bridgeType as InteropBridgeType,
    }))
  }

  async getRelationsFrom(
    token: DeployedTokenPrimaryKey,
  ): Promise<TokenRelationRecord[]> {
    const rows = await this.db
      .selectFrom('TokenRelation')
      .selectAll()
      .where('tokenAChain', '=', token.chain)
      .where('tokenAAddress', '=', token.address.toLowerCase())
      .execute()

    return rows.map(toRecord)
  }

  async getRelationsTo(
    token: DeployedTokenPrimaryKey,
  ): Promise<TokenRelationRecord[]> {
    const rows = await this.db
      .selectFrom('TokenRelation')
      .selectAll()
      .where('tokenBChain', '=', token.chain)
      .where('tokenBAddress', '=', token.address.toLowerCase())
      .execute()

    return rows.map(toRecord)
  }

  async deleteByPrimaryKey(pk: TokenRelationPrimaryKey): Promise<number> {
    const result = await this.db
      .deleteFrom('TokenRelation')
      .where('tokenAChain', '=', pk.tokenFromChain)
      .where('tokenAAddress', '=', pk.tokenFromAddress.toLowerCase())
      .where('tokenBChain', '=', pk.tokenToChain)
      .where('tokenBAddress', '=', pk.tokenToAddress.toLowerCase())
      .where('plugin', '=', pk.plugin)
      .where('bridgeType', '=', pk.bridgeType)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TokenRelation').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
