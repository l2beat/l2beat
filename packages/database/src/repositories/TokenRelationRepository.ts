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
  sourceWasBurned: boolean
  destinationWasMinted: boolean
  bridgeType: InteropBridgeType | null
  transfer: JsonValue
}

export type TokenRelationPrimaryKey = Pick<
  TokenRelationRecord,
  | 'tokenFromChain'
  | 'tokenFromAddress'
  | 'tokenToChain'
  | 'tokenToAddress'
  | 'plugin'
  | 'sourceWasBurned'
  | 'destinationWasMinted'
>

export type TokenRelationUpdateable = Omit<
  Updateable<TokenRelationRecord>,
  keyof TokenRelationPrimaryKey
>

function toRecord(row: Selectable<TokenRelation>): TokenRelationRecord {
  return {
    ...row,
    bridgeType: row.bridgeType as InteropBridgeType | null,
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

function toUpdateRow(
  record: TokenRelationUpdateable,
): Updateable<TokenRelation> {
  return {
    ...record,
    bridgeType: record.bridgeType as TokenRelation['bridgeType'],
  }
}

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
      .where('sourceWasBurned', '=', pk.sourceWasBurned)
      .where('destinationWasMinted', '=', pk.destinationWasMinted)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getByPrimaryKeys(
    keys: TokenRelationPrimaryKey[],
  ): Promise<TokenRelationRecord[]> {
    if (keys.length === 0) return []

    const rows = await this.db
      .selectFrom('TokenRelation')
      .selectAll()
      .where((eb) =>
        eb.or(
          keys.map((key) =>
            eb.and([
              eb('tokenFromChain', '=', key.tokenFromChain),
              eb('tokenFromAddress', '=', key.tokenFromAddress.toLowerCase()),
              eb('tokenToChain', '=', key.tokenToChain),
              eb('tokenToAddress', '=', key.tokenToAddress.toLowerCase()),
              eb('plugin', '=', key.plugin),
              eb('sourceWasBurned', '=', key.sourceWasBurned),
              eb('destinationWasMinted', '=', key.destinationWasMinted),
            ]),
          ),
        ),
      )
      .execute()

    return rows.map(toRecord)
  }

  async updateByPrimaryKey(
    pk: TokenRelationPrimaryKey,
    patch: TokenRelationUpdateable,
  ): Promise<number> {
    const result = await this.db
      .updateTable('TokenRelation')
      .set(toUpdateRow(patch))
      .where('tokenFromChain', '=', pk.tokenFromChain)
      .where('tokenFromAddress', '=', pk.tokenFromAddress.toLowerCase())
      .where('tokenToChain', '=', pk.tokenToChain)
      .where('tokenToAddress', '=', pk.tokenToAddress.toLowerCase())
      .where('plugin', '=', pk.plugin)
      .where('sourceWasBurned', '=', pk.sourceWasBurned)
      .where('destinationWasMinted', '=', pk.destinationWasMinted)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async getAll(): Promise<TokenRelationRecord[]> {
    const rows = await this.db.selectFrom('TokenRelation').selectAll().execute()
    return rows.map(toRecord)
  }

  async getRelationsFromOrTo(
    token: DeployedTokenPrimaryKey,
  ): Promise<TokenRelationRecord[]> {
    const rows = await this.db
      .selectFrom('TokenRelation')
      .selectAll()
      .where((eb) =>
        eb.or([
          eb.and([
            eb('tokenFromChain', '=', token.chain),
            eb('tokenFromAddress', '=', token.address.toLowerCase()),
          ]),
          eb.and([
            eb('tokenToChain', '=', token.chain),
            eb('tokenToAddress', '=', token.address.toLowerCase()),
          ]),
        ]),
      )
      .execute()

    return rows.map(toRecord)
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
      .where('sourceWasBurned', '=', pk.sourceWasBurned)
      .where('destinationWasMinted', '=', pk.destinationWasMinted)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TokenRelation').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
