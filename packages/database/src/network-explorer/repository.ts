import { PostgresDatabase } from '../kysely'
import { NetworkExplorer, toEntity } from './entity'

export class NetworkExplorerRepository {
  constructor(private readonly db: PostgresDatabase) {}

  insertMany(explorers: NetworkExplorer[]) {
    const entities = explorers.map(toEntity)

    return this.db.insertInto('network_explorer').values(entities).execute()
  }
}
