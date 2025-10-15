import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropEvent } from '../kysely/generated/types'

export interface BridgeEventRecord {
  plugin: string
  eventId: string
  type: string
  expiresAt: UnixTime
  timestamp: UnixTime
  chain: string
  blockNumber: number
  blockHash: string
  txHash: string
  value: string
  txTo: string | undefined
  logIndex: number
  matched: boolean
  unsupported: boolean
  args: unknown
}

export function toRecord(row: Selectable<InteropEvent>): BridgeEventRecord {
  return {
    plugin: row.plugin,
    eventId: row.eventId,
    type: row.type,
    expiresAt: UnixTime.fromDate(row.expiresAt),
    timestamp: UnixTime.fromDate(row.timestamp),
    chain: row.chain,
    blockNumber: row.blockNumber,
    blockHash: row.blockHash,
    txHash: row.txHash,
    value: row.value ?? '', //TODO: make optional
    txTo: row.txTo ?? undefined,
    logIndex: row.logIndex ?? -1, // TODO: make optional
    matched: row.matched,
    unsupported: row.unsupported,
    args: row.args,
  }
}

export function toRow(record: BridgeEventRecord): Insertable<InteropEvent> {
  return {
    plugin: record.plugin,
    eventId: record.eventId,
    type: record.type,
    expiresAt: UnixTime.toDate(record.expiresAt),
    timestamp: UnixTime.toDate(record.timestamp),
    chain: record.chain,
    blockNumber: record.blockNumber,
    blockHash: record.blockHash.toLowerCase(),
    txHash: record.txHash.toLowerCase(),
    value: record.value,
    txTo: record.txTo ?? null,
    logIndex: record.logIndex,
    matched: record.matched,
    unsupported: record.unsupported,
    args: record.args,
  }
}

export interface BridgeEventStatsRecord {
  type: string
  count: number
  matched: number
  unmatched: number
  oldUnmatched: number
  unsupported: number
}

export class BridgeEventRepository extends BaseRepository {
  async insertMany(records: BridgeEventRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db.insertInto('InteropEvent').values(batch).execute()
    })
    return rows.length
  }

  async getUnmatched(): Promise<BridgeEventRecord[]> {
    const rows = await this.db
      .selectFrom('InteropEvent')
      .where('matched', '=', false)
      .where('unsupported', '=', false)
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getAll(): Promise<BridgeEventRecord[]> {
    const rows = await this.db.selectFrom('InteropEvent').selectAll().execute()

    return rows.map(toRecord)
  }

  async getByType(
    type: string,
    options: {
      matched?: boolean
      unsupported?: boolean
      oldCutoff?: UnixTime
    } = {},
  ): Promise<BridgeEventRecord[]> {
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

  async getStats(): Promise<BridgeEventStatsRecord[]> {
    const now = new Date()
    const twoHoursAgo = new Date(now.toISOString())
    twoHoursAgo.setUTCHours(twoHoursAgo.getUTCHours() - 2)

    const rows = await this.db
      .selectFrom('InteropEvent')
      .select((eb) => [
        'type',
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
      .groupBy('type')
      .execute()

    return rows.map((x) => ({
      type: x.type,
      count: Number(x.count),
      matched: Number(x.matched),
      unmatched: Number(x.unmatched),
      oldUnmatched: Number(x.oldUnmatched),
      unsupported: Number(x.unsupported),
    }))
  }

  async getExpired(currentTime: UnixTime): Promise<BridgeEventRecord[]> {
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

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('InteropEvent').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
