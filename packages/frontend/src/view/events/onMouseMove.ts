import { State } from '../utils/State'
import { updateNodePositions } from '../utils/updateNodePositions'
import { LEFT_MOUSE_BUTTON } from './constants'

export function onMouseMove(
  event: MouseEvent,
  state: State,
  container: HTMLElement,
): State | undefined {
  if (!state.pressed.leftMouseButton && !state.pressed.middleMouseButton) {
    return
  }

  if (state.pressed.leftMouseButton && event.button === LEFT_MOUSE_BUTTON) {
    switch (state.mouseMoveAction) {
      case 'none': {
        return { ...state, mouseUpAction: undefined }
      }
      case 'panning': {
        const [x, y] = [event.clientX, event.clientY]
        return {
          ...state,
          transform: {
            ...state.transform,
            offsetX: state.transform.offsetX + x - state.mouseMove.currentX,
            offsetY: state.transform.offsetY + y - state.mouseMove.currentY,
          },
          mouseMove: { ...state.mouseMove, currentX: x, currentY: y },
        }
      }
      case 'dragging': {
        const rect = container.getBoundingClientRect()
        const { offsetX, offsetY, scale } = state.transform
        const x = (event.clientX - rect.left - offsetX) / scale
        const y = (event.clientY - rect.top - offsetY) / scale

        return updateNodePositions({
          ...state,
          mouseUpAction: undefined,
          mouseMove: { ...state.mouseMove, currentX: x, currentY: y },
        })
      }
    }
  }
}
