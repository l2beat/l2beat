import { BaseRepository } from '../../BaseRepository'
import { EntityToExternalBridgeRecord } from './entity'

export class EntityToExternalBridgeRepository extends BaseRepository {
  async getEntityIdsByExternalBridgeId(
    externalBridgeId: string,
  ): Promise<string[]> {
    const result = await this.db
      .selectFrom('_EntityToExternalBridge')
      .select('_EntityToExternalBridge.A')
      .where('_EntityToExternalBridge.B', '=', externalBridgeId)
      .execute()
    return result.map((r) => r.A)
  }

  async upsertManyOfExternalBridgeId(
    records: EntityToExternalBridgeRecord[],
  ): Promise<void> {
    if (records.length === 0) return

    await this.db
      .insertInto('_EntityToExternalBridge')
      .values(
        records.map(({ externalBridgeId, entityId }) => ({
          A: entityId,
          B: externalBridgeId,
        })),
      )
      .execute()
  }

  async deleteByExternalBridgeId(externalBridgeId: string): Promise<void> {
    await this.db
      .deleteFrom('_EntityToExternalBridge')
      .where('_EntityToExternalBridge.B', '=', externalBridgeId)
      .execute()
  }
}
