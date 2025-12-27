import type { Box, Connection, State } from '../State'
import {
  BOTTOM_PADDING,
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
  VALUE_SEPARATOR_HEIGHT,
} from './constants'

export function updateNodePositions(state: State): State {
  let dx = state.input.mouseX - state.input.mouseStartX
  let dy = state.input.mouseY - state.input.mouseStartY
  if (state.input.shiftPressed) {
    if (Math.abs(dx) > Math.abs(dy)) {
      dy = 0
    } else {
      dx = 0
    }
  }

  const nodeDimensions: Record<string, Box> = {}
  for (const node of state.nodes) {
    const start = state.positionsBeforeMove[node.id]
    const hiddenFieldsSet = new Set(node.hiddenFields)
    const addressFields = node.fields.filter((field) => field.type === 'address')
    const valueFields = node.fields.filter((field) => field.type === 'value')
    const visibleAddressCount = addressFields.filter(
      (field) => !hiddenFieldsSet.has(field.name),
    ).length
    const visibleValueCount = valueFields.filter(
      (field) => !hiddenFieldsSet.has(field.name),
    ).length
    const hasValueSection = valueFields.length > 0
    const hiddenFieldsHeight =
      hiddenFieldsSet.size > 0 ? HIDDEN_FIELDS_FOOTER_HEIGHT : 0
    nodeDimensions[node.id] = {
      width: node.box.width,
      height:
        HEADER_HEIGHT +
        visibleAddressCount * FIELD_HEIGHT +
        (hasValueSection ? VALUE_SEPARATOR_HEIGHT : 0) +
        visibleValueCount * FIELD_HEIGHT +
        BOTTOM_PADDING +
        hiddenFieldsHeight,
      x: start ? start.x + dx : node.box.x,
      y: start ? start.y + dy : node.box.y,
    }
  }

  const newState = {
    ...state,
    nodes: state.nodes.map((node) => {
      const box = nodeDimensions[node.id]
      if (!box) {
        // this should never happen
        throw new Error('missing dimensions for node ' + node.id)
      }

      const hiddenFieldsSet = new Set(node.hiddenFields)
      let visibleAddressIndex = 0
      let visibleValueIndex = 0

      const visibleAddressCount = node.fields.filter(
        (field) =>
          field.type === 'address' &&
          !hiddenFieldsSet.has(field.name),
      ).length
      const hasValueSection = node.fields.some((f) => f.type === 'value')

      const addressStartY = box.y + HEADER_HEIGHT
      const valueStartY =
        addressStartY +
        visibleAddressCount * FIELD_HEIGHT +
        (hasValueSection ? VALUE_SEPARATOR_HEIGHT : 0)

      const processedFields = node.fields.map((field) => {
        const isHidden = hiddenFieldsSet.has(field.name)

        if (field.type === 'value') {
          const currentValueIndex = visibleValueIndex
          if (!isHidden) {
            visibleValueIndex++
          }

          const fieldBox = {
            x: box.x,
            y: valueStartY + currentValueIndex * FIELD_HEIGHT,
            width: box.width,
            height: FIELD_HEIGHT,
          }

          return {
            ...field,
            box: fieldBox,
          }
        }

        const currentVisibleIndex = visibleAddressIndex
        if (!isHidden) {
          visibleAddressIndex++
        }

        const fieldBox = {
          x: box.x,
          y: addressStartY + currentVisibleIndex * FIELD_HEIGHT,
          width: box.width,
          height: FIELD_HEIGHT,
        }

        const to = nodeDimensions[field.target]
        if (!to) {
          // this should never happen
          throw new Error('missing dimensions for node ' + field.target)
        }
        return {
          ...field,
          box: fieldBox,
          connection: {
            nodeId: field.target,
            ...processConnection(currentVisibleIndex, box, to),
          },
        }
      })

      return {
        ...node,
        box,
        fields: processedFields,
      }
    }),
  }

  return newState
}

function processConnection(
  index: number,
  from: {
    x: number
    y: number
    width: number
  },
  to: { x: number; y: number; width: number },
): Omit<Connection, 'nodeId'> {
  const fromY = from.y + HEADER_HEIGHT + FIELD_HEIGHT * (index + 0.5)
  const toY = to.y + HEADER_HEIGHT / 2

  const left = from.x
  const right = from.x + from.width

  const leftToLeft = Math.abs(to.x - left)
  const leftToRight = Math.abs(to.x + to.width - left)
  const rightToLeft = Math.abs(to.x - right)
  const rightToRight = Math.abs(to.x + to.width - right)

  const min = Math.min(leftToLeft, leftToRight, rightToLeft, rightToRight)

  if (min === leftToLeft) {
    return {
      from: { direction: 'left', x: from.x, y: fromY },
      to: { direction: 'left', x: to.x, y: toY },
    }
  }
  if (min === leftToRight) {
    return {
      from: { direction: 'left', x: from.x, y: fromY },
      to: { direction: 'right', x: to.x + to.width, y: toY },
    }
  }
  if (min === rightToLeft) {
    return {
      from: { direction: 'right', x: from.x + from.width, y: fromY },
      to: { direction: 'left', x: to.x, y: toY },
    }
  }
  if (min === rightToRight) {
    return {
      from: { direction: 'right', x: from.x + from.width, y: fromY },
      to: { direction: 'right', x: to.x + to.width, y: toY },
    }
  }

  throw new Error('impossible min result')
}
