import { BaseRepository } from '../../BaseRepository'
import { EntityRecord, UpsertableEntityRecord, upsertableToRow } from './entity'
import { selectEntity } from './select'

export class EntityRepository extends BaseRepository {
  async findById(id: string): Promise<EntityRecord | null> {
    return (
      (await this.db
        .selectFrom('Entity')
        .select(selectEntity)
        .where('Entity.id', '=', id)
        .executeTakeFirst()) ?? null
    )
  }

  async getAll(): Promise<EntityRecord[]> {
    return await this.db.selectFrom('Entity').select(selectEntity).execute()
  }

  async insert(record: UpsertableEntityRecord): Promise<string> {
    const row = upsertableToRow(record)
    await this.db.insertInto('Entity').values(row).execute()
    return row.id
  }

  async update(id: string, record: Partial<EntityRecord>): Promise<void> {
    await this.db
      .updateTable('Entity')
      .set(record)
      .where('Entity.id', '=', id)
      .execute()
  }

  async delete(id: string): Promise<void> {
    await this.db.deleteFrom('Entity').where('Entity.id', '=', id).execute()
  }
}
