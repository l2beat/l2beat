import { BaseRepository } from '../BaseRepository'
import { type EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
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
  grouped: boolean
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
    grouped: row.grouped,
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
    grouped: record.grouped,
    args: record.args,
  }
}

export interface BridgeEventStatsRecord {
  type: string
  count: number
  matched: number
  grouped: number
}

export class BridgeEventRepository extends BaseRepository {
  async insertMany(records: BridgeEventRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('BridgeEvent').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<BridgeEventRecord[]> {
    const rows = await this.db.selectFrom('BridgeEvent').selectAll().execute()

    return rows.map(toRecord)
  }

  async getByType(type: string): Promise<BridgeEventRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeEvent')
      .where('type', '=', type)
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
        eb.fn.count('grouped').filterWhere('grouped', '=', true).as('grouped'),
      ])
      .groupBy('type')
      .execute()
    return rows.map((x) => ({
      type: x.type,
      count: Number(x.count),
      matched: Number(x.matched),
      grouped: Number(x.grouped),
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

    await this.db
      .updateTable('BridgeEvent')
      .set({ matched: true, grouped: true })
      .where('eventId', 'in', eventIds)
      .execute()
  }

  async updateGrouped(eventIds: string[]): Promise<void> {
    if (eventIds.length === 0) return

    await this.db
      .updateTable('BridgeEvent')
      .set({ grouped: true })
      .where('eventId', 'in', eventIds)
      .execute()
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
