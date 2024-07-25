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
      .executeTakeFirst()

    return row ? row.id : undefined
  }

  async insert(
    record: Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    const row = toRow(record)

    const insertedResult = await this.db
      .insertInto('public.update_notifier')
      .values(row)
      .returning('id')
      .executeTakeFirst()

    return insertedResult?.id
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
