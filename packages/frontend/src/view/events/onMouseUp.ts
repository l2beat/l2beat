import { State } from '../utils/State'
import { LEFT_MOUSE_BUTTON, MIDDLE_MOUSE_BUTTON } from './constants'

export function onMouseUp(event: MouseEvent, state: State): State | undefined {
  if (event.button === LEFT_MOUSE_BUTTON) {
    let selectedNodeIds = state.selectedNodeIds
    if (state.mouseUpAction?.type === 'DeselectOne') {
      const removeId = state.mouseUpAction.id
      selectedNodeIds = selectedNodeIds.filter((id) => id !== removeId)
    } else if (state.mouseUpAction?.type === 'DeselectAllBut') {
      selectedNodeIds = [state.mouseUpAction.id]
    }

    return {
      ...state,
      selectedNodeIds,
      pressed: { ...state.pressed, leftMouseButton: false },
      mouseMoveAction: 'none',
      selectedPositions: {},
    }
  }

  if (event.button === MIDDLE_MOUSE_BUTTON) {
    return {
      ...state,
      pressed: { ...state.pressed, middleMouseButton: false },
      mouseMoveAction:
        state.mouseMoveAction === 'panning' ? 'none' : state.mouseMoveAction,
    }
  }
}
