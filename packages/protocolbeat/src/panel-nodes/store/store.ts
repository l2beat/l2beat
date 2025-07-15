import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Actions } from './actions/Actions'
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
import { persistNodeLayout } from './utils/storage'

const INITIAL_STATE: State = {
  selected: [],
  hidden: [],
  nodes: [],
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
}

export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      loadNodes: wrapAction(set, loadNodes),
      setNodes: wrapAction(set, setNodes),
      colorSelected: wrapAction(set, colorSelected),
      hideSelected: wrapAction(set, hideSelected),
      hideUnknowns: wrapAction(set, hideUnknowns),
      showHidden: wrapAction(set, showHidden),
      clear: wrapAction(set, clear),
      layout: wrapAction(set, layout),
      selectAndFocus: wrapAction(set, selectAndFocus),
      registerViewportContainer: wrapAction(set, registerViewportContainer),
      setPreferences: wrapAction(set, setPreferences),

      onKeyDown: wrapAction(set, onKeyDown),
      onKeyUp: wrapAction(set, onKeyUp),
      onMouseDown: wrapAction(set, onMouseDown),
      onMouseUp: wrapAction(set, onMouseUp),
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
  set: (cb: (state: State) => Partial<State>) => void,
  action: (state: State, ...args: A) => Partial<State>,
): (...args: A) => void {
  return (...args: A) => set((state) => action(state, ...args))
}
