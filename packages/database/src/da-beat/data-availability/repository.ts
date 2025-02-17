import type { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type DataAvailabilityRecord, toRecord, toRow } from './entity'
import { selectDataAvailability } from './select'

// TODO: cleanup unused methods after removing EthereumDaIndexer
export class DataAvailabilityRepository extends BaseRepository {
  async getAll(): Promise<DataAvailabilityRecord[]> {
    const rows = await this.db
      .selectFrom('DataAvailability')
      .select(selectDataAvailability)
      .execute()
    return rows.map(toRecord)
  }

  async upsertMany(records: DataAvailabilityRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 5_000, async (batch) => {
      await this.db
        .insertInto('DataAvailability')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['timestamp', 'configurationId']).doUpdateSet((eb) => ({
            totalSize: eb.ref('excluded.totalSize'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async deleteByProjectFrom(
    project: string,
    fromInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('DataAvailability')
      .where((eb) =>
        eb.and([
          eb('projectId', '=', project.toString()),
          eb('timestamp', '>=', fromInclusive.toDate()),
        ]),
      )
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('DataAvailability')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getByProjectAndTimeRange(
    projectId: string,
    timeRange: [UnixTime, UnixTime],
  ): Promise<DataAvailabilityRecord[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('DataAvailability')
      .select(selectDataAvailability)
      .where('projectId', '=', projectId)
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getByProjectIdsAndTimeRange(
    projectIds: string[],
    timeRange: [UnixTime, UnixTime],
  ): Promise<DataAvailabilityRecord[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('DataAvailability')
      .select(selectDataAvailability)
      .where('projectId', 'in', projectIds)
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .orderBy('timestamp', 'asc')
      .execute()

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

  async getByProjectIdAndFrom(
    projectId: string,
    fromInclusive: UnixTime,
  ): Promise<DataAvailabilityRecord[]> {
    const rows = await this.db
      .selectFrom('DataAvailability')
      .select(selectDataAvailability)
      .where('projectId', '=', projectId)
      .where('timestamp', '>=', fromInclusive.toDate())
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }
}
