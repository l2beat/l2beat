import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { State } from './State'
import type { Actions } from './actions/Actions'
import {
  clear,
  colorSelected,
  hideSelected,
  loadNodes,
  showHidden,
  updateNodeLocations,
  updateNodes,
} from './actions/nodes'
import { onKeyDown } from './actions/onKeyDown'
import { onKeyUp } from './actions/onKeyUp'
import { onMouseDown } from './actions/onMouseDown'
import { onMouseMove } from './actions/onMouseMove'
import { onMouseUp } from './actions/onMouseUp'
import { onWheel } from './actions/onWheel'
import { persistNodeState } from './utils/localStore'

const INITIAL_STATE: State = {
  selectedNodeIds: [],
  hiddenNodesIds: [],
  nodes: [],
  selection: undefined,
  transform: { offsetX: 0, offsetY: 0, scale: 1 },
  pressed: {
    leftMouseButton: false,
    middleMouseButton: false,
    ctrlKey: false,
    shiftKey: false,
    spaceKey: false,
  },
  mouseUpAction: undefined,
  mouseMoveAction: undefined,
  mouseMove: { startX: 0, startY: 0, currentX: 0, currentY: 0 },
  mouseSelection: undefined,
  selectedPositions: {},
  projectId: '',
}

export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      loadNodes: wrapAction(set, loadNodes),
      colorSelected: wrapAction(set, colorSelected),
      hideSelected: wrapAction(set, hideSelected),
      showHidden: wrapAction(set, showHidden),
      clear: wrapAction(set, clear),

      onKeyDown: wrapAction(set, onKeyDown),
      onKeyUp: wrapAction(set, onKeyUp),
      onMouseDown: wrapAction(set, onMouseDown),
      onMouseUp: wrapAction(set, onMouseUp),
      onMouseMove: wrapAction(set, onMouseMove),
      onWheel: wrapAction(set, onWheel),
      updateNodes: wrapAction(set, updateNodes),
      updateNodeLocations: wrapAction(set, updateNodeLocations),
    }),
    {
      name: 'store',
      partialize: (state) => {
        return {
          nodes: state.nodes,
          hiddenNodesIds: state.hiddenNodesIds,
          projectId: state.projectId,
        }
      },
    },
  ),
)

let timeout: ReturnType<typeof setTimeout>
useStore.subscribe((state) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    persistNodeState(state)
  }, 50)
})

function wrapAction<A extends unknown[]>(
  set: (cb: (state: State) => Partial<State>) => void,
  action: (state: State, ...args: A) => Partial<State>,
): (...args: A) => void {
  return (...args: A) => set((state) => action(state, ...args))
}
