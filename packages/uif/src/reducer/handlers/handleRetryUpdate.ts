import { assert } from '@l2beat/shared-pure'
import { continueOperations } from '../helpers/continueOperations'
import type { RetryUpdateAction } from '../types/IndexerAction'
import type { IndexerReducerResult } from '../types/IndexerReducerResult'
import type { IndexerState } from '../types/IndexerState'

export function handleRetryUpdate(
  state: IndexerState,
  _action: RetryUpdateAction,
): IndexerReducerResult {
  assert(state.updateBlocked, 'update should be blocked')

  return continueOperations({
    ...state,
    updateBlocked: false,
  })
}
