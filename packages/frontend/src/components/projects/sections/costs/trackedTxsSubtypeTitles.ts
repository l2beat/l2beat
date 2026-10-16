import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'

/** Group titles of the tracked transactions list, shared by the component and its markdown. */
export const TRACKED_TXS_SUBTYPE_TITLES: Record<
  TrackedTxsConfigSubtype,
  string
> = {
  batchSubmissions: 'Batch submissions',
  proofSubmissions: 'Proof submissions',
  stateUpdates: 'State updates',
}
