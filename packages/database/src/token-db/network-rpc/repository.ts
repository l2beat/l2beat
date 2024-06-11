import { Insertable } from 'kysely'
import { PostgresDatabase } from '../../kysely'
import { NetworkRpc } from '../../kysely/generated/types'

export class NetworkRpcRepository {
  constructor(private readonly db: PostgresDatabase) {}

  insertMany(data: Insertable<NetworkRpc>[]) {
    return this.db.insertInto('NetworkRpc').values(data).execute()
  }
}
