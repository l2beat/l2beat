import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { BlockTransactionCountRecord, toRecord, toRow } from './entity'
import { selectBlockTransactionCount } from './select'

export class BlockTransactionCountRepository extends BaseRepository {
  async addOrUpdateMany(
    records: BlockTransactionCountRecord[],
  ): Promise<number> {
    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('activity.block')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['project_id', 'block_number']).doUpdateSet((eb) => ({
            unix_timestamp: eb.ref('excluded.unix_timestamp'),
            count: eb.ref('excluded.count'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('activity.block').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async findLastTimestampByProjectId(
    projectId: ProjectId,
  ): Promise<UnixTime | undefined> {
    const row = await this.db
      .selectFrom('activity.block')
      .select('unix_timestamp')
      .where('project_id', '=', projectId.toString())
      .orderBy('block_number', 'desc')
      .executeTakeFirst()
    return row && UnixTime.fromDate(row.unix_timestamp)
  }

  async getAll(): Promise<BlockTransactionCountRecord[]> {
    const rows = await this.db
      .selectFrom('activity.block')
      .select(selectBlockTransactionCount)
      .execute()
    return rows.map(toRecord)
  }
}
