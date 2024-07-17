import { PostgresDatabase } from '../kysely'
import { NetworkRpcRecord, toRow } from './entity'

export class NetworkRpcRepository {
  constructor(private readonly db: PostgresDatabase) {}

  insertMany(rpcs: NetworkRpcRecord[]) {
    const entities = rpcs.map(toRow)

    return this.db.insertInto('public.NetworkRpc').values(entities).execute()
  }
}
