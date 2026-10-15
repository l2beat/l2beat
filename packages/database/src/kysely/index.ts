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

/** The pool's connections right now */
export interface PoolStats {
  total: number
  idle: number
  /** Queries queued for a free connection */
  waiting: number
}

export type Transaction = Omit<KyselyTransaction<DB>, 'transaction'>
export type QueryBuilder = Omit<Kysely<DB>, 'transaction'>

export class DatabaseClient {
  private readonly kysely: Kysely<DB>
  private readonly pool: Pool
  private context = new AsyncLocalStorage<Transaction>()

  constructor({ log, ...config }: PoolConfig & { log?: LogConfig }) {
    this.pool = new Pool({ types, ...config })
    this.kysely = new Kysely<DB>({
      dialect: new PostgresDialect({ pool: this.pool }),
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

  poolStats(): PoolStats {
    return {
      total: this.pool.totalCount,
      idle: this.pool.idleCount,
      waiting: this.pool.waitingCount,
    }
  }

  close() {
    return this.kysely.destroy()
  }
}
