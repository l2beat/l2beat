import type { Box, State } from '../State'
import {
  HELD_LEFT_MOUSE_BUTTON_MASK,
  HELD_MIDDLE_MOUSE_BUTTON_MASK,
  NODE_WIDTH,
} from '../utils/constants'
import { boxContains, intersects, isResizable } from '../utils/containment'
import { toViewCoordinates } from '../utils/coordinates'
import { expandedNodes } from '../utils/renderGraph'
import { toContainerCoordinates } from '../utils/toContainerCoordinates'
import { updateNodePositions } from '../utils/updateNodePositions'

export function onMouseMove(
  state: State,
  event: MouseEvent,
  container: HTMLElement,
  opts?: {
    disableSelection?: boolean
  },
): Partial<State> {
  if (!state.input.lmbPressed && !state.input.mmbPressed) {
    const { x, y } = toViewCoordinates(event, container, state.transform)
    const node = state.nodes.find((node) => boxContains(node.box, x, y))
    const next =
      node && isResizable(node.box, state.transform.scale, x)
        ? node.id
        : undefined

    // Returning the same state ref makes Zustand's setState bail on
    // Object.is and skip notifying every subscriber. Without this, every
    // native mousemove (60-120 Hz) re-evaluates every selector in the tree.
    if (next === state.resizingNode) {
      return state
    }
    return { resizingNode: next }
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
        const node = state.nodes.find((node) => node.id === state.resizingNode)
        if (!node) {
          break
        }
        const { x, y } = toViewCoordinates(event, container, state.transform)
        const newWidth = Math.max(NODE_WIDTH, x - node.box.x)

        const nodes = state.nodes.map((other) =>
          other.id === node.id
            ? {
                ...node,
                box: { ...node.box, width: newWidth },
              }
            : other,
        )

        return updateNodePositions(state, {
          input: { ...state.input, mouseX: x, mouseY: y },
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

        return updateNodePositions(state, {
          mouseUpAction: undefined,
          input: { ...state.input, mouseX: x, mouseY: y },
        })
      }
      case 'select':
      case 'select-add': {
        if (opts?.disableSelection) {
          const [x, y] = [event.clientX, event.clientY]
          return {
            mouseMoveAction: 'pan',
            input: {
              ...state.input,
              lmbPressed: true,
              mouseStartX: x,
              mouseStartY: y,
              mouseX: x,
              mouseY: y,
            },
            selection: undefined,
          }
        }

        const { x, y } = toViewCoordinates(event, container, state.transform)
        const input = { ...state.input, mouseX: x, mouseY: y }

        const selection: Box = {
          x: Math.min(input.mouseStartX, input.mouseX),
          y: Math.min(input.mouseStartY, input.mouseY),
          width: Math.abs(input.mouseStartX - input.mouseX),
          height: Math.abs(input.mouseStartY - input.mouseY),
        }

        // Select-box doesn't move any nodes, so skip updateNodePositions —
        // it would rebuild every node and connection per mousemove for no
        // reason. Only the selection rectangle and selected ids change.
        // expandedNodes flattens opened groups so their members are selectable,
        // without recomputing field/connection geometry we never read here.
        const previousSelected =
          state.mouseMoveAction === 'select-add'
            ? new Set(state.selected)
            : undefined
        const selected: string[] = []
        for (const node of expandedNodes(state.nodes)) {
          if (
            intersects(node.box, selection) ||
            previousSelected?.has(node.id)
          ) {
            selected.push(node.id)
          }
        }

        return {
          selected,
          mouseUpAction: undefined,
          input,
          selection: toContainerCoordinates(selection, state.transform),
        }
      }
    }
  }

  return {}
}
