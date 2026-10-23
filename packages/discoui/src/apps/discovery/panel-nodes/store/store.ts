import { createContext, useContext } from 'react'
import {
  createStore,
  type StoreApi,
  useStore as useZustandStore,
} from 'zustand'
import { persist } from 'zustand/middleware'
import type { Actions } from './actions/Actions'
import { alignSelected, distributeSelected } from './actions/align'
import { applyStoredLayout } from './actions/applyStoredLayout'
import { groupSelected, renameGroup, ungroupSelected } from './actions/group'
import { redo, undo } from './actions/history'
import {
  type ArrangeNodes,
  type AutoGroup,
  loadNodes,
} from './actions/loadNodes'
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
  setTool,
  showHidden,
} from './actions/other'
import { registerViewportContainer } from './actions/registerViewportContainer'
import { selectAndFocus } from './actions/selectAndFocus'
import { setNodes } from './actions/setNodes'
import {
  clearLegacyNodeStoreVersions,
  DEFAULT_USER_PREFERENCES,
  mergeNodeStoreState,
  migrateNodeStoreState,
  NODE_STORE_VERSION,
  type PersistedNodeStoreState,
  partializeNodeStore,
} from './persistence'
import type { Node, State } from './State'
import {
  captureHistorySnapshot,
  emptyHistoryState,
  pushHistorySnapshot,
  snapshotsEqual,
} from './utils/history'
import { persistNodeLayout, recallNodeLayout } from './utils/storage'

type StoreState = State & Actions
export type NodeStore = StoreApi<StoreState>
type StoreSetter = (cb: (state: StoreState) => Partial<State>) => void

const INITIAL_STATE: State = {
  selected: [],
  nodes: [],
  history: emptyHistoryState(),
  transform: { offsetX: 0, offsetY: 0, scale: 1 },
  viewportContainer: undefined,
  tool: 'select',
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
  userPreferences: DEFAULT_USER_PREFERENCES,
  loaded: false,
}

if (typeof localStorage !== 'undefined') {
  clearLegacyNodeStoreVersions(localStorage)
}

// The nodes and permissions panels draw the same kind of graph from different
// edges, so each gets its own instance with its own preferences and layouts.
export const nodesStore = createNodeStore('store-v6', 'layout')
export const permissionsStore = createNodeStore(
  'permissions-store-v1',
  'permissions-layout',
)

const NodeStoreContext = createContext<NodeStore>(nodesStore)
export const NodeStoreProvider = NodeStoreContext.Provider

export function useStore<T>(selector: (state: StoreState) => T): T {
  return useZustandStore(useContext(NodeStoreContext), selector)
}

export function useStoreApi(): NodeStore {
  return useContext(NodeStoreContext)
}

function createNodeStore(
  persistName: string,
  layoutStorageKeyPrefix: string,
): NodeStore {
  const store = createStore<StoreState>()(
    persist<StoreState, [], [], PersistedNodeStoreState>(
      (set) => createActions(set, layoutStorageKeyPrefix),
      {
        name: persistName,
        version: NODE_STORE_VERSION,
        partialize: partializeNodeStore,
        migrate: migrateNodeStoreState,
        merge: mergeNodeStoreState,
      },
    ),
  )

  let timeout: ReturnType<typeof setTimeout>
  store.subscribe((state) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      persistNodeLayout(layoutStorageKeyPrefix, state)
    }, 50)
  })
  return store
}

function createActions(
  set: StoreSetter,
  layoutStorageKeyPrefix: string,
): StoreState {
  return {
    ...INITIAL_STATE,
    loadNodes: wrapHistoryResetAction(
      set,
      (
        state,
        projectId: string,
        nodes: Node[],
        autoGroups: AutoGroup[],
        arrange?: ArrangeNodes,
      ) =>
        loadNodes(
          state,
          projectId,
          nodes,
          autoGroups,
          recallNodeLayout(layoutStorageKeyPrefix, projectId),
          arrange,
        ),
    ),
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
    setTool: wrapAction(set, setTool),

    onKeyDown: wrapUndoableAction(set, onKeyDown),
    onKeyUp: wrapAction(set, onKeyUp),
    onMouseDown: wrapHistoryStartAction(set, onMouseDown),
    onMouseUp: wrapHistoryEndAction(set, onMouseUp),
    onMouseMove: wrapAction(set, onMouseMove),
    onDoubleClick: wrapAction(set, onDoubleClick),
    onWheel: wrapAction(set, onWheel),
  }
}

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
