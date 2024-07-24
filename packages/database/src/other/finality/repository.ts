import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { batchExecute } from '../../utils/batchExecute'
import {
  FinalityRecord,
  toProjectFinalityRecord,
  toRecord,
  toRow,
} from './entity'
import { selectFinality } from './select'

export class FinalityRepository extends BaseRepository {
  async getAll() {
    const rows = await this.getDb()
      .selectFrom('public.finality')
      .select(selectFinality)
      .execute()

    return rows.map(toRecord)
  }

  async findLatestByProjectId(projectId: string) {
    const row = await this.getDb()
      .selectFrom('public.finality')
      .select(selectFinality)
      .where('project_id', '=', projectId)
      .orderBy('timestamp', 'desc')
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async findProjectFinalityOnTimestamp(projectId: string, timestamp: UnixTime) {
    const row = await this.getDb()
      .selectFrom('public.finality')
      .select(selectFinality)
      .where('timestamp', '=', timestamp.toDate())
      .where('project_id', '=', projectId.toString())
      .limit(1)
      .executeTakeFirst()

    return row ? toProjectFinalityRecord(row) : undefined
  }

  async getLatestGroupedByProjectId(projectIds: string[]) {
    if (projectIds.length === 0) {
      return []
    }
    const maxTimestampSubquery = this.getDb()
      .selectFrom('public.finality')
      .select([
        'project_id',
        this.getDb().fn.max('timestamp').as('max_timestamp'),
      ])
      .where(
        'project_id',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .groupBy('project_id')
      .as('max_f')

    const rows = await this.getDb()
      .selectFrom('public.finality as f')
      .innerJoin(maxTimestampSubquery, (join) =>
        join
          .onRef('f.project_id', '=', 'max_f.project_id')
          .onRef('f.timestamp', '=', 'max_f.max_timestamp'),
      )
      .select(selectFinality.map((column) => `f.${column}` as const))
      .execute()

    return rows.map(toRecord)
  }

  async addMany(records: FinalityRecord[]) {
    if (records.length === 0) {
      return 0
    }

    const rows = records.map(toRow)

    await batchExecute(this.getDb(), rows, 10_000, async (trx, batch) => {
      await trx.insertInto('public.finality').values(batch).execute()
    })

    return rows.length
  }

  async add(record: FinalityRecord) {
    const row = toRow(record)

    const result = await this.getDb()
      .insertInto('public.finality')
      .values(row)
      .returning('project_id')
      .executeTakeFirst()

    return result?.project_id
  }

  async deleteAll(): Promise<number> {
    const result = await this.getDb()
      .deleteFrom('public.finality')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
