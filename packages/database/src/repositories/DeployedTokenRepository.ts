import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable, Updateable } from 'kysely'
import isNil from 'lodash/isNil'
import { BaseRepository } from '../BaseRepository'
import type { DeployedToken } from '../kysely/generated/types'
import {
  type AbstractTokenRecord,
  toAbstractTokenRecord,
} from './AbstractTokenRepository'

export type DeployedTokenRecord = {
  symbol: string
  comment: string | null
  chain: string
  address: string
  abstractTokenId: string | null
  decimals: number
  deploymentTimestamp: UnixTime
}

export type DeployedTokenPrimaryKey = Pick<
  DeployedTokenRecord,
  'chain' | 'address'
>

export type DeployedTokenUpdateable = Omit<
  Updateable<DeployedTokenRecord>,
  keyof DeployedTokenPrimaryKey
>

function toRecord(row: Selectable<DeployedToken>): DeployedTokenRecord {
  return {
    ...row,
    deploymentTimestamp: UnixTime.fromDate(row.deploymentTimestamp),
  }
}

function toRow(record: DeployedTokenRecord): Insertable<DeployedToken> {
  return {
    ...record,
    deploymentTimestamp: UnixTime.toDate(record.deploymentTimestamp),
  }
}

function toUpdateRow(
  record: DeployedTokenUpdateable,
): Updateable<DeployedToken> {
  return {
    ...record,
    deploymentTimestamp: isNil(record.deploymentTimestamp)
      ? record.deploymentTimestamp
      : UnixTime.toDate(record.deploymentTimestamp),
  }
}

export class DeployedTokenRepository extends BaseRepository {
  async insert(record: DeployedTokenRecord): Promise<void> {
    await this.db.insertInto('DeployedToken').values(toRow(record)).execute()
  }

  async updateByChainAndAddress(
    pk: DeployedTokenPrimaryKey,
    patch: DeployedTokenUpdateable,
  ): Promise<number> {
    const result = await this.db
      .updateTable('DeployedToken')
      .set(toUpdateRow(patch))
      .where('chain', '=', pk.chain)
      .where('address', '=', pk.address)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async getByChainAndAddress(pks: DeployedTokenPrimaryKey[]): Promise<
    {
      deployedToken: DeployedTokenRecord
      abstractToken: AbstractTokenRecord | undefined
    }[]
  > {
    if (pks.length === 0) {
      return []
    }

    const result = await this.db
      .selectFrom('DeployedToken')
      .leftJoin(
        'AbstractToken',
        'AbstractToken.id',
        'DeployedToken.abstractTokenId',
      )
      .selectAll('DeployedToken')
      .select([
        'AbstractToken.id as AbstractToken_id',
        'AbstractToken.issuer as AbstractToken_issuer',
        'AbstractToken.category as AbstractToken_category',
        'AbstractToken.iconUrl as AbstractToken_iconUrl',
        'AbstractToken.coingeckoId as AbstractToken_coingeckoId',
        'AbstractToken.coingeckoListingTimestamp as AbstractToken_coingeckoListingTimestamp',
        'AbstractToken.symbol as AbstractToken_symbol',
        'AbstractToken.comment as AbstractToken_comment',
        'AbstractToken.reviewed as AbstractToken_reviewed',
      ])
      .where((eb) =>
        eb.or(
          pks.map((pk) =>
            eb.and([
              eb('chain', '=', pk.chain),
              eb('address', '=', pk.address),
            ]),
          ),
        ),
      )
      .execute()

    return result.map((row) => ({
      deployedToken: toRecord({
        symbol: row.symbol,
        comment: row.comment,
        chain: row.chain,
        address: row.address,
        abstractTokenId: row.abstractTokenId,
        decimals: row.decimals,
        deploymentTimestamp: row.deploymentTimestamp,
      }),
      abstractToken:
        row.AbstractToken_id === null ||
        row.AbstractToken_symbol === null ||
        row.AbstractToken_category === null ||
        row.AbstractToken_reviewed === null
          ? undefined
          : toAbstractTokenRecord({
              id: row.AbstractToken_id,
              issuer: row.AbstractToken_issuer,
              symbol: row.AbstractToken_symbol,
              category: row.AbstractToken_category,
              iconUrl: row.AbstractToken_iconUrl,
              coingeckoId: row.AbstractToken_coingeckoId,
              coingeckoListingTimestamp:
                row.AbstractToken_coingeckoListingTimestamp,
              comment: row.AbstractToken_comment,
              reviewed: row.AbstractToken_reviewed,
            }),
    }))
  }

  async findByChainAndAddress(
    pk: DeployedTokenPrimaryKey,
  ): Promise<DeployedTokenRecord | undefined> {
    const row = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('chain', '=', pk.chain)
      .where((eb) => eb.fn('lower', ['address']), '=', pk.address.toLowerCase())
      .executeTakeFirst()
    return row ? toRecord(row) : undefined
  }

  async getByChainsAndAddresses(
    pks: DeployedTokenPrimaryKey[],
  ): Promise<DeployedTokenRecord[]> {
    if (pks.length === 0) {
      return []
    }

    const rows = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where((eb) =>
        eb.or(
          pks.map((pk) =>
            eb.and([
              eb('chain', '=', pk.chain),
              eb(eb.fn('lower', ['address']), '=', pk.address.toLowerCase()),
            ]),
          ),
        ),
      )
      .execute()

    return rows.map(toRecord)
  }

  async getByAbstractTokenId(id: string): Promise<DeployedTokenRecord[]> {
    const rows = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('abstractTokenId', '=', id)
      .execute()
    return rows.map(toRecord)
  }

  async getAll(): Promise<DeployedTokenRecord[]> {
    const rows = await this.db.selectFrom('DeployedToken').selectAll().execute()
    return rows.map(toRecord)
  }

  async getByPrimaryKeys(
    keys: DeployedTokenPrimaryKey[],
  ): Promise<DeployedTokenRecord[]> {
    if (keys.length === 0) {
      return []
    }

    const rows = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where((eb) =>
        eb.or(
          keys.map((key) =>
            eb.and([
              eb('chain', '=', key.chain),
              eb('address', '=', key.address),
            ]),
          ),
        ),
      )
      .execute()
    return rows.map(toRecord)
  }

  async deleteByPrimaryKey(key: DeployedTokenPrimaryKey): Promise<number> {
    const result = await this.db
      .deleteFrom('DeployedToken')
      .where('chain', '=', key.chain)
      .where('address', '=', key.address)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByPrimaryKeys(keys: DeployedTokenPrimaryKey[]): Promise<number> {
    if (keys.length === 0) {
      return 0
    }

    const result = await this.db
      .deleteFrom('DeployedToken')
      .where((eb) =>
        eb.or(
          keys.map((key) =>
            eb.and([
              eb('chain', '=', key.chain),
              eb('address', '=', key.address),
            ]),
          ),
        ),
      )
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<bigint> {
    const result = await this.db.deleteFrom('DeployedToken').executeTakeFirst()
    return result.numDeletedRows
  }
}
