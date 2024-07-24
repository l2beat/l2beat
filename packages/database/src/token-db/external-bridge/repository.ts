import { BaseRepository } from '../../BaseRepository'
import { ExternalBridgeRecord, toRow } from './entity'

export class ExternalBridgeRepository extends BaseRepository {
  upsert(externalBridge: ExternalBridgeRecord) {
    const row = toRow(externalBridge)

    return this.db
      .insertInto('public.ExternalBridge')
      .values(row)
      .onConflict((conflict) => conflict.doNothing())
      .execute()
  }
}
