import { PostgresDatabase } from '../kysely'
import { Deployment, toRow } from './entity'

export class DeploymentRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsert(Deployment: Deployment) {
    const row = toRow(Deployment)

    return this.db
      .insertInto('public.Deployment')
      .values(row)
      .onConflict((conflict) =>
        conflict.column('tokenId').doUpdateSet({
          tokenId: (excluded) => excluded.ref('excluded.tokenId'),
          txHash: (excluded) => excluded.ref('excluded.txHash'),
          blockNumber: (excluded) => excluded.ref('excluded.blockNumber'),
          timestamp: (excluded) => excluded.ref('excluded.timestamp'),
          from: (excluded) => excluded.ref('excluded.from'),
          to: (excluded) => excluded.ref('excluded.to'),
          isDeployerEoa: (excluded) => excluded.ref('excluded.isDeployerEoa'),
          sourceAvailable: (excluded) =>
            excluded.ref('excluded.sourceAvailable'),
        }),
      )
      .execute()
  }
}
