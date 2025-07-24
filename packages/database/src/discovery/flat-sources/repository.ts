import { type ChainId, Hash256 } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type FlatSourcesRecord, toRecord, toRow } from './entity'

export class FlatSourcesRepository extends BaseRepository {
  async upsert(record: FlatSourcesRecord): Promise<void> {
    const { projectId, chainId, timestamp, contentHash, flat } = record

    await this.transaction(async () => {
      const existing = await this.db
        .selectFrom('FlatSources')
        .select(['contentHash']) // <-- don't download flat sources
        .where('projectId', '=', projectId)
        .where('chainId', '=', +chainId)
        .forUpdate() // <-- lock the row for upcoming update
        .executeTakeFirst()

      if (existing) {
        const hashChanged = Hash256(existing.contentHash) !== contentHash
        const update = toRow(
          { projectId, chainId, timestamp, contentHash },
          hashChanged ? flat : undefined,
        )
        await this.db
          .updateTable('FlatSources')
          .set(update)
          .where('projectId', '=', projectId)
          .where('chainId', '=', +chainId)
          .execute()
      } else {
        await this.db
          .insertInto('FlatSources')
          .values(toRow({ projectId, chainId, timestamp, contentHash }, flat))
          .execute()
      }
    })
  }

  async getAll(): Promise<FlatSourcesRecord[]> {
    const rows = await this.db.selectFrom('FlatSources').selectAll().execute()

    return rows.map(toRecord)
  }

  async get(
    projectId: string,
    chainId: ChainId,
  ): Promise<FlatSourcesRecord | undefined> {
    const row = await this.db
      .selectFrom('FlatSources')
      .selectAll()
      .where('projectId', '=', projectId)
      .where('chainId', '=', +chainId)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('FlatSources').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
