import { assertRoot } from '../helpers/assertRoot'
import { assertStatus } from '../helpers/assertStatus'
import type { TickSucceededAction } from '../types/IndexerAction'
import type { IndexerEffect } from '../types/IndexerEffect'
import type { IndexerReducerResult } from '../types/IndexerReducerResult'
import type { IndexerState } from '../types/IndexerState'

export function handleTickSucceeded(
  state: IndexerState,
  action: TickSucceededAction,
): IndexerReducerResult {
  assertRoot(state)
  assertStatus(state.status, 'ticking')
  const effects: IndexerEffect[] =
    action.safeHeight !== state.safeHeight
      ? [{ type: 'SetSafeHeight', safeHeight: action.safeHeight }]
      : []
  if (state.tickScheduled) {
    effects.push({ type: 'Tick' })
  }
  return [
    {
      ...state,
      status: state.tickScheduled ? 'ticking' : 'idle',
      tickScheduled: false,
      safeHeight: action.safeHeight,
      height: action.safeHeight,
      invalidateToHeight: action.safeHeight,
      tickBlocked: false,
    },
    effects,
  ]
}
