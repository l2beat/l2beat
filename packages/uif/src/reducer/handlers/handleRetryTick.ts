import { assert } from '@l2beat/shared-pure'
import { assertStatus } from '../helpers/assertStatus'
import type { RetryTickAction } from '../types/IndexerAction'
import type { IndexerReducerResult } from '../types/IndexerReducerResult'
import type { IndexerState } from '../types/IndexerState'

export function handleRetryTick(
  state: IndexerState,
  _action: RetryTickAction,
): IndexerReducerResult {
  assertStatus(state.status, 'idle')
  assert(state.tickBlocked, 'tick should be blocked')

  return [
    { ...state, status: 'ticking', tickScheduled: false },
    [{ type: 'Tick' }],
  ]
}
