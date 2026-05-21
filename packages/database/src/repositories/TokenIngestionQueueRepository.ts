import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TokenIngestionQueue } from '../kysely/generated/types'

export const TOKEN_INGESTION_QUEUE_STATES = [
  'staged',
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

export interface TokenIngestionQueuePage {
  entries: TokenIngestionQueueRecord[]
  totalCount: number
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
  row: Selectable<TokenIngestionQueue>,
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
  state: Extract<TokenIngestionQueueState, 'staged' | 'pending'>,
): Insertable<TokenIngestionQueue> {
  const now = new Date()
  return {
    ...normalizeAddress(record),
    state,
    message: null,
    createdAt: now,
    updatedAt: now,
  }
}

export class TokenIngestionQueueRepository extends BaseRepository {
  async enqueue(
    address: TokenIngestionQueueAddress,
    state: Extract<TokenIngestionQueueState, 'staged' | 'pending'> = 'pending',
  ): Promise<void> {
    await this.db
      .insertInto('TokenIngestionQueue')
      .values(toRow(address, state))
      .onConflict((cb) => cb.columns(['chain', 'address']).doNothing())
      .execute()
  }

  async findNextPending(): Promise<TokenIngestionQueueRecord | undefined> {
    const row = await this.db
      .selectFrom('TokenIngestionQueue')
      .selectAll()
      .where('state', '=', 'pending')
      .orderBy('updatedAt', 'asc')
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async countPending(): Promise<number> {
    const count = await this.db
      .selectFrom('TokenIngestionQueue')
      .select((eb) => eb.fn.countAll<number>().as('count'))
      .where('state', '=', 'pending')
      .executeTakeFirstOrThrow()

    return Number(count.count)
  }

  async getByStates(
    states: TokenIngestionQueueState[],
  ): Promise<TokenIngestionQueueRecord[]> {
    if (states.length === 0) return []

    const rows = await this.db
      .selectFrom('TokenIngestionQueue')
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
      .updateTable('TokenIngestionQueue')
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

  async approve(address: TokenIngestionQueueAddress): Promise<number> {
    const normalized = normalizeAddress(address)
    const result = await this.db
      .updateTable('TokenIngestionQueue')
      .set({
        state: 'pending',
        message: null,
        updatedAt: new Date(),
      })
      .where('chain', '=', normalized.chain)
      .where('address', '=', normalized.address)
      .where('state', '=', 'staged')
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async remove(address: TokenIngestionQueueAddress): Promise<number> {
    const normalized = normalizeAddress(address)
    const result = await this.db
      .deleteFrom('TokenIngestionQueue')
      .where('chain', '=', normalized.chain)
      .where('address', '=', normalized.address)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<TokenIngestionQueueRecord[]> {
    const rows = await this.db
      .selectFrom('TokenIngestionQueue')
      .selectAll()
      .orderBy(['chain', 'address'])
      .execute()

    return rows.map(toRecord)
  }

  async getPage(options: {
    offset: number
    limit: number
  }): Promise<TokenIngestionQueuePage> {
    const rows = await this.db
      .selectFrom('TokenIngestionQueue')
      .selectAll()
      .orderBy(['chain', 'address'])
      .offset(options.offset)
      .limit(options.limit)
      .execute()

    const count = await this.db
      .selectFrom('TokenIngestionQueue')
      .select((eb) => eb.fn.countAll<number>().as('count'))
      .executeTakeFirstOrThrow()

    return {
      entries: rows.map(toRecord),
      totalCount: Number(count.count),
    }
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('TokenIngestionQueue')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  private async setState(
    address: TokenIngestionQueueAddress,
    state: Extract<TokenIngestionQueueState, 'conflict' | 'error'>,
    message: string,
  ): Promise<number> {
    const normalized = normalizeAddress(address)
    const result = await this.db
      .updateTable('TokenIngestionQueue')
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
