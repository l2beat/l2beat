import type { TrackedTxId } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import type { TrackedTxResult } from './model'

export interface TxUpdaterInterface<T extends TrackedTxResult['type']> {
  type: T
  update: (txs: Extract<TrackedTxResult, { type: T }>[]) => Promise<void>
  deleteFromById: (id: TrackedTxId, untilTimestamp: UnixTime) => Promise<void>
}
