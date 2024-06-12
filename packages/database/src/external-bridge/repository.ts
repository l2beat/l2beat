import { PostgresDatabase } from '../kysely'
import { ExternalBridge } from './entity'

export class ExternalBridgeRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsert(externalBridge: ExternalBridge) {
    return this.db
      .insertInto('external_bridge')
      .values(externalBridge)
      .onConflict((conflict) => conflict.doNothing())
      .execute()
  }
}
