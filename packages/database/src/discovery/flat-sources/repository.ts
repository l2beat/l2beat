import { ChainId } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { FlatSourcesRecord, toRecord, toRow } from './entity'
import { selectFlatSources } from './select'

export class FlatSourcesRepository extends BaseRepository {
  async upsert(record: FlatSourcesRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: FlatSourcesRecord[]): Promise<number> {
    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('FlatSources')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['projectName', 'chainId'])
            .doUpdateSet((eb) => ({
              blockNumber: eb.ref('excluded.blockNumber'),
              contentHash: eb.ref('excluded.contentHash'),
              flat: eb.ref('excluded.flat'),
            }))
            .where('FlatSources.contentHash', '<>', 'excluded.contentHash'),
        )
        .execute()
    })
    return records.length
  }

  async getAll(): Promise<FlatSourcesRecord[]> {
    const rows = await this.db
      .selectFrom('FlatSources')
      .select(selectFlatSources)
      .execute()

    return rows.map(toRecord)
  }

  async get(
    projectName: string,
    chainId: ChainId,
  ): Promise<FlatSourcesRecord | undefined> {
    const row = await this.db
      .selectFrom('FlatSources')
      .select(selectFlatSources)
      .where('projectName', '=', projectName)
      .where('chainId', '=', +chainId)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('FlatSources').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
