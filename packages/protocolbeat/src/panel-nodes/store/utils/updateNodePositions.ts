import type { Box, Connection, State } from '../State'
import { BOTTOM_PADDING, FIELD_HEIGHT, HEADER_HEIGHT } from './constants'

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
    nodeDimensions[node.id] = {
      width: node.box.width,
      height:
        HEADER_HEIGHT + node.fields.length * FIELD_HEIGHT + BOTTOM_PADDING,
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
      return {
        ...node,
        box,
        fields: node.fields.map((field, index) => {
          const to = nodeDimensions[field.target]
          if (!to) {
            // this should never happen
            throw new Error('missing dimensions for node ' + field.target)
          }
          return {
            ...field,
            box: {
              x: box.x,
              y: box.y + HEADER_HEIGHT + index * FIELD_HEIGHT,
              width: box.width,
              height: FIELD_HEIGHT,
            },
            connection: {
              nodeId: field.target,
              ...processConnection(index, box, to),
            },
          }
        }),
      }
    }),
  }

  return newState
}

function processConnection(
  index: number,
  from: { x: number; y: number; width: number },
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
  } else if (min === leftToRight) {
    return {
      from: { direction: 'left', x: from.x, y: fromY },
      to: { direction: 'right', x: to.x + to.width, y: toY },
    }
  } else if (min === rightToLeft) {
    return {
      from: { direction: 'right', x: from.x + from.width, y: fromY },
      to: { direction: 'left', x: to.x, y: toY },
    }
  } else if (min === rightToRight) {
    return {
      from: { direction: 'right', x: from.x + from.width, y: fromY },
      to: { direction: 'right', x: to.x + to.width, y: toY },
    }
  }

  throw new Error('impossible min result')
}
