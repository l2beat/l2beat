import { UnixTime } from '@l2beat/shared-pure'
import type { Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TokenDenylist } from '../kysely/generated/types'
import type { DeployedTokenPrimaryKey } from './DeployedTokenRepository'

/**
 * Addresses that must never (re-)enter TokenDB. An entry means a human
 * decided the address is not a real asset deployment (e.g. a test token
 * simulating a bridge into a real token) — ingestion refuses to observe it
 * and planning refuses to catalogue it. See
 * docs/mdbook/specs/l2b_specs/token_db/token_denylist.md.
 */
export type TokenDenylistEntryRecord = {
  chain: string
  address: string
  reason: string
  createdAt: UnixTime
}

/** `createdAt` is filled by the database, keeping planning deterministic —
 * `executePlan` regenerates the plan and deep-compares it with the confirmed
 * one, so plan-time commands must not carry "now". */
export type TokenDenylistEntryInsert = Omit<
  TokenDenylistEntryRecord,
  'createdAt'
>

function toRecord(row: Selectable<TokenDenylist>): TokenDenylistEntryRecord {
  return {
    ...row,
    createdAt: UnixTime.fromDate(row.createdAt),
  }
}

export class TokenDenylistRepository extends BaseRepository {
  async insert(record: TokenDenylistEntryInsert): Promise<void> {
    await this.db
      .insertInto('TokenDenylist')
      .values({ ...record, address: record.address.toLowerCase() })
      .execute()
  }

  async findByChainAndAddress(
    pk: DeployedTokenPrimaryKey,
  ): Promise<TokenDenylistEntryRecord | undefined> {
    const row = await this.db
      .selectFrom('TokenDenylist')
      .selectAll()
      .where('chain', '=', pk.chain)
      .where('address', '=', pk.address.toLowerCase())
      .executeTakeFirst()
    return row ? toRecord(row) : undefined
  }

  async getAll(): Promise<TokenDenylistEntryRecord[]> {
    const rows = await this.db.selectFrom('TokenDenylist').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteByPrimaryKey(pk: DeployedTokenPrimaryKey): Promise<number> {
    const result = await this.db
      .deleteFrom('TokenDenylist')
      .where('chain', '=', pk.chain)
      .where('address', '=', pk.address.toLowerCase())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<bigint> {
    const result = await this.db.deleteFrom('TokenDenylist').executeTakeFirst()
    return result.numDeletedRows
  }
}
