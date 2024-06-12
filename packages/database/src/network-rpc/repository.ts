import { PostgresDatabase } from '../kysely'
import { NetworkRpc, toEntity } from './entity'

export class NetworkRpcRepository {
  constructor(private readonly db: PostgresDatabase) {}

  insertMany(rpcs: NetworkRpc[]) {
    const entities = rpcs.map(toEntity)

    return this.db.insertInto('network_rpc').values(entities).execute()
  }
}
