import { Insertable } from 'kysely'
import { PostgresDatabase } from '../../kysely'
import { BridgeEscrow } from '../../kysely/generated/types'

export class BridgeEscrowRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsert(data: Insertable<BridgeEscrow>) {
    return this.db.insertInto('BridgeEscrow').values(data).execute()
  }

  upsertMany(data: Insertable<BridgeEscrow>[]) {
    return this.db
      .insertInto('BridgeEscrow')
      .values(data)
      .onConflict((conflict) =>
        conflict.columns(['networkId', 'address']).doUpdateSet({
          networkId: (excluded) => excluded.ref('excluded.networkId'),
          address: (excluded) => excluded.ref('excluded.address'),
        }),
      )
  }
}
