import assert from 'node:assert'

import { continueOperations } from '../helpers/continueOperations'
import { RetryUpdateAction } from '../types/IndexerAction'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

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
