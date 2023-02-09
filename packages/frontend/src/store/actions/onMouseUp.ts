import { State } from '../State'
import { LEFT_MOUSE_BUTTON, MIDDLE_MOUSE_BUTTON } from '../utils/constants'

export function onMouseUp(state: State, event: MouseEvent): Partial<State> {
  if (event.button === LEFT_MOUSE_BUTTON) {
    let selectedNodeIds = state.selectedNodeIds
    if (state.mouseUpAction?.type === 'DeselectOne') {
      const removeId = state.mouseUpAction.id
      selectedNodeIds = selectedNodeIds.filter((id) => id !== removeId)
    } else if (state.mouseUpAction?.type === 'DeselectAllBut') {
      selectedNodeIds = [state.mouseUpAction.id]
    }

    return {
      selectedNodeIds,
      selectedPositions: {},
      pressed: { ...state.pressed, leftMouseButton: false },
      mouseMoveAction: undefined,
      mouseSelection: undefined,
    }
  }

  if (event.button === MIDDLE_MOUSE_BUTTON) {
    return {
      pressed: { ...state.pressed, middleMouseButton: false },
      mouseMoveAction:
        state.mouseMoveAction === 'pan' ? undefined : state.mouseMoveAction,
    }
  }

  return {}
}
