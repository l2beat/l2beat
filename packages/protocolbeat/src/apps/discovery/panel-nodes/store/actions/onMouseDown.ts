import type { Node, State } from '../State'
import {
  CLICKED_LEFT_MOUSE_BUTTON,
  CLICKED_MIDDLE_MOUSE_BUTTON,
} from '../utils/constants'
import { boxContains, isResizable } from '../utils/containment'
import { toViewCoordinates } from '../utils/coordinates'
import { buildRenderGraph, headerAt } from '../utils/renderGraph'
import { reverseIter } from '../utils/reverseIter'
import { updateNodePositions } from '../utils/updateNodePositions'

export function onMouseDown(
  state: State,
  event: MouseEvent,
  container: HTMLElement,
): Partial<State> {
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
    const graph = buildRenderGraph(state.nodes)

    // Clicking an open group's header selects the group and drags it (and,
    // through positionsBeforeMove, its whole subtree) as one unit.
    const header = headerAt(graph.containers, x, y)
    if (header !== undefined) {
      const selected = event.shiftKey
        ? [...state.selected, header.id]
        : [header.id]
      return startDrag(state, selected, x, y, event.shiftKey)
    }

    for (const node of reverseIter(graph.nodes)) {
      if (boxContains(node.box, x, y)) {
        if (isResizable(node.box, state.transform.scale, x)) {
          return {
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
            mouseMoveAction: 'resize-node',
            resizingNode: node.id,
          }
        }

        const includes = state.selected.includes(node.id)

        let selected: readonly string[]
        let mouseUpAction: State['mouseUpAction']
        if (event.metaKey || event.altKey) {
          selected = []

          const hiddenFields =
            node.hiddenFields.length > 0
              ? new Set(node.hiddenFields)
              : undefined
          const field = node.fields.find(
            (f) => !hiddenFields?.has(f.name) && boxContains(f.box, x, y),
          )
          if (field !== undefined) {
            selected = [field.target]
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

        return startDrag(state, selected, x, y, event.shiftKey, mouseUpAction)
      }
    }

    return updateNodePositions(state, {
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

function startDrag(
  state: State,
  selected: readonly string[],
  x: number,
  y: number,
  shiftPressed: boolean,
  mouseUpAction?: State['mouseUpAction'],
): Partial<State> {
  return updateNodePositions(state, {
    selected,
    input: {
      ...state.input,
      lmbPressed: true,
      shiftPressed,
      mouseStartX: x,
      mouseStartY: y,
      mouseX: x,
      mouseY: y,
    },
    mouseMoveAction: 'drag',
    mouseUpAction,
    positionsBeforeMove: collectDragPositions(state.nodes, new Set(selected)),
  })
}

// Selecting a node drags its whole subtree, so a group carries its members and
// a member (or nested group) carries its own contents.
function collectDragPositions(
  nodes: readonly Node[],
  selected: Set<string>,
): State['positionsBeforeMove'] {
  const positions: Record<string, { x: number; y: number }> = {}
  const walk = (list: readonly Node[], underSelected: boolean) => {
    for (const node of list) {
      const dragged = underSelected || selected.has(node.id)
      if (dragged) {
        positions[node.id] = { x: node.box.x, y: node.box.y }
      }
      if (node.subnodes.length > 0) {
        walk(node.subnodes, dragged)
      }
    }
  }
  walk(nodes, false)
  return positions
}
