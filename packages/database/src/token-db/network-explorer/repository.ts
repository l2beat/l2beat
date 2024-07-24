import { PostgresDatabase } from '../../kysely'
import { NetworkExplorerRecord, toRow } from './entity'

export class NetworkExplorerRepository {
  constructor(private readonly db: PostgresDatabase) {}

  insertMany(explorers: NetworkExplorerRecord[]) {
    const rows = explorers.map(toRow)

    return this.db.insertInto('public.NetworkExplorer').values(rows).execute()
  }
}
