import type { Box, Connection, State } from '../State'
import {
  BOTTOM_PADDING,
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
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

  // Compute new box for every node. If the node isn't being dragged/resized
  // (no entry in positionsBeforeMove), we may still end up with the same box
  // as before — preserve identity when that happens.
  const newBoxById = new Map<string, Box>()
  const movedIds = new Set<string>()
  for (const node of state.nodes) {
    const start = state.positionsBeforeMove[node.id]
    const hiddenFieldsHeight =
      node.hiddenFields.length > 0 ? HIDDEN_FIELDS_FOOTER_HEIGHT : 0
    const height =
      HEADER_HEIGHT +
      (node.fields.length - node.hiddenFields.length) * FIELD_HEIGHT +
      BOTTOM_PADDING +
      hiddenFieldsHeight

    let nextBox: Box
    if (start !== undefined) {
      nextBox = {
        width: node.box.width,
        height,
        x: start.x + dx,
        y: start.y + dy,
      }
    } else if (node.box.height !== height) {
      // Height changed (e.g. hiddenFields toggled) — keep x/y, update height.
      nextBox = {
        width: node.box.width,
        height,
        x: node.box.x,
        y: node.box.y,
      }
    } else {
      nextBox = node.box
    }
    newBoxById.set(node.id, nextBox)
    if (nextBox !== node.box) {
      movedIds.add(node.id)
    }
  }

  // Detect nodes whose fields have never been laid out (initial load case).
  // Such fields have a connection without a nodeId set (see processConnection).
  const nodesNeedingInitialLayout = new Set<string>()
  for (const node of state.nodes) {
    for (const field of node.fields) {
      if ((field.connection as { nodeId?: string }).nodeId === undefined) {
        nodesNeedingInitialLayout.add(node.id)
        break
      }
    }
  }

  if (movedIds.size === 0 && nodesNeedingInitialLayout.size === 0) {
    // Nothing actually changed — keep identity of the whole nodes array.
    return state
  }

  const nextNodes = state.nodes.map((node) => {
    const nextBox = newBoxById.get(node.id) as Box

    const nodeMoved = movedIds.has(node.id)
    const nodeNeedsInitial = nodesNeedingInitialLayout.has(node.id)
    // Does any field on this node point to a moved target?
    let anyTargetMoved = false
    for (const f of node.fields) {
      if (movedIds.has(f.target)) {
        anyTargetMoved = true
        break
      }
    }

    if (!nodeMoved && !anyTargetMoved && !nodeNeedsInitial) {
      // Neither this node nor any of its targets moved and the node has
      // already been laid out — keep identity.
      return node
    }

    const hiddenFieldsSet = new Set(node.hiddenFields)

    const processedFields = node.fields.map((field, index) => {
      const toBox = newBoxById.get(field.target)
      if (!toBox) {
        // This should never happen, but keep old field as a safe fallback.
        return field
      }
      const targetMoved = movedIds.has(field.target)
      const fieldNeedsInitial =
        (field.connection as { nodeId?: string }).nodeId === undefined
      if (!nodeMoved && !targetMoved && !fieldNeedsInitial) {
        return field
      }

      const nextFieldBox =
        nodeMoved || fieldNeedsInitial
          ? {
              x: nextBox.x,
              y: nextBox.y + HEADER_HEIGHT + index * FIELD_HEIGHT,
              width: nextBox.width,
              height: FIELD_HEIGHT,
            }
          : field.box

      return {
        ...field,
        box: nextFieldBox,
        connection: {
          nodeId: field.target,
          ...processConnection(
            getVisibleIndex(node.fields, hiddenFieldsSet, index),
            nextBox,
            toBox,
          ),
        },
      }
    })

    return {
      ...node,
      box: nextBox,
      fields: processedFields,
    }
  })

  return {
    ...state,
    nodes: nextNodes,
  }
}

function getVisibleIndex(
  fields: readonly { name: string }[],
  hiddenFieldsSet: Set<string>,
  index: number,
): number {
  let visible = 0
  for (let i = 0; i < index; i++) {
    const f = fields[i]
    if (f !== undefined && !hiddenFieldsSet.has(f.name)) {
      visible++
    }
  }
  return visible
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
