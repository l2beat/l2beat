import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Actions } from './actions/Actions'
import { onKeyDown } from './actions/onKeyDown'
import { onKeyUp } from './actions/onKeyUp'
import { onMouseDown } from './actions/onMouseDown'
import { onMouseMove } from './actions/onMouseMove'
import { onMouseUp } from './actions/onMouseUp'
import { onWheel } from './actions/onWheel'
import { updateNodes } from './actions/updateNodes'
import { State } from './State'

export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      selectedNodeIds: [],
      nodes: [],
      selection: undefined,
      transform: { offsetX: 0, offsetY: 0, scale: 1 },
      pressed: {
        leftMouseButton: false,
        middleMouseButton: false,
        shiftKey: false,
        spaceKey: false,
      },
      mouseUpAction: undefined,
      mouseMoveAction: undefined,
      mouseMove: { startX: 0, startY: 0, currentX: 0, currentY: 0 },
      mouseSelection: undefined,
      selectedPositions: {},

      onKeyDown: (...args) => set((state) => onKeyDown(state, ...args)),
      onKeyUp: (...args) => set((state) => onKeyUp(state, ...args)),
      onMouseDown: (...args) => set((state) => onMouseDown(state, ...args)),
      onMouseUp: (...args) => set((state) => onMouseUp(state, ...args)),
      onMouseMove: (...args) => set((state) => onMouseMove(state, ...args)),
      onWheel: (...args) => set((state) => onWheel(state, ...args)),
      updateNodes: (...args) => set((state) => updateNodes(state, ...args)),
    }),
    {
      name: 'store',
      partialize: (state) => {
        return {
          nodes: state.nodes,
        }
      },
    },
  ),
)
