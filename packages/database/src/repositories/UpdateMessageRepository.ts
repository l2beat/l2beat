import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { UpdateMessage } from '../kysely/generated/types'

export interface UpdateMessageRecord {
  projectId: string
  timestamp: UnixTime
  message: string
}

export function toRow(record: UpdateMessageRecord): Insertable<UpdateMessage> {
  return {
    projectId: record.projectId,
    timestamp: UnixTime.toDate(record.timestamp),
    message: record.message,
  }
}

export function toRecord(row: Selectable<UpdateMessage>): UpdateMessageRecord {
  return {
    projectId: row.projectId,
    timestamp: UnixTime.fromDate(row.timestamp),
    message: row.message,
  }
}

export class UpdateMessageRepository extends BaseRepository {
  async upsert(record: UpdateMessageRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: UpdateMessageRecord[]): Promise<number> {
    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('UpdateMessage')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['projectId', 'timestamp'])
            .doUpdateSet((eb) => ({ message: eb.ref('excluded.message') })),
        )
        .execute()
    })
    return records.length
  }

  async deleteBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('UpdateMessage')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<UpdateMessageRecord[]> {
    const rows = await this.db
      .selectFrom('UpdateMessage')
      .selectAll()
      .orderBy('timestamp', 'desc')
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('UpdateMessage').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
