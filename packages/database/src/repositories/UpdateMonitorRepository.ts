import type { DiscoveryOutput } from '@l2beat/discovery'
import { Hash256, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { UpdateMonitor } from '../kysely/generated/types'

export interface UpdateMonitorRecord {
  projectId: string
  blockNumber: number
  timestamp: UnixTime | null
  discovery: DiscoveryOutput
  configHash: Hash256
}

export function toRow(record: UpdateMonitorRecord): Insertable<UpdateMonitor> {
  return {
    projectId: record.projectId,
    blockNumber: record.blockNumber,
    timestamp:
      record.timestamp !== null ? UnixTime.toDate(record.timestamp) : null,
    discoveryJsonBlob: JSON.stringify(record.discovery),
    configHash: record.configHash.toString(),
  }
}

export function toRecord(row: Selectable<UpdateMonitor>): UpdateMonitorRecord {
  return {
    projectId: row.projectId,
    blockNumber: row.blockNumber,
    timestamp: row.timestamp ? UnixTime.fromDate(row.timestamp) : null,
    discovery: row.discoveryJsonBlob as unknown as DiscoveryOutput,
    configHash: Hash256(row.configHash),
  }
}

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
