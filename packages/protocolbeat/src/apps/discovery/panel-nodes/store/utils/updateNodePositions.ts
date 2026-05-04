import { perfStats } from '../../perf/perfStats'
import type { Box, Connection, Field, Node, State } from '../State'
import {
  BOTTOM_PADDING,
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
} from './constants'

export function updateNodePositions(state: State): State {
  return perfStats.time('updateNodePositions', () => {
    let dx = state.input.mouseX - state.input.mouseStartX
    let dy = state.input.mouseY - state.input.mouseStartY
    if (state.input.shiftPressed) {
      if (Math.abs(dx) > Math.abs(dy)) {
        dy = 0
      } else {
        dx = 0
      }
    }

    // Pass 1: compute next box for every node and remember which boxes
    // actually moved. Anything else (own box stable + none of its targets
    // moved) is a candidate for full-ref reuse.
    const nextBoxes = new Map<string, Box>()
    const movedIds = new Set<string>()
    for (const node of state.nodes) {
      const start = state.positionsBeforeMove[node.id]
      const hiddenFieldsHeight =
        node.hiddenFields.length > 0 ? HIDDEN_FIELDS_FOOTER_HEIGHT : 0
      const nextBox: Box = {
        width: node.box.width,
        height:
          HEADER_HEIGHT +
          (node.fields.length - node.hiddenFields.length) * FIELD_HEIGHT +
          BOTTOM_PADDING +
          hiddenFieldsHeight,
        x: start ? start.x + dx : node.box.x,
        y: start ? start.y + dy : node.box.y,
      }
      nextBoxes.set(node.id, nextBox)
      if (!boxesEqual(nextBox, node.box)) {
        movedIds.add(node.id)
      }
    }

    // Pass 2: rebuild nodes lazily. Reuse refs whenever the data is
    // structurally identical so React.memo and useMemo deps can short-circuit.
    let anyNodeChanged = false
    const nextNodes: Node[] = new Array(state.nodes.length)
    for (let n = 0; n < state.nodes.length; n++) {
      const node = state.nodes[n] as Node
      const nextBox = nextBoxes.get(node.id) as Box

      const ownBoxMoved = movedIds.has(node.id)
      const targetMoved = ownBoxMoved || nodeHasMovedTarget(node, movedIds)

      // If there are no hidden fields, field boxes and connection anchors are
      // fully determined by the node box and target boxes, so we can skip the
      // per-field walk entirely.
      if (!ownBoxMoved && !targetMoved && node.hiddenFields.length === 0) {
        nextNodes[n] = node
        continue
      }

      const hiddenFieldsSet =
        node.hiddenFields.length > 0 ? new Set(node.hiddenFields) : undefined
      let visibleIndex = 0
      let anyFieldChanged = false
      const nextFields: Field[] = new Array(node.fields.length)
      for (let i = 0; i < node.fields.length; i++) {
        const field = node.fields[i] as Field
        const targetBox = nextBoxes.get(field.target)
        if (!targetBox) {
          throw new Error('missing dimensions for node ' + field.target)
        }

        const currentVisibleIndex = visibleIndex
        if (!hiddenFieldsSet?.has(field.name)) {
          visibleIndex++
        }

        const nextFieldBox: Box = {
          x: nextBox.x,
          y: nextBox.y + HEADER_HEIGHT + i * FIELD_HEIGHT,
          width: nextBox.width,
          height: FIELD_HEIGHT,
        }
        const nextConnection = processConnection(
          currentVisibleIndex,
          nextBox,
          targetBox,
        )

        if (
          boxesEqual(field.box, nextFieldBox) &&
          connectionsEqual(field.connection, nextConnection)
        ) {
          nextFields[i] = field
          continue
        }

        anyFieldChanged = true
        nextFields[i] = {
          ...field,
          box: nextFieldBox,
          connection: nextConnection,
        }
      }

      if (!ownBoxMoved && !anyFieldChanged) {
        nextNodes[n] = node
        continue
      }

      anyNodeChanged = true
      nextNodes[n] = {
        ...node,
        box: ownBoxMoved ? nextBox : node.box,
        fields: anyFieldChanged ? nextFields : node.fields,
      }
    }

    if (!anyNodeChanged) {
      return state
    }

    return {
      ...state,
      nodes: nextNodes,
    }
  })
}

function nodeHasMovedTarget(node: Node, movedIds: Set<string>): boolean {
  for (const field of node.fields) {
    if (movedIds.has(field.target)) return true
  }
  return false
}

function boxesEqual(a: Box, b: Box): boolean {
  return (
    a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
  )
}

function connectionsEqual(a: Connection, b: Connection): boolean {
  return (
    a.from.x === b.from.x &&
    a.from.y === b.from.y &&
    a.from.direction === b.from.direction &&
    a.to.x === b.to.x &&
    a.to.y === b.to.y &&
    a.to.direction === b.to.direction
  )
}

function processConnection(
  index: number,
  from: { x: number; y: number; width: number },
  to: { x: number; y: number; width: number },
): Connection {
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
