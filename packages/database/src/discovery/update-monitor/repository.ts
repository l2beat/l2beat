import { BaseRepository } from '../../BaseRepository'
import { toRecord, toRow, type UpdateMonitorRecord } from './entity'

export class UpdateMonitorRepository extends BaseRepository {
  async findLatest(name: string): Promise<UpdateMonitorRecord | undefined> {
    const row = await this.db
      .selectFrom('UpdateMonitor')
      .selectAll()
      .where('projectId', '=', name)
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async upsert(record: UpdateMonitorRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: UpdateMonitorRecord[]): Promise<number> {
    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('UpdateMonitor')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['projectId']).doUpdateSet((eb) => ({
            blockNumber: eb.ref('excluded.blockNumber'),
            timestamp: eb.ref('excluded.timestamp'),
            discoveryJsonBlob: eb.ref('excluded.discoveryJsonBlob'),
            configHash: eb.ref('excluded.configHash'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async getAll(): Promise<UpdateMonitorRecord[]> {
    const rows = await this.db.selectFrom('UpdateMonitor').selectAll().execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('UpdateMonitor').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
