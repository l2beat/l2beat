import { type EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { BridgeEvent } from '../kysely/generated/types'

export interface BridgeEventRecord {
  eventId: string
  type: string
  expiresAt: UnixTime
  timestamp: UnixTime
  chain: string
  blockNumber: number
  blockHash: string
  txHash: string
  txTo: EthereumAddress | undefined
  logIndex: number
  matched: boolean
  unsupported: boolean
  args: unknown
}

export function toRecord(row: Selectable<BridgeEvent>): BridgeEventRecord {
  return {
    eventId: row.eventId,
    type: row.type,
    expiresAt: UnixTime.fromDate(row.expiresAt),
    timestamp: UnixTime.fromDate(row.timestamp),
    chain: row.chain,
    blockNumber: row.blockNumber,
    blockHash: row.blockHash,
    txHash: row.txHash,
    txTo: row.txTo as EthereumAddress | undefined,
    logIndex: row.logIndex,
    matched: row.matched,
    unsupported: row.unsupported,
    args: row.args,
  }
}

export function toRow(record: BridgeEventRecord): Insertable<BridgeEvent> {
  return {
    eventId: record.eventId,
    type: record.type,
    expiresAt: UnixTime.toDate(record.expiresAt),
    timestamp: UnixTime.toDate(record.timestamp),
    chain: record.chain,
    blockNumber: record.blockNumber,
    blockHash: record.blockHash,
    txHash: record.txHash,
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
  unsupported: number
}

export class BridgeEventRepository extends BaseRepository {
  async insertMany(records: BridgeEventRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db.insertInto('BridgeEvent').values(batch).execute()
    })
    return rows.length
  }

  async getUnmatched(): Promise<BridgeEventRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeEvent')
      .where('matched', '=', false)
      .where('unsupported', '=', false)
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getAll(): Promise<BridgeEventRecord[]> {
    const rows = await this.db.selectFrom('BridgeEvent').selectAll().execute()

    return rows.map(toRecord)
  }

  async getByType(type: string): Promise<BridgeEventRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeEvent')
      .where('type', '=', type)
      .orderBy('timestamp', 'desc')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getUnmatchedByType(type: string): Promise<BridgeEventRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeEvent')
      .where('type', '=', type)
      .where('unsupported', '=', false)
      .where('matched', '=', false)
      .orderBy('timestamp', 'desc')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getUnsupportedByType(type: string): Promise<BridgeEventRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeEvent')
      .where('type', '=', type)
      .where('unsupported', '=', true)
      .orderBy('timestamp', 'desc')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getStats(): Promise<BridgeEventStatsRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeEvent')
      .select((eb) => [
        'type',
        eb.fn.countAll().as('count'),
        eb.fn.count('matched').filterWhere('matched', '=', true).as('matched'),
        eb.fn
          .count('unsupported')
          .filterWhere('unsupported', '=', true)
          .as('unsupported'),
      ])
      .groupBy('type')
      .execute()
    return rows.map((x) => ({
      type: x.type,
      count: Number(x.count),
      matched: Number(x.matched),
      unsupported: Number(x.unsupported),
    }))
  }

  async getExpired(currentTime: UnixTime): Promise<BridgeEventRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeEvent')
      .where('expiresAt', '<=', UnixTime.toDate(currentTime))
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async updateMatched(eventIds: string[]): Promise<void> {
    if (eventIds.length === 0) return
    await this.batch(eventIds, 2_000, async (batch) => {
      await this.db
        .updateTable('BridgeEvent')
        .set({ matched: true })
        .where('eventId', 'in', batch)
        .execute()
    })
  }

  async updateUnsupported(eventIds: string[]): Promise<void> {
    if (eventIds.length === 0) return
    await this.batch(eventIds, 2_000, async (batch) => {
      await this.db
        .updateTable('BridgeEvent')
        .set({ unsupported: true })
        .where('eventId', 'in', batch)
        .execute()
    })
  }

  async deleteExpired(currentTime: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('BridgeEvent')
      .where('expiresAt', '<=', UnixTime.toDate(currentTime))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('BridgeEvent').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
