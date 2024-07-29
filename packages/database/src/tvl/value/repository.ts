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
        'project_id',
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
        'project_id',
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
      .with('latest_values', (cb) =>
        cb
          .selectFrom('public.values')
          .select([
            ...selectValue,
            this.db.fn
              .agg('ROW_NUMBER')
              .over((over) =>
                over
                  .partitionBy(['project_id', 'data_source'])
                  .orderBy('timestamp', 'desc'),
              )
              .as('combination_number'),
          ])
          .where(
            'project_id',
            'in',
            projectIds.map((id) => id.toString()),
          ),
      )
      .selectFrom('latest_values')
      .select(selectValue)
      .where('combination_number', '=', 1)
      .execute()

    return rows.map(toRecord)
  }
}
