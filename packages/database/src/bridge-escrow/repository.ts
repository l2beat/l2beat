import { PostgresDatabase } from '../kysely'
import { BridgeEscrow, toEntity } from './entity'

export class BridgeEscrowRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsert(bridgeEscrow: BridgeEscrow) {
    const entity = toEntity(bridgeEscrow)
    return this.db.insertInto('bridge_escrow').values(entity).execute()
  }

  upsertMany(bridgeEscrows: BridgeEscrow[]) {
    const entities = bridgeEscrows.map(toEntity)
    return this.db
      .insertInto('bridge_escrow')
      .values(entities)
      .onConflict((conflict) =>
        conflict.columns(['network_id', 'address']).doUpdateSet({
          network_id: (excluded) => excluded.ref('excluded.network_id'),
          address: (excluded) => excluded.ref('excluded.address'),
        }),
      )
  }
}
