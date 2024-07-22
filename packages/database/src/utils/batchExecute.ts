import { PostgresDatabase, Transaction } from '../kysely'

export function batchExecute<T>(
  db: PostgresDatabase | Transaction,
  rows: T[],
  batchSize: number,
  execute: (trx: Transaction, batch: T[]) => Promise<void>,
) {
  return db.transaction().execute(async (trx) => {
    for (let i = 0; i < rows.length; i += batchSize) {
      await execute(trx, rows.slice(i, i + batchSize))
    }
  })
}
