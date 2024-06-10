import { DB } from './generated/types'
import { Pool, PoolConfig } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

export class PostgresDatabase extends Kysely<DB> {
  constructor(config?: PoolConfig) {
    super({
      dialect: new PostgresDialect({
        pool: new Pool(config),
      }),
    })
  }
}
