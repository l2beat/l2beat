import type { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type DataAvailabilityRecord, toRecord, toRow } from './entity'
import { selectDataAvailability } from './select'

export class DataAvailabilityRepository extends BaseRepository {
  async upsertMany(records: DataAvailabilityRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 5_000, async (batch) => {
      await this.db
        .insertInto('DataAvailability')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['timestamp', 'daLayer', 'projectId'])
            .doUpdateSet((eb) => ({
              totalSize: eb.ref('excluded.totalSize'),
            })),
        )
        .execute()
    })
    return records.length
  }

  async getForDaLayerInTimeRange(
    daLayer: string,
    from: UnixTime,
    to: UnixTime,
  ): Promise<DataAvailabilityRecord[]> {
    const rows = await this.db
      .selectFrom('DataAvailability')
      .select(selectDataAvailability)
      .where('daLayer', '=', daLayer)
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .execute()
    return rows.map(toRecord)
  }

  async getByProjectIdsAndTimeRange(
    projectIds: string[],
    timeRange: [UnixTime | null, UnixTime],
  ): Promise<DataAvailabilityRecord[]> {
    const [from, to] = timeRange
    let query = this.db
      .selectFrom('DataAvailability')
      .select(selectDataAvailability)
      .where('projectId', 'in', projectIds)
      .where('timestamp', '<=', to.toDate())
      .orderBy('timestamp', 'asc')

    if (from) {
      query = query.where('timestamp', '>=', from.toDate())
    }

    const rows = await query.execute()

    return rows.map(toRecord)
  }

  async getLargestPosterByProjectIdsAndTimestamp(
    projectIds: string[],
    timestamp: UnixTime,
  ) {
    const row = await this.db
      .selectFrom('DataAvailability')
      .select(selectDataAvailability)
      .where('projectId', 'in', projectIds)
      .where('timestamp', '=', timestamp.toDate())
      .orderBy('totalSize', 'desc')
      .limit(1)
      .executeTakeFirst()

    return row && toRecord(row)
  }

  async deleteByProject(projectId: string, daLayer: string): Promise<number> {
    const result = await this.db
      .deleteFrom('DataAvailability')
      .where('projectId', '=', projectId)
      .where('daLayer', '=', daLayer)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  // Test only
  async getAll(): Promise<DataAvailabilityRecord[]> {
    const rows = await this.db
      .selectFrom('DataAvailability')
      .select(selectDataAvailability)
      .execute()
    return rows.map(toRecord)
  }

  // Test only
  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('DataAvailability')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
