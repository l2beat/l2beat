import { AsyncLocalStorage } from 'node:async_hooks'
import { PostgresDatabase, Transaction } from './kysely'

export const transactionContext = new AsyncLocalStorage<Transaction>()

export class BaseRepository {
  constructor(private readonly db: PostgresDatabase) {}

  protected getDb(): PostgresDatabase | Transaction {
    const transaction = transactionContext.getStore()
    return transaction ?? this.db
  }

  protected async batch<T>(
    rows: T[],
    batchSize: number,
    execute: (trx: Transaction, batch: T[]) => Promise<void>,
  ): Promise<void> {
    const db = this.getDb()
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
