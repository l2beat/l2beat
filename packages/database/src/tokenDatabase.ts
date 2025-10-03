import type { LogConfig } from 'kysely'
import type { PoolConfig } from 'pg'
import { DatabaseClient } from './kysely'
import { AbstractTokenRepository } from './repositories/AbstractTokenRepository'
import { DeployedTokenRepository } from './repositories/DeployedTokenRepository'
import { TokenConnectionRepository } from './repositories/TokenConnectionRepository'
import { getDatabaseStats } from './utils/getDatabaseStats'

export type TokenDatabase = ReturnType<typeof createTokenDatabase>
export function createTokenDatabase(config?: PoolConfig & { log?: LogConfig }) {
  const db = new DatabaseClient({ ...config })

  return {
    transaction: db.transaction.bind(db),
    close: db.close.bind(db),

    abstractToken: new AbstractTokenRepository(db),
    deployedToken: new DeployedTokenRepository(db),
    tokenConnection: new TokenConnectionRepository(db),

    stats: () => getDatabaseStats(db),
  }
}
