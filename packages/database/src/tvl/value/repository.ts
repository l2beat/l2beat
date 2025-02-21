import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import {
  type CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../../utils/deleteArchivedRecords'
import { type ValueRecord, toRecord, toRow } from './entity'
import { selectValue } from './select'

export class ValueRepository extends BaseRepository {
  async getForProjects(projectIds: ProjectId[]): Promise<ValueRecord[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('Value')
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

  async getValuesByProjectIdsAndTimeRange(
    projectIds: ProjectId[],
    timeRange: [UnixTime, UnixTime],
  ): Promise<ValueRecord[]> {
    if (projectIds?.length === 0) return []
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('Value')
      .select(selectValue)
      .where(
        'projectId',
        'in',
        projectIds.map((id) => id.toString()),
      )
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async upsertMany(records: ValueRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('Value')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['projectId', 'timestamp', 'dataSource'])
            .doUpdateSet((eb) => ({
              external: eb.ref('excluded.external'),
              externalAssociated: eb.ref('excluded.externalAssociated'),
              externalForTotal: eb.ref('excluded.externalForTotal'),
              externalAssociatedForTotal: eb.ref(
                'excluded.externalAssociatedForTotal',
              ),
              canonical: eb.ref('excluded.canonical'),
              canonicalAssociated: eb.ref('excluded.canonicalAssociated'),
              canonicalForTotal: eb.ref('excluded.canonicalForTotal'),
              canonicalAssociatedForTotal: eb.ref(
                'excluded.canonicalAssociatedForTotal',
              ),
              native: eb.ref('excluded.native'),
              nativeAssociated: eb.ref('excluded.nativeAssociated'),
              nativeForTotal: eb.ref('excluded.nativeForTotal'),
              nativeAssociatedForTotal: eb.ref(
                'excluded.nativeAssociatedForTotal',
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
      await this.db.insertInto('Value').values(batch).execute()
    })
    return records.length
  }

  // #region methods used only in TvlCleaner

  deleteHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return deleteHourlyUntil(this.db, 'Value', dateRange)
  }

  deleteSixHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return deleteSixHourlyUntil(this.db, 'Value', dateRange)
  }

  // #endregion

  // #region methods used only in tests

  async getAll(): Promise<ValueRecord[]> {
    const rows = await this.db.selectFrom('Value').select(selectValue).execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Value').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  // #endregion
}
