import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

import { TrackedTxId } from '@l2beat/shared'
import { TrackedTxResult } from './model'

export interface TxUpdaterInterface {
  type: string
  update: (txs: TrackedTxResult[], knexTx?: Knex.Transaction) => Promise<void>
  deleteFromById: (
    id: TrackedTxId,
    untilTimestamp: UnixTime,
    knexTrx: Knex.Transaction,
  ) => Promise<void>
}
