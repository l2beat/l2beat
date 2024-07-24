import { PostgresDatabase } from '../../kysely'
import { ExternalBridgeRecord, toRow } from './entity'

export class ExternalBridgeRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsert(externalBridge: ExternalBridgeRecord) {
    const row = toRow(externalBridge)

    return this.db
      .insertInto('public.ExternalBridge')
      .values(row)
      .onConflict((conflict) => conflict.doNothing())
      .execute()
  }
}
