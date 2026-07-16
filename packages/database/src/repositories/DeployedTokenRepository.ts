import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable, Updateable } from 'kysely'
import isNil from 'lodash/isNil'
import { BaseRepository } from '../BaseRepository'
import type { DeployedToken } from '../kysely/generated/types'
import {
  type AbstractTokenRecord,
  toAbstractTokenRecord,
} from './AbstractTokenRepository'
import type { TokenSource } from './TokenMetadataRepository'

export type DeployedTokenRecord = {
  symbol: string
  comment: string | null
  chain: string
  address: string
  abstractTokenId: string | null
  decimals: number
  deploymentTimestamp: UnixTime
  metadata: DeployedTokenMetadata | null
  abstractTokenAssignmentProof?: unknown
}

export type DeployedTokenMetadata = {
  tvs?: TvsMetadata
}

type TvsMetadata = {
  includeInCalculations: boolean
  source: TokenSource
  supply?: 'totalSupply' | 'circulatingSupply' | 'zero'
  bridgedUsing: { name: string; slug?: string }[]
  excludeFromTotal: boolean
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
    metadata: row.metadata as DeployedTokenMetadata,
    deploymentTimestamp: UnixTime.fromDate(row.deploymentTimestamp),
    abstractTokenAssignmentProof: row.abstractTokenAssignmentProof,
  }
}

function toRow(record: DeployedTokenRecord): Insertable<DeployedToken> {
  return {
    ...record,
    address: record.address.toLowerCase(),
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

// Keeps each query's (chain, address) tuple list small enough to avoid
// overflowing both the Kysely query compiler and the Postgres parser stack.
const BATCH_SIZE = 1000

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
      .where('address', '=', pk.address.toLowerCase())
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async getByChainAndAddress(pks: DeployedTokenPrimaryKey[]): Promise<
    {
      deployedToken: DeployedTokenRecord
      abstractToken: AbstractTokenRecord | undefined
    }[]
  > {
    const result: {
      deployedToken: DeployedTokenRecord
      abstractToken: AbstractTokenRecord | undefined
    }[] = []

    await this.batch(pks, BATCH_SIZE, async (batch) => {
      const rows = await this.db
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
          'AbstractToken.additionalCoingeckoEntries as AbstractToken_additionalCoingeckoEntries',
          'AbstractToken.symbol as AbstractToken_symbol',
          'AbstractToken.comment as AbstractToken_comment',
          'AbstractToken.reviewed as AbstractToken_reviewed',
          'AbstractToken.isPriceUnreliable as AbstractToken_isPriceUnreliable',
        ])
        .where((eb) =>
          eb(
            eb.refTuple('chain', 'address'),
            'in',
            batch.map((pk) => eb.tuple(pk.chain, pk.address.toLowerCase())),
          ),
        )
        .execute()

      for (const row of rows) {
        result.push({
          deployedToken: toRecord({
            symbol: row.symbol,
            comment: row.comment,
            chain: row.chain,
            address: row.address,
            abstractTokenId: row.abstractTokenId,
            decimals: row.decimals,
            deploymentTimestamp: row.deploymentTimestamp,
            metadata: row.metadata as DeployedTokenMetadata,
            abstractTokenAssignmentProof: row.abstractTokenAssignmentProof,
          }),
          abstractToken:
            row.AbstractToken_id === null ||
            row.AbstractToken_symbol === null ||
            row.AbstractToken_reviewed === null ||
            row.AbstractToken_isPriceUnreliable === null
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
                  additionalCoingeckoEntries:
                    row.AbstractToken_additionalCoingeckoEntries,
                  comment: row.AbstractToken_comment,
                  reviewed: row.AbstractToken_reviewed,
                  isPriceUnreliable: row.AbstractToken_isPriceUnreliable,
                }),
        })
      }
    })

    return result
  }

  async findByChainAndAddress(
    pk: DeployedTokenPrimaryKey,
  ): Promise<DeployedTokenRecord | undefined> {
    const row = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('chain', '=', pk.chain)
      .where('address', '=', pk.address.toLowerCase())
      .executeTakeFirst()
    return row ? toRecord(row) : undefined
  }

  async getByChainsAndAddresses(
    pks: DeployedTokenPrimaryKey[],
  ): Promise<DeployedTokenRecord[]> {
    const rows: Selectable<DeployedToken>[] = []

    await this.batch(pks, BATCH_SIZE, async (batch) => {
      rows.push(
        ...(await this.db
          .selectFrom('DeployedToken')
          .selectAll()
          .where((eb) =>
            eb(
              eb.refTuple('chain', 'address'),
              'in',
              batch.map((pk) => eb.tuple(pk.chain, pk.address.toLowerCase())),
            ),
          )
          .execute()),
      )
    })

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
    const rows: Selectable<DeployedToken>[] = []

    await this.batch(keys, BATCH_SIZE, async (batch) => {
      rows.push(
        ...(await this.db
          .selectFrom('DeployedToken')
          .selectAll()
          .where((eb) =>
            eb(
              eb.refTuple('chain', 'address'),
              'in',
              batch.map((key) =>
                eb.tuple(key.chain, key.address.toLowerCase()),
              ),
            ),
          )
          .execute()),
      )
    })
    return rows.map(toRecord)
  }

  async deleteByPrimaryKey(key: DeployedTokenPrimaryKey): Promise<number> {
    const result = await this.db
      .deleteFrom('DeployedToken')
      .where('chain', '=', key.chain)
      .where('address', '=', key.address.toLowerCase())
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByPrimaryKeys(keys: DeployedTokenPrimaryKey[]): Promise<number> {
    let numDeletedRows = 0

    await this.batch(keys, BATCH_SIZE, async (batch) => {
      const result = await this.db
        .deleteFrom('DeployedToken')
        .where((eb) =>
          eb(
            eb.refTuple('chain', 'address'),
            'in',
            batch.map((key) => eb.tuple(key.chain, key.address.toLowerCase())),
          ),
        )
        .executeTakeFirst()

      numDeletedRows += Number(result.numDeletedRows)
    })

    return numDeletedRows
  }

  async deleteAll(): Promise<bigint> {
    const result = await this.db.deleteFrom('DeployedToken').executeTakeFirst()
    return result.numDeletedRows
  }
}
