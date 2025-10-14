import type { Updateable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TokenConnection } from '../kysely/generated/types'
import type { DeployedTokenPrimaryKey } from './DeployedTokenRepository'

type TokenConnectionType = TokenConnectionParams['type']

type WrapperConnectionParams = {
  type: 'wrapper'
  some: string
  data: number
}
type CanonicalConnectionParams = {
  type: 'canonical'
  data: string
}
type TokenConnectionParams = WrapperConnectionParams | CanonicalConnectionParams

export type TokenConnectionRecord<
  T extends TokenConnectionType = TokenConnectionType,
> = {
  tokenFromChain: string
  tokenFromAddress: string
  tokenToChain: string
  tokenToAddress: string
  type: T
  params: Extract<TokenConnectionParams, { type: T }> | null
  comment: string | null
}

export type TokenConnectionPrimaryKey = Pick<
  TokenConnectionRecord,
  | 'tokenFromChain'
  | 'tokenFromAddress'
  | 'tokenToChain'
  | 'tokenToAddress'
  | 'type'
>

export type TokenConnectionUpdateable = Omit<
  Updateable<TokenConnectionRecord>,
  keyof TokenConnectionPrimaryKey
>

const toRecord = <T extends TokenConnectionType>(
  record: TokenConnection,
): TokenConnectionRecord<T> => {
  return {
    ...record,
    type: record.type as T,
    params: record.params as Extract<TokenConnectionParams, { type: T }>,
  }
}

const toRow = <T extends TokenConnectionType>(
  record: TokenConnectionRecord<T>,
): TokenConnection => {
  return {
    ...record,
    params: record.params as TokenConnectionParams,
  }
}

export class TokenConnectionRepository extends BaseRepository {
  async insert(record: TokenConnectionRecord): Promise<void> {
    await this.db.insertInto('TokenConnection').values(toRow(record)).execute()
  }

  async getAll(): Promise<TokenConnectionRecord[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async getConnectionsFromOrTo(
    token: DeployedTokenPrimaryKey,
  ): Promise<TokenConnectionRecord[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where((eb) =>
        eb.or([
          eb.and([
            eb('tokenFromChain', '=', token.chain),
            eb('tokenFromAddress', '=', token.address),
          ]),
          eb.and([
            eb('tokenToChain', '=', token.chain),
            eb('tokenToAddress', '=', token.address),
          ]),
        ]),
      )
      .execute()
    return rows.map(toRecord)
  }

  async getConnectionsFrom(
    token: DeployedTokenPrimaryKey,
  ): Promise<TokenConnectionRecord[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where('tokenFromChain', '=', token.chain)
      .where('tokenFromAddress', '=', token.address)
      .execute()
    return rows.map(toRecord)
  }

  async getConnectionsTo(
    token: DeployedTokenPrimaryKey,
  ): Promise<TokenConnectionRecord[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where('tokenToChain', '=', token.chain)
      .where('tokenToAddress', '=', token.address)
      .execute()
    return rows.map(toRecord)
  }

  async getFromTo(
    tokenFrom: DeployedTokenPrimaryKey,
    tokenTo: DeployedTokenPrimaryKey,
  ): Promise<TokenConnectionRecord[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where('tokenFromChain', '=', tokenFrom.chain)
      .where('tokenFromAddress', '=', tokenFrom.address)
      .where('tokenToChain', '=', tokenTo.chain)
      .where('tokenToAddress', '=', tokenTo.address)
      .execute()
    return rows.map(toRecord)
  }

  async getConnectionsBetween(
    tokenA: DeployedTokenPrimaryKey,
    tokenB: DeployedTokenPrimaryKey,
  ): Promise<TokenConnectionRecord[]> {
    const rows = await this.db
      .selectFrom('TokenConnection')
      .selectAll()
      .where((eb) =>
        eb.or([
          eb.and([
            eb('tokenFromChain', '=', tokenA.chain),
            eb('tokenFromAddress', '=', tokenA.address),
            eb('tokenToChain', '=', tokenB.chain),
            eb('tokenToAddress', '=', tokenB.address),
          ]),
          eb.and([
            eb('tokenFromChain', '=', tokenB.chain),
            eb('tokenFromAddress', '=', tokenB.address),
            eb('tokenToChain', '=', tokenA.chain),
            eb('tokenToAddress', '=', tokenA.address),
          ]),
        ]),
      )
      .execute()
    return rows.map(toRecord)
  }

  async deleteConnectionsFromTo(
    tokenFrom: DeployedTokenPrimaryKey,
    tokenTo: DeployedTokenPrimaryKey,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('TokenConnection')
      .where('tokenFromChain', '=', tokenFrom.chain)
      .where('tokenFromAddress', '=', tokenFrom.address)
      .where('tokenToChain', '=', tokenTo.chain)
      .where('tokenToAddress', '=', tokenTo.address)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByPK(tokens: DeployedTokenPrimaryKey[]): Promise<number> {
    if (tokens.length === 0) return 0

    const result = await this.db
      .deleteFrom('TokenConnection')
      .where((eb) =>
        eb.or([
          eb.or(
            tokens.map((token) =>
              eb.and([
                eb('tokenFromChain', '=', token.chain),
                eb('tokenFromAddress', '=', token.address),
              ]),
            ),
          ),
          eb.or(
            tokens.map((token) =>
              eb.and([
                eb('tokenToChain', '=', token.chain),
                eb('tokenToAddress', '=', token.address),
              ]),
            ),
          ),
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
