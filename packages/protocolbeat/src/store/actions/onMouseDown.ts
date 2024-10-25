import { isResizeHandle } from '../../view/ResizeHandle'
import type { State } from '../State'
import {
  CLICKED_LEFT_MOUSE_BUTTON,
  CLICKED_MIDDLE_MOUSE_BUTTON,
} from '../utils/constants'
import { boxContains } from '../utils/containment'
import { toViewCoordinates } from '../utils/coordinates'
import { reverseIter } from '../utils/reverseIter'
import { updateNodePositions } from '../utils/updateNodePositions'

export function onMouseDown(
  state: State,
  event: MouseEvent,
  container: HTMLElement,
): Partial<State> {
  // Resize anchor
  if (isResizeHandle(event.target)) {
    const { nodeId } = event.target.dataset
    const node = state.nodes.find((n) => n.simpleNode.id === nodeId)

    if (node && nodeId) {
      return {
        resizingNode: {
          id: nodeId,
          initialWidth: node.box.width,
          startX: event.clientX,
        },
        mouseMoveAction: 'resize-node',
        pressed: { ...state.pressed, leftMouseButton: true },
      }
    }
  }

  if (event.button === CLICKED_LEFT_MOUSE_BUTTON && !state.mouseMoveAction) {
    if (state.pressed.spaceKey) {
      const [x, y] = [event.clientX, event.clientY]
      return {
        pressed: { ...state.pressed, leftMouseButton: true },
        mouseMoveAction: 'pan',
        mouseMove: { startX: x, startY: y, currentX: x, currentY: y },
      }
    }

    const { x, y } = toViewCoordinates(event, container, state.transform)

    for (const node of reverseIter(state.nodes)) {
      if (boxContains(node.box, x, y)) {
        const includes = state.selected.includes(node.simpleNode.id)

        let selected: readonly string[]
        let mouseUpAction: State['mouseUpAction']
        if (event.metaKey || event.altKey) {
          selected = []

          const field = node.fields.find((f) => boxContains(f.box, x, y))
          if (field !== undefined && field.connection !== undefined) {
            selected = [field.connection.nodeId]
          }
        } else if (!event.shiftKey && !includes) {
          selected = [node.simpleNode.id]
        } else if (!event.shiftKey && includes) {
          selected = state.selected
          mouseUpAction = { type: 'DeselectAllBut', id: node.simpleNode.id }
        } else if (event.shiftKey && !includes) {
          selected = [...state.selected, node.simpleNode.id]
        } else {
          selected = state.selected
          mouseUpAction = { type: 'DeselectOne', id: node.simpleNode.id }
        }

        return updateNodePositions({
          ...state,
          selected,
          pressed: {
            ...state.pressed,
            leftMouseButton: true,
            // this is needed to fix alt tab during shift dragging
            shiftKey: event.shiftKey,
          },
          mouseMoveAction: 'drag',
          mouseMove: { startX: x, startY: y, currentX: x, currentY: y },
          mouseUpAction,
          positionsBeforeMove: Object.fromEntries(
            state.nodes
              .filter((x) => selected.includes(x.simpleNode.id))
              .map((node) => [
                node.simpleNode.id,
                { x: node.box.x, y: node.box.y },
              ]),
          ),
        })
      }
    }

    return updateNodePositions({
      ...state,
      selected: event.shiftKey ? state.selected : [],
      pressed: { ...state.pressed, leftMouseButton: true },
      mouseMoveAction: event.shiftKey ? 'select-add' : 'select',
      mouseMove: { startX: x, startY: y, currentX: x, currentY: y },
    })
  }

  if (event.button === CLICKED_MIDDLE_MOUSE_BUTTON && !state.mouseMoveAction) {
    const [x, y] = [event.clientX, event.clientY]
    return {
      pressed: { ...state.pressed, middleMouseButton: true },
      mouseMoveAction: 'pan',
      mouseMove: { startX: x, startY: y, currentX: x, currentY: y },
    }
  }

  return {}
}
