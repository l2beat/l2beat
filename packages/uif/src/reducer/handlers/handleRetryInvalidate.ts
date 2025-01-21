import { assert } from '@l2beat/shared-pure'
import { continueOperations } from '../helpers/continueOperations'
import type { RetryInvalidateAction } from '../types/IndexerAction'
import type { IndexerReducerResult } from '../types/IndexerReducerResult'
import type { IndexerState } from '../types/IndexerState'

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
