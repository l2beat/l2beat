import { ProjectId } from '@l2beat/shared-pure'
import { QueryCreator } from 'kysely'
import { BaseRepository } from '../../BaseRepository'
import { DB } from '../../kysely'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../../utils/deleteArchivedRecords'
import { ValueRecord, toRecord, toRow } from './entity'
import { selectValue, selectValueWithPrefix } from './select'

export class ValueRepository extends BaseRepository {
  async getForProjects(projectIds: ProjectId[]): Promise<ValueRecord[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('values')
      .select(selectValue)
      .where(
        'project_id',
        'in',
        projectIds.map((id) => id.toString()),
      )
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getLatestValues(projectIds?: ProjectId[]) {
    if (projectIds?.length === 0) return []
    const maxTimestampsQuery = (cb: QueryCreator<DB>) => {
      let query = cb
        .selectFrom('values')
        .select(({ fn }) => [
          'project_id',
          'data_source',
          fn.max('timestamp').as('max_timestamp'),
        ])
        .groupBy(['project_id', 'data_source'])
      if (projectIds) {
        query = query.where(
          'project_id',
          'in',
          projectIds.map((id) => id.toString()),
        )
      }

      return query
    }

    const rows = await this.db
      .with('max_timestamps', maxTimestampsQuery)
      .selectFrom('values')
      .select(selectValueWithPrefix('values'))
      .innerJoin('max_timestamps', (join) =>
        join
          .onRef('values.project_id', '=', 'max_timestamps.project_id')
          .onRef('values.data_source', '=', 'max_timestamps.data_source')
          .onRef('values.timestamp', '=', 'max_timestamps.max_timestamp'),
      )
      .execute()

    return rows.map(toRecord)
  }

  async upsertMany(records: ValueRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('values')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['project_id', 'timestamp', 'data_source'])
            .doUpdateSet((eb) => ({
              external: eb.ref('excluded.external'),
              external_associated: eb.ref('excluded.external_associated'),
              external_for_total: eb.ref('excluded.external_for_total'),
              external_associated_for_total: eb.ref(
                'excluded.external_associated_for_total',
              ),
              canonical: eb.ref('excluded.canonical'),
              canonical_associated: eb.ref('excluded.canonical_associated'),
              canonical_for_total: eb.ref('excluded.canonical_for_total'),
              canonical_associated_for_total: eb.ref(
                'excluded.canonical_associated_for_total',
              ),
              native: eb.ref('excluded.native'),
              native_associated: eb.ref('excluded.native_associated'),
              native_for_total: eb.ref('excluded.native_for_total'),
              native_associated_for_total: eb.ref(
                'excluded.native_associated_for_total',
              ),
              ether: eb.ref('excluded.ether'),
              stablecoin: eb.ref('excluded.stablecoin'),
            })),
        )
        .execute()
    })
    return records.length
  }

  async insertMany(records: ValueRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db.insertInto('values').values(batch).execute()
    })
    return records.length
  }

  // #region methods used only in TvlCleaner

  deleteHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return deleteHourlyUntil(this.db, 'values', dateRange)
  }

  deleteSixHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return deleteSixHourlyUntil(this.db, 'values', dateRange)
  }

  // #endregion

  // #region methods used only in tests

  async getAll(): Promise<ValueRecord[]> {
    const rows = await this.db
      .selectFrom('values')
      .select(selectValue)
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('values').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  // #endregion
}
