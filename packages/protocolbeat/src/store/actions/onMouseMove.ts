import type { Box, State } from '../State'
import {
  HELD_LEFT_MOUSE_BUTTON_MASK,
  HELD_MIDDLE_MOUSE_BUTTON_MASK,
  NODE_WIDTH,
} from '../utils/constants'
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

  const isLeftMouse =
    state.pressed.leftMouseButton && event.buttons & HELD_LEFT_MOUSE_BUTTON_MASK
  const isMiddleMouse =
    state.pressed.middleMouseButton &&
    event.buttons & HELD_MIDDLE_MOUSE_BUTTON_MASK
  if (isLeftMouse || isMiddleMouse) {
    switch (state.mouseMoveAction) {
      case undefined: {
        return { ...state, mouseUpAction: undefined }
      }
      case 'resize-node': {
        if (!state.resizingNode) {
          break
        }

        const { scale } = state.transform

        const dx = event.clientX - state.resizingNode.startX

        const newWidth = Math.max(
          state.resizingNode.initialWidth + dx / scale,
          NODE_WIDTH,
        )

        const nodes = state.nodes.map((node) =>
          node.simpleNode.id === state.resizingNode?.id
            ? {
                ...node,
                box: { ...node.box, width: newWidth },
              }
            : node,
        )

        return updateNodePositions({
          ...state,
          nodes,
        })
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
