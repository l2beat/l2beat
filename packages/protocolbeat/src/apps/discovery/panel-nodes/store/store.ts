import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Actions } from './actions/Actions'
import { alignSelected, distributeSelected } from './actions/align'
import { applyStoredLayout } from './actions/applyStoredLayout'
import { groupSelected, renameGroup, ungroupSelected } from './actions/group'
import { redo, undo } from './actions/history'
import { loadNodes } from './actions/loadNodes'
import { onDoubleClick } from './actions/onDoubleClick'
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
  hideUnreachable,
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
    enableDimming: true,
    hideLargeArrays: true,
    highlightOverlapping: true,
    useExperimentalRenderer: false,
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
      alignSelected: wrapUndoableAction(set, alignSelected),
      distributeSelected: wrapUndoableAction(set, distributeSelected),
      groupSelected: wrapUndoableAction(set, groupSelected),
      ungroupSelected: wrapUndoableAction(set, ungroupSelected),
      renameGroup: wrapUndoableAction(set, renameGroup),
      undo: wrapAction(set, undo),
      redo: wrapAction(set, redo),
      hideSelected: wrapUndoableAction(set, hideSelected),
      hideUnreachable: wrapUndoableAction(set, hideUnreachable),
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
      onDoubleClick: wrapAction(set, onDoubleClick),
      onWheel: wrapAction(set, onWheel),
    }),
    {
      // You can update the key if changes are backwards incompatible
      name: 'store-v5',
      partialize: (state) => {
        return {
          projectId: state.projectId,
          nodes: state.nodes,
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
  return wrapWithReducer(set, (state, ...args) => action(state, ...args))
}

function wrapUndoableAction<A extends unknown[]>(
  set: StoreSetter,
  action: (state: State, ...args: A) => Partial<State>,
): (...args: A) => void {
  return wrapWithReducer(set, (state, ...args) => {
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
  return wrapWithReducer(set, (state, ...args) => ({
    ...action(state, ...args),
    history: emptyHistoryState(),
  }))
}

function wrapHistoryStartAction<A extends unknown[]>(
  set: StoreSetter,
  action: (state: State, ...args: A) => Partial<State>,
): (...args: A) => void {
  return wrapWithReducer(set, (state, ...args) => {
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
  return wrapWithReducer(set, (state, ...args) => {
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
  reducer: (state: StoreState, ...args: A) => Partial<State>,
): (...args: A) => void {
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
