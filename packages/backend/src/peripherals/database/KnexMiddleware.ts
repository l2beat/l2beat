import { assert } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { DatabaseMiddleware } from './DatabaseMiddleware'

/**
 * Middleware that allows to execute multiple database operations in a single transaction.
 * It is single use (once instance should create only one transaction).
 */
export class KnexMiddleware implements DatabaseMiddleware {
  private readonly queue: ((tx?: Knex.Transaction) => Promise<void>)[] = []
  private executed = false
  constructor(private readonly knex: Knex) {}

  add(cb: (tx?: Knex.Transaction) => Promise<void>) {
    this.queue.push(cb)
  }

  async execute() {
    assert(!this.executed, 'Already executed')
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
}
