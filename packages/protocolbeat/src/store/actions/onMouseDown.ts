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
    const node = state.nodes.find((n) => n.id === nodeId)

    if (node && nodeId) {
      return {
        resizingNode: {
          id: nodeId,
          initialWidth: node.box.width,
          startX: event.clientX,
        },
        mouseMoveAction: 'resize-node',
        input: { ...state.input, lmbPressed: true },
      }
    }
  }

  if (event.button === CLICKED_LEFT_MOUSE_BUTTON && !state.mouseMoveAction) {
    if (state.input.spacePressed) {
      const [x, y] = [event.clientX, event.clientY]
      return {
        input: {
          ...state.input,
          lmbPressed: true,
          mouseStartX: x,
          mouseStartY: y,
          mouseX: x,
          mouseY: y,
        },
        mouseMoveAction: 'pan',
      }
    }

    const { x, y } = toViewCoordinates(event, container, state.transform)

    for (const node of reverseIter(state.nodes)) {
      if (boxContains(node.box, x, y)) {
        const includes = state.selected.includes(node.id)

        let selected: readonly string[]
        let mouseUpAction: State['mouseUpAction']
        if (event.metaKey || event.altKey) {
          selected = []

          const field = node.fields.find((f) => boxContains(f.box, x, y))
          if (field !== undefined && field.connection !== undefined) {
            selected = [field.connection.nodeId]
          }
        } else if (!event.shiftKey && !includes) {
          selected = [node.id]
        } else if (!event.shiftKey && includes) {
          selected = state.selected
          mouseUpAction = { type: 'DeselectAllBut', id: node.id }
        } else if (event.shiftKey && !includes) {
          selected = [...state.selected, node.id]
        } else {
          selected = state.selected
          mouseUpAction = { type: 'DeselectOne', id: node.id }
        }

        return updateNodePositions({
          ...state,
          selected,
          input: {
            ...state.input,
            lmbPressed: true,
            // this is needed to fix alt tab during shift dragging
            shiftPressed: event.shiftKey,
            mouseStartX: x,
            mouseStartY: y,
            mouseX: x,
            mouseY: y,
          },
          mouseMoveAction: 'drag',
          mouseUpAction,
          positionsBeforeMove: Object.fromEntries(
            state.nodes
              .filter((x) => selected.includes(x.id))
              .map((node) => [node.id, { x: node.box.x, y: node.box.y }]),
          ),
        })
      }
    }

    return updateNodePositions({
      ...state,
      selected: event.shiftKey ? state.selected : [],
      input: {
        ...state.input,
        lmbPressed: true,
        mouseStartX: x,
        mouseStartY: y,
        mouseX: x,
        mouseY: y,
      },
      mouseMoveAction: event.shiftKey ? 'select-add' : 'select',
    })
  }

  if (event.button === CLICKED_MIDDLE_MOUSE_BUTTON && !state.mouseMoveAction) {
    const [x, y] = [event.clientX, event.clientY]
    return {
      input: {
        ...state.input,
        mmbPressed: true,
        mouseStartX: x,
        mouseStartY: y,
        mouseX: x,
        mouseY: y,
      },
      mouseMoveAction: 'pan',
    }
  }

  return {}
}
