import { Knex } from 'knex'

export interface DatabaseMiddleware {
  add: (cb: () => Promise<void>) => void
  execute: () => Promise<void>
}
export type DatabaseTransaction = Knex.Transaction

export class KnexMiddleware implements DatabaseMiddleware {
  private readonly queue: ((tx?: Knex.Transaction) => Promise<void>)[] = []
  constructor(private readonly knex: Knex) {}

  add(cb: (tx?: Knex.Transaction) => Promise<void>) {
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
}
