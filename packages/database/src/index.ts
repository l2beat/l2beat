import { PoolConfig } from 'pg'
import { PostgresDatabase } from './kysely'
import { StakeRepository } from './stake/repository'

export function createRepositories(config?: PoolConfig) {
  const db = new PostgresDatabase(config)

  return {
    stake: new StakeRepository(db),
  }
}

export type { Stake } from './stake'
