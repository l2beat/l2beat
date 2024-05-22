import { mockObject } from 'earl'
import { Knex } from 'knex'
import { KnexTrx } from './KnexMiddleware'

export async function _TEST_ONLY_multiUpdate(
  cb: (trx: KnexTrx) => Promise<unknown>,
) {
  const trx = mockObject<Knex>()
  const knexTrx = new KnexTrx(trx)
  const result = await cb(knexTrx)
  await knexTrx._TEST_ONLY_execute()
  return result
}
