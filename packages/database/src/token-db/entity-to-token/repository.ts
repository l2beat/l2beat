import { BaseRepository } from '../../BaseRepository'
import { EntityToTokenRecord } from './entity'

export class EntityToTokenRepository extends BaseRepository {
  async getEntityIdsByTokenId(tokenId: string): Promise<string[]> {
    const result = await this.db
      .selectFrom('_EntityToToken')
      .select('_EntityToToken.A')
      .where('_EntityToToken.B', '=', tokenId)
      .execute()
    return result.map((r) => r.A)
  }

  async upsertManyOfTokenId(records: EntityToTokenRecord[]): Promise<void> {
    await this.db
      .insertInto('_EntityToToken')
      .values(
        records.map(({ tokenId, entityId }) => ({ A: entityId, B: tokenId })),
      )
      .execute()
  }

  async deleteByTokenId(tokenId: string): Promise<void> {
    await this.db
      .deleteFrom('_EntityToToken')
      .where('_EntityToToken.B', '=', tokenId)
      .execute()
  }
}
