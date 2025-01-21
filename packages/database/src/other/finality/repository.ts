import type { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import {
  type FinalityRecord,
  type ProjectFinalityRecord,
  toProjectFinalityRecord,
  toRecord,
  toRow,
} from './entity'
import { selectFinality } from './select'

export class FinalityRepository extends BaseRepository {
  async getAll(): Promise<FinalityRecord[]> {
    const rows = await this.db
      .selectFrom('Finality')
      .select(selectFinality)
      .execute()
    return rows.map(toRecord)
  }

  async findLatestByProjectId(
    projectId: string,
  ): Promise<FinalityRecord | undefined> {
    const row = await this.db
      .selectFrom('Finality')
      .select(selectFinality)
      .where('projectId', '=', projectId)
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
      .selectFrom('Finality')
      .select(selectFinality)
      .where('timestamp', '=', timestamp.toDate())
      .where('projectId', '=', projectId.toString())
      .limit(1)
      .executeTakeFirst()
    return row && toProjectFinalityRecord(row)
  }

  async getLatestGroupedByProjectId(projectIds: string[]) {
    if (projectIds.length === 0) return []

    const maxTimestampSubquery = this.db
      .selectFrom('Finality')
      .select(['projectId', this.db.fn.max('timestamp').as('maxTimestamp')])
      .where(
        'projectId',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .groupBy('projectId')
      .as('maxF')

    const rows = await this.db
      .selectFrom('Finality as f')
      .innerJoin(maxTimestampSubquery, (join) =>
        join
          .onRef('f.projectId', '=', 'maxF.projectId')
          .onRef('f.timestamp', '=', 'maxF.maxTimestamp'),
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
      await this.db.insertInto('Finality').values(batch).execute()
    })
    return rows.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Finality').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
