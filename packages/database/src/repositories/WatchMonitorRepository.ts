import { type json, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { WatchMonitor } from '../kysely/generated/types'

export interface WatchMonitorRecord {
  name: string
  timestamp: UnixTime
  values: Record<string, json>
}

export function toRow(record: WatchMonitorRecord): Insertable<WatchMonitor> {
  return {
    name: record.name,
    timestamp: UnixTime.toDate(record.timestamp),
    valuesJsonBlob: JSON.stringify(record.values),
  }
}

export function toRecord(row: Selectable<WatchMonitor>): WatchMonitorRecord {
  return {
    name: row.name,
    timestamp: UnixTime.fromDate(row.timestamp),
    values: row.valuesJsonBlob as Record<string, json>,
  }
}

export class WatchMonitorRepository extends BaseRepository {
  async findLatest(name: string): Promise<WatchMonitorRecord | undefined> {
    const row = await this.db
      .selectFrom('WatchMonitor')
      .selectAll()
      .where('name', '=', name)
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async upsert(record: WatchMonitorRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: WatchMonitorRecord[]): Promise<number> {
    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('WatchMonitor')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['name']).doUpdateSet((eb) => ({
            timestamp: eb.ref('excluded.timestamp'),
            valuesJsonBlob: eb.ref('excluded.valuesJsonBlob'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async getAll(): Promise<WatchMonitorRecord[]> {
    const rows = await this.db.selectFrom('WatchMonitor').selectAll().execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('WatchMonitor').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
