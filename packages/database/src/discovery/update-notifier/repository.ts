import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { UpdateNotifierRecord, toRecord, toRow } from './entity'
import { selectUpdateNotifier } from './select'

export class UpdateNotifierRepository extends BaseRepository {
  async findLatestId(): Promise<number | undefined> {
    const row = await this.db
      .selectFrom('public.update_notifier')
      .select(['id'])
      .orderBy('id', 'desc')
      .limit(1)
      .executeTakeFirst()
    return row?.id
  }

  async insert(
    record: Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number> {
    const [id] = await this.insertMany([record])
    // biome-ignore lint/style/noNonNullAssertion: guaranteed by the query
    return id!
  }

  async insertMany(
    records: Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<number[]> {
    if (records.length === 0) return []

    const rows = records.map(toRow)
    const ids: number[] = []
    await this.batch(rows, 1_000, async (batch) => {
      const results = await this.db
        .insertInto('public.update_notifier')
        .values(batch)
        .returning('id')
        .execute()
      ids.push(...results.map((result) => result.id))
    })
    return ids
  }

  async getAll(): Promise<UpdateNotifierRecord[]> {
    const rows = await this.db
      .selectFrom('public.update_notifier')
      .select(selectUpdateNotifier)
      .execute()

    return rows.map(toRecord)
  }

  async getNewerThan(
    from: UnixTime,
    projectName: string,
    chainId: ChainId,
  ): Promise<UpdateNotifierRecord[]> {
    const rows = await this.db
      .selectFrom('public.update_notifier')
      .select(selectUpdateNotifier)
      .where('created_at', '>=', from.toDate())
      .where('project_name', '=', projectName)
      .where('chain_id', '=', +chainId)
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.update_notifier')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
