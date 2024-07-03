import {
  Kysely,
  Transaction as KyselyTransaction,
  PostgresDialect,
} from 'kysely'
import { Pool, PoolConfig, types } from 'pg'
import { DB } from './generated/types'

// Interpret `timestamp without time zone` as UTC
types.setTypeParser(1114, (stringValue) => new Date(stringValue + '+0000'))

export class PostgresDatabase extends Kysely<DB> {
  constructor(config?: PoolConfig) {
    super({
      dialect: new PostgresDialect({
        // Always parse input dates as UTC
        pool: new Pool({ types, parseInputDatesAsUTC: true, ...config }),
      }),
    })
  }
}

export type Transaction = KyselyTransaction<DB>
