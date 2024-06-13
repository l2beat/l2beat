import { Kysely, PostgresDialect } from 'kysely'
import { Pool, PoolConfig } from 'pg'
import { DB } from './generated/types'

export class PostgresDatabase extends Kysely<DB> {
  constructor(config?: PoolConfig) {
    super({
      dialect: new PostgresDialect({
        pool: new Pool(config),
      }),
    })
  }
}
