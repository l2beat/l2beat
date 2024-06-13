import { PoolConfig } from 'pg'
import { PostgresDatabase } from './kysely'
import { StakeRepository } from './stake/repository'
import { CurrentPriceRepository } from './current-price'

export function createRepositories(config?: PoolConfig) {
  const db = new PostgresDatabase(config)

  return {
    currentPrice: new CurrentPriceRepository(db),
    stake: new StakeRepository(db),
  }
}

export type Database = ReturnType<typeof createRepositories>

export type { CurrentPrice } from './current-price'
export type { Stake } from './stake'
