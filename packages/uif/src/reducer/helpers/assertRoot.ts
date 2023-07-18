import assert from 'node:assert'

import { IndexerState } from '../types/IndexerState'

export function assertRoot(state: IndexerState): void {
  assert(
    state.parents.length === 0,
    'Tick actions should only be called on root',
  )
}
