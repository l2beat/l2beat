import { BaseRepository } from '../../BaseRepository'
import { BridgeEscrowRecord, toRow } from './entity'

export class BridgeEscrowRepository extends BaseRepository {
  async upsert(record: BridgeEscrowRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: BridgeEscrowRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('public.BridgeEscrow')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['networkId', 'address']).doUpdateSet((eb) => ({
            networkId: eb.ref('excluded.networkId'),
            address: eb.ref('excluded.address'),
          })),
        )
        .execute()
    })
    return records.length
  }
}
