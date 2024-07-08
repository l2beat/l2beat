import {
  Kysely,
  Transaction as KyselyTransaction,
  PostgresDialect,
} from 'kysely'
import { Pool, PoolConfig, types, defaults } from 'pg'
import { DB } from './generated/types'

// Interpret `timestamp without time zone` as UTC
defaults.parseInputDatesAsUTC = true
types.setTypeParser(types.builtins.TIMESTAMP, (value) => new Date(value + 'Z'))

export class PostgresDatabase extends Kysely<DB> {
  constructor(config?: PoolConfig) {
    super({
      dialect: new PostgresDialect({
        pool: new Pool({ types, ...config }),
      }),
    })
  }
}

export type Transaction = KyselyTransaction<DB>
