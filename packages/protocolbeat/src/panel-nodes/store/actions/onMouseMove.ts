import type { Box, State } from '../State'
import {
  HELD_LEFT_MOUSE_BUTTON_MASK,
  HELD_MIDDLE_MOUSE_BUTTON_MASK,
  NODE_WIDTH,
} from '../utils/constants'
import { boxContains, intersects, isResizable } from '../utils/containment'
import { toViewCoordinates } from '../utils/coordinates'
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
    if (node && isResizable(node.box, state.transform.scale, x)) {
      return {
        resizingNode: node.id,
      }
    }

    return { resizingNode: undefined }
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

        return updateNodePositions({
          ...state,
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

        return updateNodePositions({
          ...state,
          mouseUpAction: undefined,
          input: { ...state.input, mouseX: x, mouseY: y },
        })
      }
      case 'select':
      case 'select-add': {
        if (opts?.disableSelection) {
          const [x, y] = [event.clientX, event.clientY]
          return updateNodePositions({
            ...state,
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
          })
        }

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
                !state.hidden.includes(node.id) &&
                (intersects(node.box, selection) ||
                  (state.mouseMoveAction === 'select-add' &&
                    state.selected.includes(node.id))),
            )
            .map((x) => x.id),
          mouseUpAction: undefined,
          input,
          selection: toContainerCoordinates(selection, state.transform),
        })
      }
    }
  }

  return {}
}
