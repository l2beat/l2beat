import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SHOW_PERFORMANCE } from '../../../../config/perf'
import { perfStats } from '../perf/perfStats'
import type { Actions } from './actions/Actions'
import { applyStoredLayout } from './actions/applyStoredLayout'
import { redo, undo } from './actions/history'
import { loadNodes } from './actions/loadNodes'
import { onKeyDown } from './actions/onKeyDown'
import { onKeyUp } from './actions/onKeyUp'
import { onMouseDown } from './actions/onMouseDown'
import { onMouseMove } from './actions/onMouseMove'
import { onMouseUp } from './actions/onMouseUp'
import { onWheel } from './actions/onWheel'
import {
  clear,
  colorSelected,
  hideSelected,
  hideUnknowns,
  layout,
  setPreferences,
  showHidden,
} from './actions/other'
import { registerViewportContainer } from './actions/registerViewportContainer'
import { selectAndFocus } from './actions/selectAndFocus'
import { setNodes } from './actions/setNodes'
import type { State } from './State'
import {
  captureHistorySnapshot,
  emptyHistoryState,
  pushHistorySnapshot,
  snapshotsEqual,
} from './utils/history'
import { persistNodeLayout } from './utils/storage'

type StoreState = State & Actions
type StoreSetter = (cb: (state: StoreState) => Partial<State>) => void

const INITIAL_STATE: State = {
  selected: [],
  hidden: [],
  nodes: [],
  history: emptyHistoryState(),
  transform: { offsetX: 0, offsetY: 0, scale: 1 },
  viewportContainer: undefined,
  input: {
    shiftPressed: false,
    spacePressed: false,
    ctrlPressed: false,
    lmbPressed: false,
    mmbPressed: false,
    mouseStartX: 0,
    mouseStartY: 0,
    mouseX: 0,
    mouseY: 0,
  },
  mouseUpAction: undefined,
  mouseMoveAction: undefined,
  selection: undefined,
  positionsBeforeMove: {},
  projectId: '',
  userPreferences: {
    hideUnknownOnLoad: true,
    enableDimming: true,
    hideLargeArrays: true,
  },
  loaded: false,
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      loadNodes: wrapHistoryResetAction(set, loadNodes),
      setNodes: wrapUndoableAction(set, setNodes),
      colorSelected: wrapUndoableAction(set, colorSelected),
      undo: wrapAction(set, undo),
      redo: wrapAction(set, redo),
      hideSelected: wrapUndoableAction(set, hideSelected),
      hideUnknowns: wrapUndoableAction(set, hideUnknowns),
      showHidden: wrapUndoableAction(set, showHidden),
      clear: wrapHistoryResetAction(set, clear),
      layout: wrapUndoableAction(set, layout),
      applyStoredLayout: wrapAction(set, applyStoredLayout),
      selectAndFocus: wrapAction(set, selectAndFocus),
      registerViewportContainer: wrapAction(set, registerViewportContainer),
      setPreferences: wrapAction(set, setPreferences),

      onKeyDown: wrapUndoableAction(set, onKeyDown),
      onKeyUp: wrapAction(set, onKeyUp),
      onMouseDown: wrapHistoryStartAction(set, onMouseDown),
      onMouseUp: wrapHistoryEndAction(set, onMouseUp),
      onMouseMove: wrapAction(set, onMouseMove),
      onWheel: wrapAction(set, onWheel),
    }),
    {
      // You can update the key if changes are backwards incompatible
      name: 'store-v4',
      partialize: (state) => {
        return {
          projectId: state.projectId,
          nodes: state.nodes,
          hidden: state.hidden,
          userPreferences: state.userPreferences,
        }
      },
    },
  ),
)

let timeout: ReturnType<typeof setTimeout>
useStore.subscribe((state) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    persistNodeLayout(state)
  }, 50)
})

function wrapAction<A extends unknown[]>(
  set: StoreSetter,
  action: (state: State, ...args: A) => Partial<State>,
): (...args: A) => void {
  return wrapWithReducer(set, action, (state, ...args) =>
    action(state, ...args),
  )
}

function wrapUndoableAction<A extends unknown[]>(
  set: StoreSetter,
  action: (state: State, ...args: A) => Partial<State>,
): (...args: A) => void {
  return wrapWithReducer(set, action, (state, ...args) => {
    const before = captureHistorySnapshot(state)
    const partial = action(state, ...args)

    if (state.history.pending) {
      return partial
    }

    const after = captureHistorySnapshot(mergeState(state, partial))
    if (snapshotsEqual(before, after)) {
      return partial
    }

    return {
      ...partial,
      history: pushHistorySnapshot(state.history, before),
    }
  })
}

function wrapHistoryResetAction<A extends unknown[]>(
  set: StoreSetter,
  action: (state: State, ...args: A) => Partial<State>,
): (...args: A) => void {
  return wrapWithReducer(set, action, (state, ...args) => ({
    ...action(state, ...args),
    history: emptyHistoryState(),
  }))
}

function wrapHistoryStartAction<A extends unknown[]>(
  set: StoreSetter,
  action: (state: State, ...args: A) => Partial<State>,
): (...args: A) => void {
  return wrapWithReducer(set, action, (state, ...args) => {
    const partial = action(state, ...args)
    const nextState = mergeState(state, partial)

    if (
      !isUndoableMouseAction(state.mouseMoveAction) &&
      isUndoableMouseAction(nextState.mouseMoveAction)
    ) {
      return {
        ...partial,
        history: {
          ...state.history,
          pending: captureHistorySnapshot(state),
        },
      }
    }

    return partial
  })
}

function wrapHistoryEndAction<A extends unknown[]>(
  set: StoreSetter,
  action: (state: State, ...args: A) => Partial<State>,
): (...args: A) => void {
  return wrapWithReducer(set, action, (state, ...args) => {
    const partial = action(state, ...args)
    const pending = state.history.pending

    if (!pending) {
      return partial
    }

    if (!isUndoableMouseAction(state.mouseMoveAction)) {
      return {
        ...partial,
        history: clearPendingSnapshot(state.history),
      }
    }

    const after = captureHistorySnapshot(mergeState(state, partial))
    if (snapshotsEqual(pending, after)) {
      return {
        ...partial,
        history: clearPendingSnapshot(state.history),
      }
    }

    return {
      ...partial,
      history: pushHistorySnapshot(state.history, pending),
    }
  })
}

function wrapWithReducer<A extends unknown[]>(
  set: StoreSetter,
  action: (state: State, ...args: A) => Partial<State>,
  reducer: (state: StoreState, ...args: A) => Partial<State>,
): (...args: A) => void {
  if (SHOW_PERFORMANCE) {
    return (...args: A) => {
      const startedAt = performance.now()
      try {
        set((state) => reducer(state, ...args))
      } finally {
        perfStats.recordAction(action.name, performance.now() - startedAt)
      }
    }
  }
  return (...args: A) => set((state) => reducer(state, ...args))
}

function mergeState(state: StoreState, partial: Partial<State>): StoreState {
  return {
    ...state,
    ...partial,
  }
}

function clearPendingSnapshot(history: State['history']): State['history'] {
  return {
    past: history.past,
    future: history.future,
  }
}

function isUndoableMouseAction(
  action: State['mouseMoveAction'],
): action is 'drag' | 'resize-node' {
  return action === 'drag' || action === 'resize-node'
}
