import { Box, State } from '../State'
import { LEFT_MOUSE_BUTTON } from '../utils/constants'
import { toViewCoordinates } from '../utils/coordinates'
import { toContainerCoordinates } from '../utils/toContainerCoordinates'
import { updateNodePositions } from '../utils/updateNodePositions'

export function onMouseMove(
  state: State,
  event: MouseEvent,
  container: HTMLElement,
): Partial<State> {
  if (!state.pressed.leftMouseButton && !state.pressed.middleMouseButton) {
    return {}
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
        const { x, y } = toViewCoordinates(event, container, state.transform)

        return updateNodePositions({
          ...state,
          mouseUpAction: undefined,
          mouseMove: { ...state.mouseMove, currentX: x, currentY: y },
        })
      }
      case 'select':
      case 'select-add': {
        const { x, y } = toViewCoordinates(event, container, state.transform)
        const mouseMove = { ...state.mouseMove, currentX: x, currentY: y }
        const selection: Box = {
          x: Math.min(mouseMove.startX, mouseMove.currentX),
          y: Math.min(mouseMove.startY, mouseMove.currentY),
          width: Math.abs(mouseMove.startX - mouseMove.currentX),
          height: Math.abs(mouseMove.startY - mouseMove.currentY),
        }

        return {
          ...state,
          selectedNodeIds: state.nodes
            .filter(
              (node) =>
                intersects(node.box, selection) ||
                (state.mouseMoveAction === 'select-add' &&
                  state.selectedNodeIds.includes(node.simpleNode.id)),
            )
            .map((x) => x.simpleNode.id),
          mouseUpAction: undefined,
          mouseMove,
          mouseSelection: toContainerCoordinates(selection, state.transform),
        }
      }
    }
  }

  return {}
}

function intersects(a: Box, b: Box) {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  )
}
