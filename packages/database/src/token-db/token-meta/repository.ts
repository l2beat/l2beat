import { BaseRepository } from '../../BaseRepository'
import { TokenMetaRecord, toRow } from './entity'

export class TokenMetaRepository extends BaseRepository {
  async upsertMany(records: TokenMetaRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('public.TokenMeta')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['tokenId', 'source']).doUpdateSet((eb) => ({
            tokenId: eb.ref('excluded.tokenId'),
            source: eb.ref('excluded.source'),
          })),
        )
        .returning('public.TokenMeta.id')
        .execute()
    })
    return records.length
  }
}
