import type { State } from '../State'
import {
  appendPastSnapshot,
  applyHistorySnapshot,
  captureHistorySnapshot,
} from '../utils/history'

export function undo(state: State): Partial<State> {
  const snapshot = state.history.past.at(-1)
  if (!snapshot) {
    return {}
  }

  const current = captureHistorySnapshot(state)
  const restored = applyHistorySnapshot(state, snapshot)

  return {
    ...restored,
    history: {
      past: state.history.past.slice(0, -1),
      future: [...state.history.future, current],
    },
  }
}

export function redo(state: State): Partial<State> {
  const snapshot = state.history.future.at(-1)
  if (!snapshot) {
    return {}
  }

  const current = captureHistorySnapshot(state)
  const restored = applyHistorySnapshot(state, snapshot)

  return {
    ...restored,
    history: {
      past: appendPastSnapshot(state.history.past, current),
      future: state.history.future.slice(0, -1),
    },
  }
}
