import { BaseRepository } from '../../BaseRepository'
import { UpsertableBridgeEscrowRecord, upsertableToRecord } from './entity'

export class BridgeEscrowRepository extends BaseRepository {
  async upsert(record: UpsertableBridgeEscrowRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: UpsertableBridgeEscrowRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(upsertableToRecord)
    await this.batch(rows, 100, async (batch) => {
      await this.db
        .insertInto('BridgeEscrow')
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
