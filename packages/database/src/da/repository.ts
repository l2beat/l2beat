import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../BaseRepository'
import { DaRecord, toRecord, toRow } from './entity'
import { selectDa } from './select'

export class DaRepository extends BaseRepository {
  async getAll(): Promise<DaRecord[]> {
    const rows = await this.db.selectFrom('Da').select(selectDa).execute()
    return rows.map(toRecord)
  }

  async upsertMany(records: DaRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 5_000, async (batch) => {
      await this.db
        .insertInto('Da')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['timestamp', 'project']).doUpdateSet((eb) => ({
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
      .deleteFrom('Da')
      .where((eb) =>
        eb.and([
          eb('project', '=', project.toString()),
          eb('timestamp', '>=', fromInclusive.toDate()),
        ]),
      )
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Da').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getByProjectAndTimeRange(
    project: string,
    timeRange: [UnixTime, UnixTime],
  ): Promise<DaRecord[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('Da')
      .select(selectDa)
      .where('project', '=', project)
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getByProjectAndFrom(
    project: string,
    fromInclusive: UnixTime,
  ): Promise<DaRecord[]> {
    const rows = await this.db
      .selectFrom('Da')
      .select(selectDa)
      .where('project', '=', project)
      .where('timestamp', '>=', fromInclusive.toDate())
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }
}
