import { Knex } from 'knex'
import { DatabaseMiddleware } from './multi/types'

export class KnexMiddleware implements DatabaseMiddleware {
  private readonly queue: ((tx?: Knex.Transaction) => Promise<void>)[] = []
  constructor(private readonly knex: Knex) {}

  push(cb: (tx?: Knex.Transaction) => Promise<void>) {
    this.queue.push(cb)
  }

  async execute() {
    const tx = await this.knex.transaction()
    try {
      for (const cb of this.queue) {
        await cb(tx)
      }
      await tx.commit()
    } catch (e) {
      await tx.rollback()
      throw e
    }
  }

  async _TEST_ONLY_execute() {
    for (const cb of this.queue) {
      await cb()
    }
  }
}
