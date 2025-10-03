import { assert } from '@l2beat/shared-pure'
import { BaseRepository } from '../BaseRepository'
import type { DeployedToken } from '../kysely/generated/types'
import { type AsRecord, type AsUpdate, toRecord } from '../utils/typeUtils'

export type DeployedTokenRecord = AsRecord<DeployedToken>
export type DeployedTokenUpdate = AsUpdate<DeployedToken, 'id'>

export class DeployedTokenRepository extends BaseRepository {
  async insert(record: DeployedTokenRecord): Promise<number> {
    const row = await this.db
      .insertInto('DeployedToken')
      .values(record)
      .returning('id')
      .executeTakeFirst()

    assert(row)
    return row.id
  }

  async update(update: DeployedTokenUpdate): Promise<number> {
    const result = await this.db
      .updateTable('DeployedToken')
      .set(update)
      .where('id', '=', update.id)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async findById(id: number): Promise<DeployedTokenRecord | undefined> {
    const result = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    return result ? toRecord(result) : undefined
  }

  async getByIds(ids: number[]): Promise<DeployedTokenRecord[]> {
    const rows = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('id', 'in', ids)
      .execute()

    return rows.map(toRecord)
  }

  async getByAbstractTokenId(id: string): Promise<DeployedTokenRecord[]> {
    const rows = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('abstractTokenId', '=', id)
      .execute()

    return rows.map(toRecord)
  }

  async getAll(): Promise<DeployedTokenRecord[]> {
    const rows = await this.db.selectFrom('DeployedToken').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteByIds(ids: number[]): Promise<number> {
    const result = await this.db
      .deleteFrom('DeployedToken')
      .where('id', 'in', ids)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<bigint> {
    const result = await this.db.deleteFrom('DeployedToken').executeTakeFirst()
    return result.numDeletedRows
  }
}
