import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../../utils/deleteArchivedRecords'
import { ValueRecord, toRecord, toRow } from './entity'
import { selectValue } from './select'

export class ValueRepository extends BaseRepository {
  async getForProjects(projectIds: ProjectId[]): Promise<ValueRecord[]> {
    if (projectIds.length === 0) {
      return []
    }

    const rows = await this.db
      .selectFrom('public.values')
      .select(selectValue)
      .where(
        'projectId',
        'in',
        projectIds.map((id) => id.toString()),
      )
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async getForProjectsInRange(
    projectIds: ProjectId[],
    { from, to = UnixTime.now() }: { from: UnixTime; to?: UnixTime },
  ): Promise<ValueRecord[]> {
    if (projectIds.length === 0) {
      return []
    }

    const rows = await this.db
      .selectFrom('public.values')
      .select(selectValue)
      .where(
        'projectId',
        'in',
        projectIds.map((id) => id.toString()),
      )
      .where('timestamp', '>', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async addOrUpdateMany(records: ValueRecord[]): Promise<number> {
    const rows = records.map(toRow)

    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('public.values')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns([
              'projectId',
              'timestamp',
              'dataSource',
              'type',
              'forTotal',
            ])
            .doUpdateSet((eb) => ({
              external: eb.ref('excluded.external'),
              canonical: eb.ref('excluded.canonical'),
              native: eb.ref('excluded.native'),
            })),
        )
        .execute()
    })

    return records.length
  }

  // #region methods used only in TvlCleaner

  deleteHourlyUntil(dateRange: CleanDateRange) {
    return deleteHourlyUntil(this.db, 'public.values', dateRange)
  }

  deleteSixHourlyUntil(dateRange: CleanDateRange) {
    return deleteSixHourlyUntil(this.db, 'public.values', dateRange)
  }

  // #endregion

  // #region methods used only in tests

  async getAll(): Promise<ValueRecord[]> {
    const rows = await this.db
      .selectFrom('public.values')
      .select(selectValue)
      .execute()

    return rows.map(toRecord)
  }

  async addMany(records: ValueRecord[]): Promise<number> {
    const rows = records.map(toRow)
    await this.db
      .insertInto('public.values')
      .values(rows)
      .onConflict((cb) =>
        cb
          .columns(['projectId', 'timestamp', 'dataSource', 'type', 'forTotal'])
          .doUpdateSet((eb) => ({
            external: eb.ref('excluded.external'),
            canonical: eb.ref('excluded.canonical'),
            native: eb.ref('excluded.native'),
          })),
      )
      .execute()

    return rows.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('public.values').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  // #endregion

  //# region DA-BEAT

  /**
   * For each projectId x data source pick the latest value according to latest timestamp
   */
  async getLatestValuesForProjects(
    projectIds: ProjectId[],
  ): Promise<ValueRecord[]> {
    if (projectIds.length === 0) {
      return []
    }

    const rows = await this.db
      .with('latestValues', (cb) =>
        cb
          .selectFrom('public.values')
          .select([
            ...selectValue,
            this.db.fn
              .agg('ROW_NUMBER')
              .over((over) =>
                over
                  .partitionBy(['projectId', 'dataSource'])
                  .orderBy('timestamp', 'desc'),
              )
              .as('combinationNumber'),
          ])
          .where(
            'projectId',
            'in',
            projectIds.map((id) => id.toString()),
          ),
      )
      .selectFrom('latestValues')
      .select(selectValue)
      .where('combinationNumber', '=', 1)
      .execute()

    return rows.map(toRecord)
  }
}
