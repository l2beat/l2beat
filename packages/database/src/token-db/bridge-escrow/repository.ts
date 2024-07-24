import { PostgresDatabase } from '../../kysely'
import { BridgeEscrowRecord, toRow } from './entity'

export class BridgeEscrowRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsert(bridgeEscrow: BridgeEscrowRecord) {
    const row = toRow(bridgeEscrow)

    return this.db.insertInto('public.BridgeEscrow').values(row).execute()
  }

  upsertMany(bridgeEscrows: BridgeEscrowRecord[]) {
    const rows = bridgeEscrows.map(toRow)

    return this.db
      .insertInto('public.BridgeEscrow')
      .values(rows)
      .onConflict((conflict) =>
        conflict.columns(['networkId', 'address']).doUpdateSet({
          networkId: (excluded) => excluded.ref('excluded.networkId'),
          address: (excluded) => excluded.ref('excluded.address'),
        }),
      )
  }
}
