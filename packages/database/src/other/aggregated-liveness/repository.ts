import { ProjectId } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { AggregatedLivenessRecord, toRecord, toRow } from './entity'
import { selectAggregatedLiveness } from './select'

export class AggregatedLivenessRepository extends BaseRepository {
  async addOrUpdateMany(records: AggregatedLivenessRecord[]): Promise<number> {
    for (const record of records) {
      await this.addOrUpdate(record)
    }
    return records.length
  }

  async addOrUpdate(record: AggregatedLivenessRecord): Promise<string> {
    const row = toRow(record)
    await this.db
      .insertInto('public.aggregated_liveness')
      .values(row)
      .onConflict((cb) =>
        cb.columns(['project_id', 'subtype', 'range']).doUpdateSet((eb) => ({
          min: eb.ref('excluded.min'),
          avg: eb.ref('excluded.avg'),
          max: eb.ref('excluded.max'),
          updated_at: eb.ref('excluded.updated_at'),
        })),
      )
      .execute()

    return `[${record.projectId}, ${record.subtype}, ${record.range}]: ${record.updatedAt}`
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.aggregated_liveness')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<AggregatedLivenessRecord[]> {
    const rows = await this.db
      .selectFrom('public.aggregated_liveness')
      .select(selectAggregatedLiveness)
      .execute()

    return rows.map(toRecord)
  }

  async getByProject(
    projectId: ProjectId,
  ): Promise<AggregatedLivenessRecord[]> {
    const rows = await this.db
      .selectFrom('public.aggregated_liveness')
      .select(selectAggregatedLiveness)
      .where('project_id', '=', projectId)
      .execute()

    return rows.map(toRecord)
  }
}
