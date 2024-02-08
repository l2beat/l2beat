import { isResizeHandle } from '../../view/ResizeHandle'
import { State } from '../State'
import { LEFT_MOUSE_BUTTON, MIDDLE_MOUSE_BUTTON } from '../utils/constants'
import { toViewCoordinates } from '../utils/coordinates'
import { reverseIter } from '../utils/reverseIter'

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

  if (event.button === LEFT_MOUSE_BUTTON && !state.mouseMoveAction) {
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
      if (
        x >= node.box.x &&
        x < node.box.x + node.box.width &&
        y >= node.box.y &&
        y < node.box.y + node.box.height
      ) {
        const includes = state.selectedNodeIds.includes(node.simpleNode.id)

        let selectedNodeIds: readonly string[]
        let mouseUpAction: State['mouseUpAction']
        if (!event.shiftKey && !includes) {
          selectedNodeIds = [node.simpleNode.id]
        } else if (!event.shiftKey && includes) {
          selectedNodeIds = state.selectedNodeIds
          mouseUpAction = { type: 'DeselectAllBut', id: node.simpleNode.id }
        } else if (event.shiftKey && !includes) {
          selectedNodeIds = [...state.selectedNodeIds, node.simpleNode.id]
        } else {
          selectedNodeIds = state.selectedNodeIds
          mouseUpAction = { type: 'DeselectOne', id: node.simpleNode.id }
        }

        return {
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
              .filter((x) => selectedNodeIds.includes(x.simpleNode.id))
              .map((node) => [
                node.simpleNode.id,
                { x: node.box.x, y: node.box.y },
              ]),
          ),
        }
      }
    }

    return {
      selectedNodeIds: event.shiftKey ? state.selectedNodeIds : [],
      pressed: { ...state.pressed, leftMouseButton: true },
      mouseMoveAction: event.shiftKey ? 'select-add' : 'select',
      mouseMove: { startX: x, startY: y, currentX: x, currentY: y },
    }
  }

  if (event.button === MIDDLE_MOUSE_BUTTON && !state.mouseMoveAction) {
    return {
      pressed: { ...state.pressed, middleMouseButton: true },
      mouseMoveAction: 'pan',
    }
  }

  return {}
}
