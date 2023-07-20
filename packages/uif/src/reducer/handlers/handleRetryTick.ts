import assert from 'node:assert'

import { assertStatus } from '../helpers/assertStatus'
import { RetryTickAction } from '../types/IndexerAction'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

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
