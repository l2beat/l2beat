import { BaseRepository } from '../../BaseRepository'
import { type RealTimeAnomalyRecord, toRecord, toRow } from './entity'

export class RealTimeAnomaliesRepository extends BaseRepository {
  async upsert(record: RealTimeAnomalyRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: RealTimeAnomalyRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('RealTimeAnomaly')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['start', 'projectId', 'subtype']).doUpdateSet((eb) => ({
            status: eb.ref('excluded.status'),
            isApproved: eb.ref('excluded.isApproved'),
            end: eb.ref('excluded.end'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async getAll(): Promise<RealTimeAnomalyRecord[]> {
    const rows = await this.db
      .selectFrom('RealTimeAnomaly')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getOngoingAnomalies(
    projectIds?: string[],
  ): Promise<RealTimeAnomalyRecord[]> {
    let query = this.db
      .selectFrom('RealTimeAnomaly')
      .selectAll()
      .where('status', '=', 'ongoing')

    if (projectIds) {
      if (projectIds.length === 0) {
        return []
      }
      query = query.where('projectId', 'in', projectIds)
    }

    const rows = await query.execute()

    return rows.map(toRecord)
  }

  async getApprovedAnomaliesByProjectIds(
    projectIds: string[],
  ): Promise<RealTimeAnomalyRecord[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('RealTimeAnomaly')
      .selectAll()
      .where('isApproved', '=', true)
      .where('projectId', 'in', projectIds)
      .execute()

    return rows.map(toRecord)
  }

  async getApprovedOngoingAnomalies(): Promise<RealTimeAnomalyRecord[]> {
    const rows = await this.db
      .selectFrom('RealTimeAnomaly')
      .selectAll()
      .where('isApproved', '=', true)
      .where('status', '=', 'ongoing')
      .execute()

    return rows.map(toRecord)
  }

  async getProjectIds(): Promise<string[]> {
    const rows = await this.db
      .selectFrom('RealTimeAnomaly')
      .select(['projectId'])
      .groupBy('projectId')
      .execute()

    return rows.map((row) => row.projectId)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('RealTimeAnomaly')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByProjectId(projectIds: string[]): Promise<number> {
    const result = await this.db
      .deleteFrom('RealTimeAnomaly')
      .where('projectId', 'in', projectIds)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
