import { assertStatus } from '../helpers/assertStatus'
import { finishInitialization } from '../helpers/finishInitialization'
import type { InitializedAction } from '../types/IndexerAction'
import type { IndexerReducerResult } from '../types/IndexerReducerResult'
import type { IndexerState } from '../types/IndexerState'

export function handleInitialized(
  state: IndexerState,
  action: InitializedAction,
): IndexerReducerResult {
  assertStatus(state.status, 'init')

  const newState: IndexerState = {
    ...state,
    height: action.safeHeight,
    configHash: action.configHash,
    initializedSelf: true,
    children: Array.from({ length: action.childCount }).map(() => ({
      ready: true,
    })),
  }

  const result = finishInitialization(newState)
  return result ?? [newState, []]
}
