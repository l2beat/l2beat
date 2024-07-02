import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

import { TrackedTxResult } from './model'
import { TrackedTxId } from '@l2beat/shared'

export interface TxUpdaterInterface {
  update: (txs: TrackedTxResult[], knexTx?: Knex.Transaction) => Promise<void>
  deleteFromById: (
    id: TrackedTxId,
    untilTimestamp: UnixTime,
    knexTrx: Knex.Transaction,
  ) => Promise<void>
}
