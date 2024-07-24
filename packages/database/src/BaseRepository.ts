import { AsyncLocalStorage } from 'node:async_hooks'
import { PostgresDatabase, Transaction } from './kysely'

export const transactionContext = new AsyncLocalStorage<Transaction>()

export class BaseRepository {
  constructor(private readonly db: PostgresDatabase) {}

  protected getDb() {
    const transaction = transactionContext.getStore()
    return transaction ?? this.db
  }
}
