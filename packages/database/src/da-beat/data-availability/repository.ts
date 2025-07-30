import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import {
  type DataAvailabilityRecord,
  type ProjectsSummedDataAvailabilityRecord,
  toProjectsSummedRecord,
  toRecord,
  toRow,
} from './entity'

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
            .columns(['timestamp', 'daLayer', 'projectId', 'configurationId'])
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
      .selectAll()
      .where('daLayer', '=', daLayer)
      .where('timestamp', '>=', UnixTime.toDate(from))
      .where('timestamp', '<', UnixTime.toDate(to))
      .execute()
    return rows.map(toRecord)
  }

  async getForDaLayerByTimestamp(
    daLayer: string,
    timestamp: UnixTime,
  ): Promise<DataAvailabilityRecord[]> {
    const rows = await this.db
      .selectFrom('DataAvailability')
      .selectAll()
      .where('daLayer', '=', daLayer)
      .where('timestamp', '=', UnixTime.toDate(timestamp))
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
      .selectAll()
      .where('projectId', 'in', projectIds)
      .where('timestamp', '<', UnixTime.toDate(to))
      .orderBy('timestamp', 'asc')

    if (from !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    const rows = await query.execute()

    return rows.map(toRecord)
  }

  async getSummedProjectsByDaLayersAndTimeRange(
    daLayers: string[],
    timeRange: [UnixTime | null, UnixTime],
    excludedProjectIds?: string[],
  ): Promise<ProjectsSummedDataAvailabilityRecord[]> {
    const [from, to] = timeRange
    let query = this.db
      .selectFrom('DataAvailability')
      .select([
        'daLayer',
        'timestamp',
        (eb) => eb.fn.sum('totalSize').as('totalSize'),
      ])
      .where('daLayer', 'in', daLayers)
      // Exclude the daLayer itself because we only want to sum the projects
      .whereRef('projectId', '!=', 'daLayer')
      .groupBy(['timestamp', 'daLayer'])
      .where('timestamp', '<', UnixTime.toDate(to))
      .orderBy('timestamp', 'asc')

    if (from !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    if (excludedProjectIds && excludedProjectIds.length > 0) {
      query = query.where('projectId', 'not in', excludedProjectIds)
    }

    const rows = await query.execute()

    return rows.map((row) =>
      toProjectsSummedRecord({
        ...row,
        totalSize: row.totalSize.toString(),
      }),
    )
  }

  async getByDaLayersAndTimeRange(
    daLayers: string[],
    timeRange: [UnixTime | null, UnixTime],
  ): Promise<DataAvailabilityRecord[]> {
    const [from, to] = timeRange
    let query = this.db
      .selectFrom('DataAvailability')
      .selectAll()
      .where('daLayer', 'in', daLayers)
      .where('timestamp', '<', UnixTime.toDate(to))
      .orderBy('timestamp', 'asc')

    if (from !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    const rows = await query.execute()

    return rows.map(toRecord)
  }

  async deleteByConfigurationId(configurationId: string): Promise<number> {
    const result = await this.db
      .deleteFrom('DataAvailability')
      .where('configurationId', '=', configurationId)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  // Test only
  async getAll(): Promise<DataAvailabilityRecord[]> {
    const rows = await this.db
      .selectFrom('DataAvailability')
      .selectAll()
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
