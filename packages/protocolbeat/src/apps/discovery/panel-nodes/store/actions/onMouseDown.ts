import type { State } from '../State'
import {
  CLICKED_LEFT_MOUSE_BUTTON,
  CLICKED_MIDDLE_MOUSE_BUTTON,
} from '../utils/constants'
import { boxContains, isResizable } from '../utils/containment'
import { toViewCoordinates } from '../utils/coordinates'
import {
  getDragPositionsForSelection,
  getVisibleDisplayedNodes,
  normalizeSelectionForDisplay,
  resolveFocusNodeId,
  resolvePhysicalNodeId,
} from '../utils/entrypointGroups'
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
    const interactiveNodes = getVisibleDisplayedNodes(state)

    for (const node of reverseIter(interactiveNodes)) {
      if (boxContains(node.box, x, y)) {
        const displayId = resolveFocusNodeId(node.id, state)

        if (isResizable(node.box, state.transform.scale, x)) {
          const physicalId = resolvePhysicalNodeId(displayId, state)
          return {
            input: {
              ...state.input,
              lmbPressed: true,
              shiftPressed: event.shiftKey,
              mouseStartX: x,
              mouseStartY: y,
              mouseX: x,
              mouseY: y,
            },
            mouseMoveAction: 'resize-node',
            resizingNode: physicalId,
          }
        }

        const normalizedSelected = normalizeSelectionForDisplay(
          state.selected,
          state,
        )
        const includes = normalizedSelected.includes(displayId)

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
            selected = [resolveFocusNodeId(field.target, state)]
          }
        } else if (!event.shiftKey && !includes) {
          selected = [displayId]
        } else if (!event.shiftKey && includes) {
          selected = normalizedSelected
          mouseUpAction = { type: 'DeselectAllBut', id: displayId }
        } else if (event.shiftKey && !includes) {
          selected = [...normalizedSelected, displayId]
        } else {
          selected = normalizedSelected
          mouseUpAction = { type: 'DeselectOne', id: displayId }
        }

        selected = normalizeSelectionForDisplay(selected, state)

        return updateNodePositions(state, {
          selected,
          input: {
            ...state.input,
            lmbPressed: true,
            shiftPressed: event.shiftKey,
            mouseStartX: x,
            mouseStartY: y,
            mouseX: x,
            mouseY: y,
          },
          mouseMoveAction: 'drag',
          mouseUpAction,
          positionsBeforeMove: getDragPositionsForSelection(state, selected),
        })
      }
    }

    return updateNodePositions(state, {
      selected: event.shiftKey
        ? normalizeSelectionForDisplay(state.selected, state)
        : [],
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
