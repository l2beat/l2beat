import { AsyncLocalStorage } from 'node:async_hooks'
import { PostgresDatabase, Transaction } from './kysely'

export const transactionContext = new AsyncLocalStorage<Transaction>()

export class BaseRepository {
  constructor(private readonly database: PostgresDatabase) {}

  protected get db(): PostgresDatabase | Transaction {
    const transaction = transactionContext.getStore()
    return transaction ?? this.database
  }

  protected async batch<T>(
    rows: T[],
    batchSize: number,
    execute: (trx: Transaction, batch: T[]) => Promise<void>,
  ): Promise<void> {
    const db = this.db
    if (db.isTransaction) {
      for (let i = 0; i < rows.length; i += batchSize) {
        await execute(db as Transaction, rows.slice(i, i + batchSize))
      }
      return
    }
    return db.transaction().execute(async (trx) => {
      for (let i = 0; i < rows.length; i += batchSize) {
        await execute(trx, rows.slice(i, i + batchSize))
      }
    })
  }
}
