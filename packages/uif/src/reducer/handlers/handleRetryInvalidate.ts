import assert from 'node:assert'

import { continueOperations } from '../helpers/continueOperations'
import { RetryInvalidateAction } from '../types/IndexerAction'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

export function handleRetryInvalidate(
  state: IndexerState,
  _action: RetryInvalidateAction,
): IndexerReducerResult {
  assert(state.invalidateBlocked, 'invalidate should be blocked')

  return continueOperations({
    ...state,
    invalidateBlocked: false,
    forceInvalidate: true,
  })
}
