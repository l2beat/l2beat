import { Insertable } from 'kysely'
import { PostgresDatabase } from '../../kysely'
import { ExternalBridge } from '../../kysely/generated/types'

export class ExternalBridgeRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsert(data: Insertable<ExternalBridge>) {
    return this.db
      .insertInto('ExternalBridge')
      .values(data)
      .onConflict((conflict) => conflict.doNothing())
      .execute()
  }
}
