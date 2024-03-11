import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

import { TrackedTxResult } from './model'
import { TrackedTxsId } from './TrackedTxsId'

export interface TxUpdaterInterface {
  update: (txs: TrackedTxResult[], knexTx?: Knex.Transaction) => Promise<void>
  deleteAfter: (
    id: TrackedTxsId,
    untilTimestamp: UnixTime,
    knexTrx: Knex.Transaction,
  ) => Promise<void>
}
