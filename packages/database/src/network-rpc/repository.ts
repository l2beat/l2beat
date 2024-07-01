import { PostgresDatabase } from '../kysely'
import { NetworkRpc, toRow } from './entity'

export class NetworkRpcRepository {
  constructor(private readonly db: PostgresDatabase) {}

  insertMany(rpcs: NetworkRpc[]) {
    const entities = rpcs.map(toRow)

    return this.db.insertInto('public.NetworkRpc').values(entities).execute()
  }
}
