import {
  Kysely,
  Transaction as KyselyTransaction,
  PostgresDialect,
} from 'kysely'
import { Pool, PoolConfig, defaults, types } from 'pg'
import { DB as GeneratedDB } from './generated/types'

import { DailyTransactionCountRow } from '../activity-view/entity'

export type DB = GeneratedDB & {
  // TODO: (sz-piotr) This is temporary!
  'activity.daily_count_view': DailyTransactionCountRow
}

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
