import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type BridgeMessageRecord, toRecord, toRow } from './entity'

export interface BridgeMessageStatsRecord {
  type: string
  count: number
  averageDuration: number
}

export class BridgeMessageRepository extends BaseRepository {
  async insertMany(records: BridgeMessageRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('BridgeMessage').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<BridgeMessageRecord[]> {
    const rows = await this.db.selectFrom('BridgeMessage').selectAll().execute()

    return rows.map(toRecord)
  }

  async getByType(type: string): Promise<BridgeMessageRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeMessage')
      .where('type', '=', type)
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getStats(): Promise<BridgeMessageStatsRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeMessage')
      .select((eb) => [
        'type',
        eb.fn.countAll().as('count'),
        eb.fn.avg('duration').as('averageDuration'),
      ])
      .groupBy('type')
      .execute()
    return rows.map((x) => ({
      type: x.type,
      count: Number(x.count),
      averageDuration: Number(x.averageDuration),
    }))
  }

  async deleteBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('BridgeMessage')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('BridgeMessage').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
