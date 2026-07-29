import type { Box, Connection, Field, Node, State } from '../State'
import {
  BOTTOM_PADDING,
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
} from './constants'

// Apply a partial state update, then recompute node, field, and connection
// geometry against the previous state so unchanged refs can still be reused.
export function updateNodePositions(
  state: State,
  update?: Partial<State>,
): State {
  const nextState = update ? { ...state, ...update } : state
  const previousNodes = new Map(state.nodes.map((node) => [node.id, node]))

  let dx = nextState.input.mouseX - nextState.input.mouseStartX
  let dy = nextState.input.mouseY - nextState.input.mouseStartY
  if (nextState.input.shiftPressed) {
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
  for (const node of nextState.nodes) {
    const previousNode = previousNodes.get(node.id)
    const start = nextState.positionsBeforeMove[node.id]
    const nextBox: Box = {
      width: node.box.width,
      height: getNodeHeight(node),
      x: start ? start.x + dx : node.box.x,
      y: start ? start.y + dy : node.box.y,
    }
    nextBoxes.set(node.id, nextBox)
    const boxMoved =
      previousNode === undefined || !boxesEqual(nextBox, previousNode.box)
    if (boxMoved) {
      movedIds.add(node.id)
    }
    indexSubnodes(node, nextBox, boxMoved, nextBoxes, movedIds)
  }

  // Pass 2: rebuild nodes lazily. Reuse refs whenever the data is
  // structurally identical so React.memo and useMemo deps can short-circuit.
  let anyNodeChanged = false
  const nextNodes: Node[] = new Array(nextState.nodes.length)
  for (let n = 0; n < nextState.nodes.length; n++) {
    const node = nextState.nodes[n] as Node
    const previousNode = previousNodes.get(node.id)
    const nextBox = nextBoxes.get(node.id) as Box

    const ownBoxMoved = movedIds.has(node.id)
    const targetMoved = ownBoxMoved || nodeHasMovedTarget(node, movedIds)
    const fieldsUnchanged = previousNode?.fields === node.fields
    const hiddenFieldsUnchanged =
      previousNode?.hiddenFields === node.hiddenFields

    // If there are no hidden fields, field boxes and connection anchors are
    // fully determined by the node box and target boxes, so we can skip the
    // per-field walk entirely.
    if (
      !ownBoxMoved &&
      !targetMoved &&
      node.hiddenFields.length === 0 &&
      fieldsUnchanged &&
      hiddenFieldsUnchanged
    ) {
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
        y: nextBox.y + HEADER_HEIGHT + currentVisibleIndex * FIELD_HEIGHT,
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

  // Members of opened groups live nested inside their group. Top-level boxes
  // are handled above; here we drag the nested ones whose ids are being moved.
  // Their display geometry is recomputed by the render graph.
  let nestedMoved = false
  const positions = nextState.positionsBeforeMove
  for (let n = 0; n < nextNodes.length; n++) {
    const node = nextNodes[n] as Node
    if (node.subnodes.length === 0) {
      continue
    }
    const subnodes = shiftSubnodes(node.subnodes, positions, dx, dy)
    if (subnodes !== node.subnodes) {
      nextNodes[n] = { ...node, subnodes }
      nestedMoved = true
    }
  }

  if (!anyNodeChanged && !nestedMoved) {
    return nextState
  }

  return {
    ...nextState,
    nodes: nextNodes,
  }
}

function shiftSubnodes(
  subnodes: readonly Node[],
  positions: State['positionsBeforeMove'],
  dx: number,
  dy: number,
): readonly Node[] {
  let changed = false
  const next = subnodes.map((node) => {
    const start = positions[node.id]
    const movedSubnodes =
      node.subnodes.length > 0
        ? shiftSubnodes(node.subnodes, positions, dx, dy)
        : node.subnodes
    const height = getNodeHeight(node)
    const resized = height !== node.box.height
    if (start !== undefined) {
      changed = true
      return {
        ...node,
        box: { ...node.box, x: start.x + dx, y: start.y + dy, height },
        subnodes: movedSubnodes,
      }
    }
    if (movedSubnodes !== node.subnodes || resized) {
      changed = true
      return {
        ...node,
        box: resized ? { ...node.box, height } : node.box,
        subnodes: movedSubnodes,
      }
    }
    return node
  })
  return changed ? next : subnodes
}

function getNodeHeight(node: Node): number {
  const hiddenFieldsHeight =
    node.hiddenFields.length > 0 ? HIDDEN_FIELDS_FOOTER_HEIGHT : 0
  const visibleFieldsCount = Math.max(
    0,
    node.fields.length - node.hiddenFields.length,
  )
  return (
    HEADER_HEIGHT +
    visibleFieldsCount * FIELD_HEIGHT +
    BOTTOM_PADDING +
    hiddenFieldsHeight
  )
}

function indexSubnodes(
  node: Node,
  box: Box,
  moved: boolean,
  boxes: Map<string, Box>,
  movedIds: Set<string>,
): void {
  for (const subnode of node.subnodes) {
    boxes.set(subnode.id, box)
    if (moved) {
      movedIds.add(subnode.id)
    }
    indexSubnodes(subnode, box, moved, boxes, movedIds)
  }
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

export function processConnection(
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
