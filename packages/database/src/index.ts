import { PoolConfig } from 'pg'
import { PostgresDatabase } from './kysely'
import { NetworksRepository } from './token-db/network/repository'

export function createRepositories(config?: PoolConfig) {
  const db = new PostgresDatabase(config)

  return {
    networks: new NetworksRepository(db),
  }
}
