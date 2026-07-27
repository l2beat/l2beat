import type { LogConfig } from 'kysely'
import type { PoolConfig } from 'pg'
import { DatabaseClient } from './kysely'
import { AbstractTokenRepository } from './repositories/AbstractTokenRepository'
import { ChainRepository } from './repositories/ChainRepository'
import { DeployedTokenRepository } from './repositories/DeployedTokenRepository'
import { TokenDbHistoryRepository } from './repositories/TokenDbHistoryRepository'
import { TokenDbSettingRepository } from './repositories/TokenDbSettingRepository'
import { TokenIngestionQueueRepository } from './repositories/TokenIngestionQueueRepository'
import { TokenRelationRepository } from './repositories/TokenRelationRepository'
import { getDatabaseStats } from './utils/getDatabaseStats'

export type TokenDatabase = ReturnType<typeof createTokenDatabase>
export function createTokenDatabase(config?: PoolConfig & { log?: LogConfig }) {
  const db = new DatabaseClient({ ...config })

  return {
    transaction: db.transaction.bind(db),
    close: db.close.bind(db),

    chain: new ChainRepository(db),
    abstractToken: new AbstractTokenRepository(db),
    deployedToken: new DeployedTokenRepository(db),
    tokenRelation: new TokenRelationRepository(db),
    tokenDbHistory: new TokenDbHistoryRepository(db),
    tokenDbSettings: new TokenDbSettingRepository(db),
    tokenIngestionQueue: new TokenIngestionQueueRepository(db),

    stats: () => getDatabaseStats(db),
  }
}
