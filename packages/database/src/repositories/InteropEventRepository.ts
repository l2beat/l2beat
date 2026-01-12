import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropEvent } from '../kysely/generated/types'

export interface InteropEventRecord {
  plugin: string
  eventId: string
  type: string
  expiresAt: UnixTime
  timestamp: UnixTime

  chain: string
  blockNumber: number
  args: unknown
  ctx: InteropEventContext

  matched: boolean
  unsupported: boolean
  direction: string | undefined
}

export interface InteropEventContext {
  timestamp: UnixTime
  chain: string
  txHash: string
  logIndex: number
}

export function toRecord(row: Selectable<InteropEvent>): InteropEventRecord {
  return {
    plugin: row.plugin,
    eventId: row.eventId,
    type: row.type,
    direction: row.direction ?? undefined,
    expiresAt: UnixTime.fromDate(row.expiresAt),
    timestamp: UnixTime.fromDate(row.timestamp),
    chain: row.chain,
    blockNumber: row.blockNumber,
    args: reviveBigInts(row.args),
    ctx: reviveBigInts(row.ctx) as InteropEventContext,
    matched: row.matched,
    unsupported: row.unsupported,
  }
}

export function toRow(record: InteropEventRecord): Insertable<InteropEvent> {
  return {
    plugin: record.plugin,
    eventId: record.eventId,
    type: record.type,
    direction: record.direction,
    expiresAt: UnixTime.toDate(record.expiresAt),
    timestamp: UnixTime.toDate(record.timestamp),
    chain: record.chain,
    blockNumber: record.blockNumber,
    matched: record.matched,
    unsupported: record.unsupported,
    args: JSON.stringify(record.args, (_, value) =>
      typeof value === 'bigint' ? `BigInt(${value})` : value,
    ),
    ctx: JSON.stringify(record.ctx, (_, value) =>
      typeof value === 'bigint' ? `BigInt(${value})` : value,
    ),
  }
}

export interface InteropEventStatsRecord {
  type: string
  direction: string | undefined
  count: number
  matched: number
  unmatched: number
  oldUnmatched: number
  unsupported: number
}

export class InteropEventRepository extends BaseRepository {
  async insertMany(records: InteropEventRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db.insertInto('InteropEvent').values(batch).execute()
    })
    return rows.length
  }

  async getUnmatched(): Promise<InteropEventRecord[]> {
    const rows = await this.db
      .selectFrom('InteropEvent')
      .where('matched', '=', false)
      .where('unsupported', '=', false)
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getAll(): Promise<InteropEventRecord[]> {
    const rows = await this.db.selectFrom('InteropEvent').selectAll().execute()

    return rows.map(toRecord)
  }

  async getOldestEventForPluginAndChain(
    plugin: string,
    chain: string,
  ): Promise<InteropEventRecord | undefined> {
    const row = await this.db
      .selectFrom('InteropEvent')
      .where('plugin', '=', plugin)
      .where('chain', '=', chain)
      .selectAll()
      .orderBy('timestamp', 'asc')
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getByType(
    type: string,
    options: {
      matched?: boolean
      unsupported?: boolean
      oldCutoff?: UnixTime
    } = {},
  ): Promise<InteropEventRecord[]> {
    let query = this.db.selectFrom('InteropEvent').where('type', '=', type)

    if (options.matched !== undefined) {
      query = query.where('matched', '=', options.matched)
    }

    if (options.unsupported !== undefined) {
      query = query.where('unsupported', '=', options.unsupported)
    }

    if (options.oldCutoff !== undefined) {
      query = query.where('timestamp', '<', UnixTime.toDate(options.oldCutoff))
    }

    const rows = await query.orderBy('timestamp', 'desc').selectAll().execute()

    return rows.map(toRecord)
  }

  async getStats(): Promise<InteropEventStatsRecord[]> {
    const now = new Date()
    const twoHoursAgo = new Date(now.toISOString())
    twoHoursAgo.setUTCHours(twoHoursAgo.getUTCHours() - 2)

    const rows = await this.db
      .selectFrom('InteropEvent')
      .select((eb) => [
        'type',
        'direction',
        eb.fn.countAll().as('count'),
        eb.fn.countAll().filterWhere('matched', '=', true).as('matched'),
        eb.fn
          .countAll()
          .filterWhere('unsupported', '=', false)
          .filterWhere('matched', '=', false)
          .as('unmatched'),
        eb.fn
          .countAll()
          .filterWhere('unsupported', '=', true)
          .as('unsupported'),
        eb.fn
          .countAll()
          .filterWhere('timestamp', '<', twoHoursAgo)
          .filterWhere('unsupported', '=', false)
          .filterWhere('matched', '=', false)
          .as('oldUnmatched'),
      ])
      .groupBy(['type', 'direction'])
      .execute()

    return rows.map((x) => ({
      type: x.type,
      direction: x.direction ?? undefined,
      count: Number(x.count),
      matched: Number(x.matched),
      unmatched: Number(x.unmatched),
      oldUnmatched: Number(x.oldUnmatched),
      unsupported: Number(x.unsupported),
    }))
  }

  async getExpired(currentTime: UnixTime): Promise<InteropEventRecord[]> {
    const rows = await this.db
      .selectFrom('InteropEvent')
      .where('expiresAt', '<=', UnixTime.toDate(currentTime))
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async updateMatched(eventIds: string[]): Promise<void> {
    if (eventIds.length === 0) return
    await this.batch(eventIds, 2_000, async (batch) => {
      await this.db
        .updateTable('InteropEvent')
        .set({ matched: true })
        .where('eventId', 'in', batch)
        .execute()
    })
  }

  async updateUnsupported(eventIds: string[]): Promise<void> {
    if (eventIds.length === 0) return
    await this.batch(eventIds, 2_000, async (batch) => {
      await this.db
        .updateTable('InteropEvent')
        .set({ unsupported: true })
        .where('eventId', 'in', batch)
        .execute()
    })
  }

  async deleteExpired(currentTime: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropEvent')
      .where('expiresAt', '<=', UnixTime.toDate(currentTime))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAllForPlugin(plugin: string): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropEvent')
      .where('plugin', '=', plugin)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('InteropEvent').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}

function reviveBigInts(obj: unknown): unknown {
  if (
    typeof obj === 'string' &&
    obj.startsWith('BigInt(') &&
    obj.endsWith(')')
  ) {
    return BigInt(obj.slice(7, -1))
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = reviveBigInts(obj[i])
    }
    return obj
  }
  if (obj !== null && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      ;(obj as Record<string, unknown>)[key] = reviveBigInts(value)
    }
    return obj
  }
  return obj
}
