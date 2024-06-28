import { PostgresDatabase } from '../kysely'
import { NetworkExplorer, toRow } from './entity'

export class NetworkExplorerRepository {
  constructor(private readonly db: PostgresDatabase) {}

  insertMany(explorers: NetworkExplorer[]) {
    const rows = explorers.map(toRow)

    return this.db.insertInto('public.NetworkExplorer').values(rows).execute()
  }
}
