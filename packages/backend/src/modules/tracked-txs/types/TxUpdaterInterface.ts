import type { TrackedTxId } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import type { TrackedTxResult } from './model'

export interface TxUpdaterInterface {
  type: string
  update: (txs: TrackedTxResult[]) => Promise<void>
  deleteFromById: (id: TrackedTxId, untilTimestamp: UnixTime) => Promise<void>
}
