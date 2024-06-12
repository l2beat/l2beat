import { PostgresDatabase } from '../kysely'
import { Deployment, toEntity } from './entity'

export class DeploymentRepository {
  constructor(private readonly db: PostgresDatabase) {}

  upsert(deployment: Deployment) {
    const entity = toEntity(deployment)

    return this.db
      .insertInto('deployment')
      .values(entity)
      .onConflict((conflict) =>
        conflict.column('token_id').doUpdateSet({
          token_id: (excluded) => excluded.ref('excluded.token_id'),
          tx_hash: (excluded) => excluded.ref('excluded.tx_hash'),
          block_number: (excluded) => excluded.ref('excluded.block_number'),
          timestamp: (excluded) => excluded.ref('excluded.timestamp'),
          from: (excluded) => excluded.ref('excluded.from'),
          to: (excluded) => excluded.ref('excluded.to'),
          is_deployer_eoa: (excluded) =>
            excluded.ref('excluded.is_deployer_eoa'),
          source_available: (excluded) =>
            excluded.ref('excluded.source_available'),
        }),
      )
      .execute()
  }
}
