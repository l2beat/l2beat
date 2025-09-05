import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type BridgeMessageRecord, toRecord, toRow } from './entity'

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

  async deleteExpired(currentTime: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('BridgeMessage')
      .where('expiresAt', '<=', UnixTime.toDate(currentTime))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('BridgeMessage').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
