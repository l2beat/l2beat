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

function toRecord(row: Selectable<TokenRelation>): TokenRelationRecord {
  return {
    ...row,
    bridgeType: row.bridgeType as InteropBridgeType,
    transfer: row.transfer as JsonValue,
  }
}

function toRow(record: TokenRelationRecord): Insertable<TokenRelation> {
  return {
    ...record,
    tokenFromAddress: record.tokenFromAddress.toLowerCase(),
    tokenToAddress: record.tokenToAddress.toLowerCase(),
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
      .where('tokenFromChain', '=', pk.tokenFromChain)
      .where('tokenFromAddress', '=', pk.tokenFromAddress.toLowerCase())
      .where('tokenToChain', '=', pk.tokenToChain)
      .where('tokenToAddress', '=', pk.tokenToAddress.toLowerCase())
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
                      'tokenFromChain',
                      'tokenFromAddress',
                      'tokenToChain',
                      'tokenToAddress',
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
      .where('tokenFromChain', '=', pk.tokenFromChain)
      .where('tokenFromAddress', '=', pk.tokenFromAddress.toLowerCase())
      .where('tokenToChain', '=', pk.tokenToChain)
      .where('tokenToAddress', '=', pk.tokenToAddress.toLowerCase())
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
        'tokenFromChain',
        'tokenFromAddress',
        'tokenToChain',
        'tokenToAddress',
        'plugin',
        'bridgeType',
      ])
      .execute()

    return rows.map((row) => ({
      ...row,
      bridgeType: row.bridgeType as InteropBridgeType,
    }))
  }

  async getRelationsFrom(
    token: DeployedTokenPrimaryKey,
  ): Promise<TokenRelationRecord[]> {
    const rows = await this.db
      .selectFrom('TokenRelation')
      .selectAll()
      .where('tokenFromChain', '=', token.chain)
      .where('tokenFromAddress', '=', token.address.toLowerCase())
      .execute()

    return rows.map(toRecord)
  }

  async getRelationsTo(
    token: DeployedTokenPrimaryKey,
  ): Promise<TokenRelationRecord[]> {
    const rows = await this.db
      .selectFrom('TokenRelation')
      .selectAll()
      .where('tokenToChain', '=', token.chain)
      .where('tokenToAddress', '=', token.address.toLowerCase())
      .execute()

    return rows.map(toRecord)
  }

  async deleteByPrimaryKey(pk: TokenRelationPrimaryKey): Promise<number> {
    const result = await this.db
      .deleteFrom('TokenRelation')
      .where('tokenFromChain', '=', pk.tokenFromChain)
      .where('tokenFromAddress', '=', pk.tokenFromAddress.toLowerCase())
      .where('tokenToChain', '=', pk.tokenToChain)
      .where('tokenToAddress', '=', pk.tokenToAddress.toLowerCase())
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
