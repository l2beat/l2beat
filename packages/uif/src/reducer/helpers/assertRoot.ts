import { assert } from '@l2beat/shared-pure'
import type { IndexerState } from '../types/IndexerState'

export function assertRoot(state: IndexerState): void {
  assert(
    state.parents.length === 0,
    'Tick actions should only be called on root',
  )
}
