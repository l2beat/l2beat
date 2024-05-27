import { assert } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { BaseRepository } from './BaseRepository'
import { DatabaseMiddleware } from './DatabaseMiddleware'

/**
 * Middleware that allows to execute multiple database operations in a single transaction.
 * It is single use (once instance should create only one transaction).
 */
export class KnexMiddleware implements DatabaseMiddleware {
  private readonly queue: ((tx?: Knex.Transaction) => Promise<void>)[] = []
  private executed = false
  constructor(private readonly repo: BaseRepository) {}

  add(cb: (tx?: Knex.Transaction) => Promise<void>) {
    this.queue.push(cb)
    return Promise.resolve()
  }

  async execute() {
    assert(!this.executed, 'Already executed')
    await this.repo.runInTransaction(async (trx) => {
      for (const cb of this.queue) {
        await cb(trx)
      }
    })
    this.executed = true
  }
}
