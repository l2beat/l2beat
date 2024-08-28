import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import {
  FinalityRecord,
  ProjectFinalityRecord,
  toProjectFinalityRecord,
  toRecord,
  toRow,
} from './entity'
import { selectFinality } from './select'

export class FinalityRepository extends BaseRepository {
  async getAll(): Promise<FinalityRecord[]> {
    const rows = await this.db
      .selectFrom('finality')
      .select(selectFinality)
      .execute()
    return rows.map(toRecord)
  }

  async findLatestByProjectId(
    projectId: string,
  ): Promise<FinalityRecord | undefined> {
    const row = await this.db
      .selectFrom('finality')
      .select(selectFinality)
      .where('project_id', '=', projectId)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async findProjectFinalityOnTimestamp(
    projectId: string,
    timestamp: UnixTime,
  ): Promise<ProjectFinalityRecord | undefined> {
    const row = await this.db
      .selectFrom('finality')
      .select(selectFinality)
      .where('timestamp', '=', timestamp.toDate())
      .where('project_id', '=', projectId.toString())
      .limit(1)
      .executeTakeFirst()
    return row && toProjectFinalityRecord(row)
  }

  async getLatestGroupedByProjectId(projectIds: string[]) {
    if (projectIds.length === 0) return []

    const maxTimestampSubquery = this.db
      .selectFrom('finality')
      .select(['project_id', this.db.fn.max('timestamp').as('max_timestamp')])
      .where(
        'project_id',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .groupBy('project_id')
      .as('max_f')

    const rows = await this.db
      .selectFrom('finality as f')
      .innerJoin(maxTimestampSubquery, (join) =>
        join
          .onRef('f.project_id', '=', 'max_f.project_id')
          .onRef('f.timestamp', '=', 'max_f.max_timestamp'),
      )
      .select(selectFinality.map((column) => `f.${column}` as const))
      .execute()

    return rows.map(toRecord)
  }

  async insert(record: FinalityRecord): Promise<void> {
    await this.insertMany([record])
  }

  async insertMany(records: FinalityRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('finality').values(batch).execute()
    })
    return rows.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('finality').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
