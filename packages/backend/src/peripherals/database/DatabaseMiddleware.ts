import { Knex } from 'knex'

export interface DatabaseMiddleware {
  add: (cb: () => Promise<void>) => Promise<void>
  execute: () => Promise<void>
}
export type DatabaseTransaction = Knex.Transaction
