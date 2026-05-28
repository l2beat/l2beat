import type { Box, State } from '../State'
import {
  HELD_LEFT_MOUSE_BUTTON_MASK,
  HELD_MIDDLE_MOUSE_BUTTON_MASK,
  NODE_WIDTH,
} from '../utils/constants'
import { boxContains, intersects, isResizable } from '../utils/containment'
import { toViewCoordinates } from '../utils/coordinates'
import {
  getVisibleDisplayedNodes,
  normalizeSelectionForDisplay,
  resolveFocusNodeId,
  resolvePhysicalNodeId,
} from '../utils/entrypointGroups'
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
    const interactiveNodes = getVisibleDisplayedNodes(state)
    const node = interactiveNodes.find((node) => boxContains(node.box, x, y))
    const displayId = node ? resolveFocusNodeId(node.id, state) : undefined
    const next =
      node && isResizable(node.box, state.transform.scale, x)
        ? resolvePhysicalNodeId(displayId ?? node.id, state)
        : undefined

    if (next === state.resizingNode) {
      return {}
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

        const hiddenSet = new Set(state.hidden)
        const previousSelected =
          state.mouseMoveAction === 'select-add'
            ? new Set(state.selected)
            : undefined
        const selected: string[] = []
        const interactiveNodes = getVisibleDisplayedNodes(state)
        for (const node of interactiveNodes) {
          if (hiddenSet.has(node.id)) continue
          const displayId = resolveFocusNodeId(node.id, state)
          if (
            intersects(node.box, selection) ||
            previousSelected?.has(displayId)
          ) {
            selected.push(displayId)
          }
        }

        return {
          selected: normalizeSelectionForDisplay(selected, state),
          mouseUpAction: undefined,
          input,
          selection: toContainerCoordinates(selection, state.transform),
        }
      }
    }
  }

  return {}
}
