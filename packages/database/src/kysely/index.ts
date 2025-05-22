import {
  Kysely,
  type Transaction as KyselyTransaction,
  type LogEvent,
  PostgresDialect,
} from 'kysely'
import { Pool, type PoolConfig, defaults, types } from 'pg'
import type { DB as GeneratedDB } from './generated/types'

import { AsyncLocalStorage } from 'node:async_hooks'

export type DB = GeneratedDB
// Interpret `timestamp without time zone` as UTC
defaults.parseInputDatesAsUTC = true
types.setTypeParser(types.builtins.TIMESTAMP, (value) => new Date(value + 'Z'))

export type Transaction = Omit<KyselyTransaction<DB>, 'transaction'>
export type QueryBuilder = Omit<Kysely<DB>, 'transaction'>

export class DatabaseClient {
  private readonly kysely: Kysely<DB>
  private context = new AsyncLocalStorage<Transaction>()

  constructor(config?: PoolConfig, opts?: { loggerEnabled?: boolean }) {
    this.kysely = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({ types, ...config }),
      }),
      log: opts?.loggerEnabled ? this.logger : undefined,
    })
  }

  get db(): QueryBuilder {
    const transaction = this.context.getStore()
    return transaction ?? this.kysely
  }

  logger(event: LogEvent) {
    if (event.level === 'error') {
      console.error('Query failed : ', {
        durationMs: event.queryDurationMillis,
        error: event.error,
        sql: event.query.sql,
      })
    } else {
      console.log('Query executed : ', {
        durationMs: event.queryDurationMillis,
        sql: event.query.sql,
      })
    }
  }

  transaction<T>(cb: () => Promise<T>): Promise<T> {
    if (this.db.isTransaction) {
      // TODO: consider checking for isolation levels in the future
      return cb()
    }
    return this.kysely.transaction().execute((trx) => this.context.run(trx, cb))
  }

  close() {
    return this.kysely.destroy()
  }
}
