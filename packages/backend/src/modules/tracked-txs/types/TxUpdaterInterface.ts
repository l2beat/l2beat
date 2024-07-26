import { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { TrackedTxResult } from './model'

export interface TxUpdaterInterface {
  type: string
  update: (txs: TrackedTxResult[]) => Promise<void>
  deleteFromById: (id: TrackedTxId, untilTimestamp: UnixTime) => Promise<void>
}
