import { type ProjectValueType, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type ProjectValueRecord, toRecord, toRow } from './entity'

export class ProjectValueRepository extends BaseRepository {
  async upsertMany(records: ProjectValueRecord[]) {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('ProjectValue')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['timestamp', 'project', 'type']).doUpdateSet((eb) => ({
            value: eb.ref('excluded.value'),
            canonical: eb.ref('excluded.canonical'),
            external: eb.ref('excluded.external'),
            native: eb.ref('excluded.native'),
            ether: eb.ref('excluded.ether'),
            stablecoin: eb.ref('excluded.stablecoin'),
            other: eb.ref('excluded.other'),
            associated: eb.ref('excluded.associated'),
          })),
        )
        .execute()
    })

    return records.length
  }

  async trimProject(
    project: string,
    sinceTimestamp: number,
    untilTimestamp: number | null,
  ): Promise<number> {
    let query = this.db
      .deleteFrom('ProjectValue')
      .where('project', '=', project)

    if (untilTimestamp === null) {
      query = query.where('timestamp', '<', UnixTime.toDate(sinceTimestamp))
    } else {
      query = query.where((qb) =>
        qb.or([
          qb('timestamp', '<', UnixTime.toDate(sinceTimestamp)),
          qb('timestamp', '>', UnixTime.toDate(untilTimestamp)),
        ]),
      )
    }

    const result = await query.executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<ProjectValueRecord[]> {
    const rows = await this.db.selectFrom('ProjectValue').selectAll().execute()
    return rows.map(toRecord)
  }

  async getForType(
    type: string,
    range: [number | null, number],
  ): Promise<ProjectValueRecord[]> {
    const [from, to] = range
    let query = this.db
      .selectFrom('ProjectValue')
      .selectAll()
      .where('type', '=', type)
      .where('timestamp', '<=', UnixTime.toDate(to))
      .orderBy('timestamp', 'asc')

    if (from !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    const rows = await query.execute()
    return rows.map(toRecord)
  }

  async getLastestValues(
    type: ProjectValueType,
  ): Promise<ProjectValueRecord[]> {
    const subQuery = this.db
      .selectFrom('ProjectValue')
      .select(['project', this.db.fn.max('timestamp').as('maxTimestamp')])
      .where('type', '=', type)
      .groupBy('project')
      .as('latest')

    const rows = await this.db
      .selectFrom('ProjectValue as pv')
      .innerJoin(subQuery, (join) =>
        join
          .onRef('pv.project', '=', 'latest.project')
          .onRef('pv.timestamp', '=', 'latest.maxTimestamp'),
      )
      .where('pv.type', '=', type)
      .selectAll('pv')
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('ProjectValue').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
