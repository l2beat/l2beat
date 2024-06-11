import { Insertable } from 'kysely'
import { PostgresDatabase } from '../../kysely'
import { NetworkExplorer } from '../../kysely/generated/types'

export class NetworkExplorerRepository {
  constructor(private readonly db: PostgresDatabase) {}

  insertMany(data: Insertable<NetworkExplorer>[]) {
    return this.db.insertInto('NetworkExplorer').values(data).execute()
  }
}
