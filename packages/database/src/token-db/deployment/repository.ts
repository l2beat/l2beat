import { BaseRepository } from '../../BaseRepository'
import { DeploymentRecord, toRow } from './entity'

export class DeploymentRepository extends BaseRepository {
  async upsert(record: DeploymentRecord): Promise<void> {
    const row = toRow(record)
    await this.db
      .insertInto('public.Deployment')
      .values(row)
      .onConflict((cb) =>
        cb.column('tokenId').doUpdateSet((eb) => ({
          tokenId: eb.ref('excluded.tokenId'),
          txHash: eb.ref('excluded.txHash'),
          blockNumber: eb.ref('excluded.blockNumber'),
          timestamp: eb.ref('excluded.timestamp'),
          from: eb.ref('excluded.from'),
          to: eb.ref('excluded.to'),
          isDeployerEoa: eb.ref('excluded.isDeployerEoa'),
          sourceAvailable: eb.ref('excluded.sourceAvailable'),
        })),
      )
      .execute()
  }
}
