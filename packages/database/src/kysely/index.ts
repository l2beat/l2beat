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
  private context = new AsyncLocalStorage<{
    trx: Transaction
    isolationLevel?: IsolationLevel
  }>()

  constructor({ log, ...config }: PoolConfig & { log?: LogConfig }) {
    this.kysely = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({ types, ...config }),
      }),
      log,
    })
  }

  get db(): QueryBuilder {
    return this.context.getStore()?.trx ?? this.kysely
  }

  // Runs cb once. A failed transaction is never retried here, so a
  // serialization failure (SQLSTATE 40001) reaches the caller.
  async transaction<T>(
    cb: () => Promise<T>,
    isolationLevel?: IsolationLevel,
  ): Promise<T> {
    const outer = this.context.getStore()
    if (outer) {
      if (
        isolationLevel !== undefined &&
        isolationLevel !== outer.isolationLevel
      ) {
        throw new Error('Nested transaction asks for another isolation level', {
          cause: { outer: outer.isolationLevel, nested: isolationLevel },
        })
      }
      return cb()
    }
    // setIsolationLevel returns a new builder, leaving the one it is called on
    const tx =
      isolationLevel === undefined
        ? this.kysely.transaction()
        : this.kysely.transaction().setIsolationLevel(isolationLevel)
    return await tx.execute((trx) =>
      this.context.run({ trx, isolationLevel }, cb),
    )
  }

  close() {
    return this.kysely.destroy()
  }
}
