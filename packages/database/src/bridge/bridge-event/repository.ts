import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type BridgeEventRecord, toRecord, toRow } from './entity'

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

  async getExpired(currentTime: UnixTime): Promise<BridgeEventRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeEvent')
      .where('expiresAt', '<=', UnixTime.toDate(currentTime))
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async updateMatched(eventIds: string[]): Promise<void> {
    await this.db
      .updateTable('BridgeEvent')
      .set({ matched: true, grouped: true })
      .where('eventId', 'in', eventIds)
      .execute()
  }

  async updateGrouped(eventIds: string[]): Promise<void> {
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
