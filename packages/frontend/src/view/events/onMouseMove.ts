import { Box, State } from '../utils/State'
import { updateNodePositions } from '../utils/updateNodePositions'
import { LEFT_MOUSE_BUTTON } from './constants'
import { getViewCoordinates } from './getViewCoordinates'

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
      case undefined: {
        return { ...state, mouseUpAction: undefined }
      }
      case 'pan': {
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
      case 'drag': {
        const { x, y } = getViewCoordinates(event, container, state.transform)

        return updateNodePositions({
          ...state,
          mouseUpAction: undefined,
          mouseMove: { ...state.mouseMove, currentX: x, currentY: y },
        })
      }
      case 'select': {
        const { x, y } = getViewCoordinates(event, container, state.transform)
        const mouseMove = { ...state.mouseMove, currentX: x, currentY: y }
        const mouseSelection: Box = {
          x: Math.min(mouseMove.startX, mouseMove.currentX),
          y: Math.min(mouseMove.startY, mouseMove.currentY),
          width: Math.abs(mouseMove.startX - mouseMove.currentX),
          height: Math.abs(mouseMove.startY - mouseMove.currentY),
        }

        console.log(state.mouseSelection)

        return {
          ...state,
          selectedNodeIds: state.nodes
            .filter((node) => intersects(node.box, mouseSelection))
            .map((x) => x.id),
          mouseUpAction: undefined,
          mouseMove,
          mouseSelection,
        }
      }
    }
  }
}

function intersects(a: Box, b: Box) {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  )
}
