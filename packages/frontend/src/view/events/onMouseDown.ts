import { State } from '../utils/State'
import { LEFT_MOUSE_BUTTON, MIDDLE_MOUSE_BUTTON } from './constants'
import { getViewCoordinates } from './getViewCoordinates'

export function onMouseDown(
  event: MouseEvent,
  state: State,
  container: HTMLElement,
): State | undefined {
  if (event.button === LEFT_MOUSE_BUTTON && !state.mouseMoveAction) {
    if (state.pressed.spaceKey) {
      const [x, y] = [event.clientX, event.clientY]
      return {
        ...state,
        pressed: { ...state.pressed, leftMouseButton: true },
        mouseMoveAction: 'pan',
        mouseMove: { startX: x, startY: y, currentX: x, currentY: y },
      }
    }

    const { x, y } = getViewCoordinates(event, container, state.transform)

    for (const node of reverseIter(state.nodes)) {
      if (
        x >= node.box.x &&
        x < node.box.x + node.box.width &&
        y >= node.box.y &&
        y < node.box.y + node.box.height
      ) {
        const includes = state.selectedNodeIds.includes(node.id)

        let selectedNodeIds: readonly string[]
        let mouseUpAction: State['mouseUpAction']
        if (!event.shiftKey && !includes) {
          selectedNodeIds = [node.id]
        } else if (!event.shiftKey && includes) {
          selectedNodeIds = state.selectedNodeIds
          mouseUpAction = { type: 'DeselectAllBut', id: node.id }
        } else if (event.shiftKey && !includes) {
          selectedNodeIds = [...state.selectedNodeIds, node.id]
        } else {
          selectedNodeIds = state.selectedNodeIds
          mouseUpAction = { type: 'DeselectOne', id: node.id }
        }

        return {
          ...state,
          selectedNodeIds,
          pressed: {
            ...state.pressed,
            leftMouseButton: true,
            // this is needed to fix alt tab during shift dragging
            shiftKey: event.shiftKey,
          },
          mouseMoveAction: 'drag',
          mouseMove: { startX: x, startY: y, currentX: x, currentY: y },
          mouseUpAction,
          selectedPositions: Object.fromEntries(
            state.nodes
              .filter((x) => selectedNodeIds.includes(x.id))
              .map((node) => [node.id, { x: node.box.x, y: node.box.y }]),
          ),
        }
      }
    }

    return {
      ...state,
      selectedNodeIds: [],
      pressed: { ...state.pressed, leftMouseButton: true },
      mouseMoveAction: 'select',
      mouseMove: { startX: x, startY: y, currentX: x, currentY: y },
    }
  }

  if (event.button === MIDDLE_MOUSE_BUTTON && !state.mouseMoveAction) {
    return {
      ...state,
      pressed: { ...state.pressed, middleMouseButton: true },
      mouseMoveAction: 'pan',
    }
  }
}

function* reverseIter<T>(array: readonly T[]) {
  for (let i = array.length - 1; i >= 0; i--) {
    yield array[i] as T
  }
}
