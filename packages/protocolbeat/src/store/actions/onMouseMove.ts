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
  if (!state.input.lmbPressed && !state.input.mmbPressed) {
    return state
  }

  const isLeftMouse =
    state.input.lmbPressed && event.buttons & HELD_LEFT_MOUSE_BUTTON_MASK
  const isMiddleMouse =
    state.input.mmbPressed && event.buttons & HELD_MIDDLE_MOUSE_BUTTON_MASK
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
            offsetX: state.transform.offsetX + x - state.input.mouseX,
            offsetY: state.transform.offsetY + y - state.input.mouseY,
          },
          input: { ...state.input, mouseX: x, mouseY: y },
        }
      }
      case 'drag': {
        const { x, y } = toViewCoordinates(event, container, state.transform)

        return updateNodePositions({
          ...state,
          mouseUpAction: undefined,
          input: { ...state.input, mouseX: x, mouseY: y },
        })
      }
      case 'select':
      case 'select-add': {
        const { x, y } = toViewCoordinates(event, container, state.transform)
        const input = { ...state.input, mouseX: x, mouseY: y }
        const selection: Box = {
          x: Math.min(input.mouseStartX, input.mouseX),
          y: Math.min(input.mouseStartY, input.mouseY),
          width: Math.abs(input.mouseStartX - input.mouseX),
          height: Math.abs(input.mouseStartY - input.mouseY),
        }

        return updateNodePositions({
          ...state,
          selected: state.nodes
            .filter(
              (node) =>
                intersects(node.box, selection) ||
                (state.mouseMoveAction === 'select-add' &&
                  state.selected.includes(node.simpleNode.id)),
            )
            .map((x) => x.simpleNode.id),
          mouseUpAction: undefined,
          input,
          selection: toContainerCoordinates(selection, state.transform),
        })
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
