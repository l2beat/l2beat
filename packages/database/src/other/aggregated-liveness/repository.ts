import type { ProjectId } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type AggregatedLivenessRecord, toRecord, toRow } from './entity'
import { selectAggregatedLiveness } from './select'

export class AggregatedLivenessRepository extends BaseRepository {
  async upsert(record: AggregatedLivenessRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: AggregatedLivenessRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('AggregatedLiveness')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['projectId', 'subtype', 'range']).doUpdateSet((eb) => ({
            min: eb.ref('excluded.min'),
            avg: eb.ref('excluded.avg'),
            max: eb.ref('excluded.max'),
            updatedAt: eb.ref('excluded.updatedAt'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedLiveness')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<AggregatedLivenessRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedLiveness')
      .select(selectAggregatedLiveness)
      .execute()
    return rows.map(toRecord)
  }

  async getByProjectId(
    projectId: ProjectId,
  ): Promise<AggregatedLivenessRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedLiveness')
      .select(selectAggregatedLiveness)
      .where('projectId', '=', projectId)
      .execute()
    return rows.map(toRecord)
  }

  async getByProjectIds(
    projectIds: ProjectId[],
  ): Promise<AggregatedLivenessRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedLiveness')
      .select(selectAggregatedLiveness)
      .where('projectId', 'in', projectIds)
      .execute()
    return rows.map(toRecord)
  }
}
