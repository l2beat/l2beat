import { assertStatus } from '../helpers/assertStatus'
import { finishInitialization } from '../helpers/finishInitialization'
import { InitializedAction } from '../types/IndexerAction'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

export function handleInitialized(
  state: IndexerState,
  action: InitializedAction,
): IndexerReducerResult {
  assertStatus(state.status, 'init')

  const newState: IndexerState = {
    ...state,
    height: action.safeHeight,
    initializedSelf: true,
    children: Array.from({ length: action.childCount }).map(() => ({
      ready: true,
    })),
  }

  const result = finishInitialization(newState)
  return result ?? [newState, []]
}
