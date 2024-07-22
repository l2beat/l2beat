import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase } from '../kysely'
import { batchExecute } from '../utils/batchExecute'
import { ActivityRecord, toRecord, toRow } from './entity'
import { selectActivity } from './select'

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

    await batchExecute(this.db, rows, 5_000, async (trx, batch) => {
      await trx
        .insertInto('public.activity')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['timestamp', 'project_id']).doUpdateSet((eb) => ({
            count: eb.ref('excluded.count'),
          })),
        )
        .execute()
    })

    return records.length
  }

  async deleteAfter(from: UnixTime): Promise<void> {
    await this.db
      .deleteFrom('public.activity')
      .where('timestamp', '>', from.toDate())
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
      .where('project_id', '=', projectId.toString())
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<', to.toDate())
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }
}
