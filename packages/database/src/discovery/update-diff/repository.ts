import { BaseRepository } from '../../BaseRepository'
import { toRecord, toRow, type UpdateDiffRecord } from './entity'

export class UpdateDiffRepository extends BaseRepository {
  async insertMany(records: UpdateDiffRecord[]): Promise<number> {
    if (records.length === 0) return 0

    await this.db
      .insertInto('UpdateDiff')
      .values(records.map(toRow))
      .onConflict((cb) =>
        cb.columns(['projectId', 'address', 'type', 'chain']).doNothing(),
      )
      .execute()

    return records.length
  }

  async getAll() {
    const rows = await this.db.selectFrom('UpdateDiff').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteByProjectAndChain(projectId: string, chain: string) {
    await this.db
      .deleteFrom('UpdateDiff')
      .where('projectId', '=', projectId)
      .where('chain', '=', chain)
      .execute()
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('UpdateDiff').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
