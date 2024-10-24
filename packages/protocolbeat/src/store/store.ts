import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { State } from './State'
import type { Actions } from './actions/Actions'
import {
  loadNodes,
  updateNodeColors,
  updateNodeLocations,
  updateNodes,
} from './actions/nodes'
import { onKeyDown } from './actions/onKeyDown'
import { onKeyUp } from './actions/onKeyUp'
import { onMouseDown } from './actions/onMouseDown'
import { onMouseMove } from './actions/onMouseMove'
import { onMouseUp } from './actions/onMouseUp'
import { onWheel } from './actions/onWheel'

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
  saveLayoutStartTime: undefined,
  projectId: '',
}

export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      loadNodes: wrapAction(set, loadNodes),

      onKeyDown: wrapAction(set, onKeyDown),
      onKeyUp: wrapAction(set, onKeyUp),
      onMouseDown: wrapAction(set, onMouseDown),
      onMouseUp: wrapAction(set, onMouseUp),
      onMouseMove: wrapAction(set, onMouseMove),
      onWheel: wrapAction(set, onWheel),
      updateNodes: wrapAction(set, updateNodes),
      updateNodeLocations: wrapAction(set, updateNodeLocations),
      updateNodeColors: wrapAction(set, updateNodeColors),

      setProjectId: (projectId: string) =>
        set((state) => ({ ...state, projectId: projectId })),
      setHiddenNodes: (updateFn) => {
        set((state) => {
          // stale-state
          const hiddenNodesIds = updateFn([...state.hiddenNodesIds])

          return { ...state, hiddenNodesIds }
        })
      },
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

function wrapAction<A extends unknown[]>(
  set: (cb: (state: State) => Partial<State>) => void,
  action: (state: State, ...args: A) => Partial<State>,
): (...args: A) => void {
  return (...args: A) => set((state) => action(state, ...args))
}
