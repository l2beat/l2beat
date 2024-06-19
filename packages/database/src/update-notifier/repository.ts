import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { UpdateNotifier, toRecord, toRow } from './entity'
import { selectUpdateNotifier } from './select'

export class UpdateNotifierRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findLatestId(): Promise<number | undefined> {
    const row = await this.db
      .selectFrom('update_notifier')
      .select(['id'])
      .orderBy('id', 'desc')
      .executeTakeFirst()

    return row ? row.id : undefined
  }

  async add(
    record: Omit<UpdateNotifier, 'id' | 'createdAt' | 'updatedAt'>,
    trx?: Transaction,
  ) {
    const scope = trx ?? this.db
    const row = toRow(record)

    const [insertedResult] = await scope
      .insertInto('update_notifier')
      .values(row)
      .returning('id')
      .execute()

    return insertedResult?.id
  }

  async getAll(): Promise<UpdateNotifier[]> {
    const rows = await this.db
      .selectFrom('update_notifier')
      .select(selectUpdateNotifier)
      .execute()

    return rows.map(toRecord)
  }

  async getNewerThan(
    from: UnixTime,
    projectName: string,
    chainId: ChainId,
  ): Promise<UpdateNotifier[]> {
    const rows = await this.db
      .selectFrom('update_notifier')
      .select(selectUpdateNotifier)
      .where((eb) =>
        eb.and([
          eb('created_at', '>=', from.toDate()),
          eb('project_name', '=', projectName),
          eb('chain_id', '=', +chainId),
        ]),
      )
      .execute()

    return rows.map(toRecord)
  }

  deleteAll() {
    return this.db.deleteFrom('update_notifier').execute()
  }
}
