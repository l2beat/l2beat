import type { DatabaseClient, QueryBuilder } from './kysely'

export class BaseRepository {
  protected transaction: DatabaseClient['transaction']

  constructor(private readonly client: DatabaseClient) {
    this.transaction = this.client.transaction.bind(this.client)
  }

  protected get db(): QueryBuilder {
    return this.client.db
  }

  protected async batch<T>(
    rows: T[],
    batchSize: number,
    execute: (batch: T[]) => Promise<void>,
  ): Promise<void> {
    if (rows.length === 0) return

    if (rows.length <= batchSize) {
      await execute(rows)
      return
    }

    return this.transaction(async () => {
      for (let i = 0; i < rows.length; i += batchSize) {
        await execute(rows.slice(i, i + batchSize))
      }
    })
  }
}
