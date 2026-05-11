import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TokenIngestionQueueEntry } from '../kysely/generated/types'

export const TOKEN_INGESTION_QUEUE_STATES = [
  'pending',
  'conflict',
  'error',
] as const

export type TokenIngestionQueueState =
  (typeof TOKEN_INGESTION_QUEUE_STATES)[number]

export interface TokenIngestionQueueAddress {
  chain: string
  address: string
}

export interface TokenIngestionQueueRecord extends TokenIngestionQueueAddress {
  state: TokenIngestionQueueState
  message: string | null
  createdAt: UnixTime
  updatedAt: UnixTime
}

function normalizeAddress(
  address: TokenIngestionQueueAddress,
): TokenIngestionQueueAddress {
  return {
    chain: address.chain,
    address: address.address.toLowerCase(),
  }
}

function toRecord(
  row: Selectable<TokenIngestionQueueEntry>,
): TokenIngestionQueueRecord {
  return {
    chain: row.chain,
    address: row.address,
    state: row.state as TokenIngestionQueueState,
    message: row.message,
    createdAt: UnixTime.fromDate(row.createdAt),
    updatedAt: UnixTime.fromDate(row.updatedAt),
  }
}

function toRow(
  record: TokenIngestionQueueAddress,
): Insertable<TokenIngestionQueueEntry> {
  const now = new Date()
  return {
    ...normalizeAddress(record),
    state: 'pending',
    message: null,
    createdAt: now,
    updatedAt: now,
  }
}

export class TokenIngestionQueueRepository extends BaseRepository {
  async enqueue(address: TokenIngestionQueueAddress): Promise<void> {
    await this.db
      .insertInto('TokenIngestionQueueEntry')
      .values(toRow(address))
      .onConflict((cb) => cb.columns(['chain', 'address']).doNothing())
      .execute()
  }

  async findNextPending(): Promise<TokenIngestionQueueRecord | undefined> {
    const row = await this.db
      .selectFrom('TokenIngestionQueueEntry')
      .selectAll()
      .where('state', '=', 'pending')
      .orderBy('updatedAt', 'asc')
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getByStates(
    states: TokenIngestionQueueState[],
  ): Promise<TokenIngestionQueueRecord[]> {
    if (states.length === 0) return []

    const rows = await this.db
      .selectFrom('TokenIngestionQueueEntry')
      .selectAll()
      .where('state', 'in', states)
      .orderBy('updatedAt', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  markConflict(
    address: TokenIngestionQueueAddress,
    message: string,
  ): Promise<number> {
    return this.setState(address, 'conflict', message)
  }

  markError(
    address: TokenIngestionQueueAddress,
    message: string,
  ): Promise<number> {
    return this.setState(address, 'error', message)
  }

  async retry(address: TokenIngestionQueueAddress): Promise<number> {
    const normalized = normalizeAddress(address)
    const result = await this.db
      .updateTable('TokenIngestionQueueEntry')
      .set({
        state: 'pending',
        message: null,
        updatedAt: new Date(),
      })
      .where('chain', '=', normalized.chain)
      .where('address', '=', normalized.address)
      .where('state', 'in', ['conflict', 'error'])
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async remove(address: TokenIngestionQueueAddress): Promise<number> {
    const normalized = normalizeAddress(address)
    const result = await this.db
      .deleteFrom('TokenIngestionQueueEntry')
      .where('chain', '=', normalized.chain)
      .where('address', '=', normalized.address)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<TokenIngestionQueueRecord[]> {
    const rows = await this.db
      .selectFrom('TokenIngestionQueueEntry')
      .selectAll()
      .orderBy(['chain', 'address'])
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('TokenIngestionQueueEntry')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  private async setState(
    address: TokenIngestionQueueAddress,
    state: Exclude<TokenIngestionQueueState, 'pending'>,
    message: string,
  ): Promise<number> {
    const normalized = normalizeAddress(address)
    const result = await this.db
      .updateTable('TokenIngestionQueueEntry')
      .set({
        state,
        message,
        updatedAt: new Date(),
      })
      .where('chain', '=', normalized.chain)
      .where('address', '=', normalized.address)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }
}
