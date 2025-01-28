import { assertUnreachable } from '../assertUnreachable'
import { handleChildReady } from './handlers/handleChildReady'
import { handleInitialized } from './handlers/handleInitialized'
import { handleInvalidateFailed } from './handlers/handleInvalidateFailed'
import { handleInvalidateSucceeded } from './handlers/handleInvalidateSucceeded'
import { handleParentUpdated } from './handlers/handleParentUpdated'
import { handleRequestTick } from './handlers/handleRequestTick'
import { handleRetryInvalidate } from './handlers/handleRetryInvalidate'
import { handleRetryTick } from './handlers/handleRetryTick'
import { handleRetryUpdate } from './handlers/handleRetryUpdate'
import { handleTickFailed } from './handlers/handleTickFailed'
import { handleTickSucceeded } from './handlers/handleTickSucceeded'
import { handleUpdateFailed } from './handlers/handleUpdateFailed'
import { handleUpdateSucceeded } from './handlers/handleUpdateSucceeded'
import type { IndexerAction } from './types/IndexerAction'
import type { IndexerReducerResult } from './types/IndexerReducerResult'
import type { IndexerState } from './types/IndexerState'

export function indexerReducer(
  state: IndexerState,
  action: IndexerAction,
): IndexerReducerResult {
  switch (action.type) {
    case 'Initialized':
      return handleInitialized(state, action)
    case 'ParentUpdated':
      return handleParentUpdated(state, action)
    case 'ChildReady':
      return handleChildReady(state, action)

    case 'UpdateSucceeded':
      return handleUpdateSucceeded(state, action)
    case 'UpdateFailed':
      return handleUpdateFailed(state, action)
    case 'RetryUpdate':
      return handleRetryUpdate(state, action)

    case 'InvalidateSucceeded':
      return handleInvalidateSucceeded(state, action)
    case 'InvalidateFailed':
      return handleInvalidateFailed(state, action)
    case 'RetryInvalidate':
      return handleRetryInvalidate(state, action)

    case 'RequestTick':
      return handleRequestTick(state, action)
    case 'TickSucceeded':
      return handleTickSucceeded(state, action)
    case 'TickFailed':
      return handleTickFailed(state, action)
    case 'RetryTick':
      return handleRetryTick(state, action)

    default:
      assertUnreachable(action)
  }
}
