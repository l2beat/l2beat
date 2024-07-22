import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../utils/deleteArchivedRecords'
import { ValueRecord, toRecord, toRow } from './entity'
import { selectValue } from './select'

const BATCH_SIZE = 2_000

export class ValueRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async getForProjects(projectIds: ProjectId[]): Promise<ValueRecord[]> {
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
    await this.db.transaction().execute(async (trx) => {
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        await this._addOrUpdateMany(records.slice(i, i + BATCH_SIZE), trx)
      }
    })

    return records.length
  }

  private async _addOrUpdateMany(records: ValueRecord[], trx: Transaction) {
    const rows = records.map(toRow)

    await trx
      .insertInto('public.values')
      .values(rows)
      .onConflict((cb) =>
        cb.columns(['project_id', 'timestamp', 'data_source']).doUpdateSet({
          external: (eb) => eb.ref('excluded.external'),
          external_associated: (eb) => eb.ref('excluded.external_associated'),
          external_for_total: (eb) => eb.ref('excluded.external_for_total'),
          external_associated_for_total: (eb) =>
            eb.ref('excluded.external_associated_for_total'),
          canonical: (eb) => eb.ref('excluded.canonical'),
          canonical_associated: (eb) => eb.ref('excluded.canonical_associated'),
          canonical_for_total: (eb) => eb.ref('excluded.canonical_for_total'),
          canonical_associated_for_total: (eb) =>
            eb.ref('excluded.canonical_associated_for_total'),
          native: (eb) => eb.ref('excluded.native'),
          native_associated: (eb) => eb.ref('excluded.native_associated'),
          native_for_total: (eb) => eb.ref('excluded.native_for_total'),
          native_associated_for_total: (eb) =>
            eb.ref('excluded.native_associated_for_total'),
        }),
      )
      .execute()
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

  async addMany(records: ValueRecord[], trx?: Transaction): Promise<number> {
    const rows = records.map(toRow)
    const scope = trx ?? this.db

    await scope
      .insertInto('public.values')
      .values(rows)
      .onConflict((cb) =>
        cb.columns(['project_id', 'timestamp', 'data_source']).doUpdateSet({
          external: (eb) => eb.ref('excluded.external'),
          external_associated: (eb) => eb.ref('excluded.external_associated'),
          external_for_total: (eb) => eb.ref('excluded.external_for_total'),
          external_associated_for_total: (eb) =>
            eb.ref('excluded.external_associated_for_total'),
          canonical: (eb) => eb.ref('excluded.canonical'),
          canonical_associated: (eb) => eb.ref('excluded.canonical_associated'),
          canonical_for_total: (eb) => eb.ref('excluded.canonical_for_total'),
          canonical_associated_for_total: (eb) =>
            eb.ref('excluded.canonical_associated_for_total'),
          native: (eb) => eb.ref('excluded.native'),
          native_associated: (eb) => eb.ref('excluded.native_associated'),
          native_for_total: (eb) => eb.ref('excluded.native_for_total'),
          native_associated_for_total: (eb) =>
            eb.ref('excluded.native_associated_for_total'),
        }),
      )
      .execute()

    return rows.length
  }

  deleteAll() {
    return this.db.deleteFrom('public.values').execute()
  }

  // #endregion

  //# region DA-BEAT

  /**
   * For each projectId x data source pick the latest value according to latest timestamp
   */
  async getLatestValuesForProjects(
    projectIds: ProjectId[],
  ): Promise<ValueRecord[]> {
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
