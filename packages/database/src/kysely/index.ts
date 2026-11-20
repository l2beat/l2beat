import { AsyncLocalStorage } from 'node:async_hooks'
import {
  type IsolationLevel,
  Kysely,
  type Transaction as KyselyTransaction,
  type LogConfig,
  type LogEvent,
  PostgresDialect,
} from 'kysely'
import { defaults, Pool, type PoolConfig, types } from 'pg'
import type { DB as GeneratedDB } from './generated/types'

export type KyselyLogEvent = LogEvent
export type DB = GeneratedDB
// Interpret `timestamp without time zone` as UTC
defaults.parseInputDatesAsUTC = true
types.setTypeParser(types.builtins.TIMESTAMP, (value) => new Date(value + 'Z'))

export type Transaction = Omit<KyselyTransaction<DB>, 'transaction'>
export type QueryBuilder = Omit<Kysely<DB>, 'transaction'>

export class DatabaseClient {
  private readonly kysely: Kysely<DB>
  private context = new AsyncLocalStorage<Transaction>()

  constructor({ log, ...config }: PoolConfig & { log?: LogConfig }) {
    this.kysely = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({ types, ...config }),
      }),
      log,
    })
  }

  get db(): QueryBuilder {
    const transaction = this.context.getStore()
    return transaction ?? this.kysely
  }

  transaction<T>(
    cb: () => Promise<T>,
    isolationLevel?: IsolationLevel,
  ): Promise<T> {
    if (this.db.isTransaction) {
      // TODO: consider checking for isolation levels in the future
      return cb()
    }
    const tx = this.kysely.transaction()
    if (isolationLevel !== undefined) {
      tx.setIsolationLevel(isolationLevel)
    }
    return tx.execute((trx) => this.context.run(trx, cb))
  }

  /**
   * Runs the callback in a transaction that reads one snapshot of the
   * database throughout, as of its first query (repeatable read). Inside
   * another transaction it runs in that one, as `transaction` does.
   *
   * `transaction` takes an isolation level but does not apply it: it drops
   * the builder that `setIsolationLevel` returns. Callers pass levels to it
   * all the same, and making it honour them would change what their
   * transactions do
   */
  snapshot<T>(cb: () => Promise<T>): Promise<T> {
    if (this.db.isTransaction) return cb()
    return this.kysely
      .transaction()
      .setIsolationLevel('repeatable read')
      .execute((trx) => this.context.run(trx, cb))
  }

  close() {
    return this.kysely.destroy()
  }
}
