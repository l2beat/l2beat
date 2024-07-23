import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase } from '../kysely'
import { ActivityRecord, toRecord, toRow } from './entity'
import { selectActivity } from './select'

const BATCH_SIZE = 5_000

export class ActivityRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async getAll(): Promise<ActivityRecord[]> {
    const rows = await this.db
      .selectFrom('public.activity')
      .select(selectActivity)
      .execute()

    return rows.map(toRecord)
  }

  async addOrUpdateMany(records: ActivityRecord[]): Promise<number> {
    const rows = records.map(toRow)

    await this.db.transaction().execute(async (trx) => {
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        await trx
          .insertInto('public.activity')
          .values(rows.slice(i, i + BATCH_SIZE))
          .onConflict((cb) =>
            cb.columns(['timestamp', 'project_id']).doUpdateSet({
              count: (eb) => eb.ref('excluded.count'),
            }),
          )
          .execute()
      }
    })

    return records.length
  }

  async deleteAfter(from: UnixTime, projectId: ProjectId): Promise<void> {
    await this.db
      .deleteFrom('public.activity')
      .where((eb) =>
        eb.and([
          eb('project_id', '=', projectId.toString()),
          eb('timestamp', '>', from.toDate()),
        ]),
      )
      .execute()
  }

  async deleteAll(): Promise<void> {
    await this.db.deleteFrom('public.activity').execute()
  }

  async getByProjectAndTimeRange(
    projectId: ProjectId,
    timeRange: [UnixTime, UnixTime],
  ): Promise<ActivityRecord[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('public.activity')
      .select(selectActivity)
      .where((eb) =>
        eb.and([
          eb('project_id', '=', projectId.toString()),
          eb('timestamp', '>=', from.toDate()),
          eb('timestamp', '<=', to.toDate()),
        ]),
      )
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }
}
