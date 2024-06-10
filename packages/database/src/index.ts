import { PostgresDatabase } from './kysely'
import { PoolConfig } from 'pg'
import { TokensRepository } from './tokens/repository'

export function createRepositories(config?: PoolConfig) {
  const db = new PostgresDatabase(config)

  return {
    tokens: new TokensRepository(db),
  }
}
