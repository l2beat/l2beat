import { mockObject } from 'earl'
import { Knex } from 'knex'
import { KnexMiddleware } from './KnexMiddleware'

export async function _TEST_ONLY_execute(
  cb: (trx: KnexMiddleware) => Promise<unknown>,
) {
  const trx = mockObject<Knex>()
  const knexTrx = new KnexMiddleware(trx)
  const result = await cb(knexTrx)
  await knexTrx._TEST_ONLY_execute()
  return result
}
