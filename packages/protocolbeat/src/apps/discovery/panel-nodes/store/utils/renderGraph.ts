import type { Box, Node } from '../State'
import { FIELD_HEIGHT, HEADER_HEIGHT } from './constants'
import { boxContains } from './containment'
import { processConnection } from './updateNodePositions'

const CONTAINER_PADDING = 24
export const GROUP_HEADER_HEIGHT = 26

export interface GroupContainer {
  readonly id: string
  readonly name: string
  readonly box: Box
  readonly headerBox: Box
}

export interface RenderGraph {
  // Flat list of nodes to draw. Opened groups are replaced by their (possibly
  // nested) members; closed groups stay collapsed as a single node.
  readonly nodes: Node[]
  // One boundary per opened group, innermost last so hit-testing can prefer it.
  readonly containers: GroupContainer[]
}

// Expand opened groups into their members so the renderers can draw what is
// inside them, while closed groups remain a single collapsed box. Connection
// geometry is recomputed against the expanded layout. When nothing is opened
// the original node refs are returned untouched so React.memo keeps working.
export function buildRenderGraph(
  nodes: readonly Node[],
  hidden: readonly string[],
): RenderGraph {
  const hiddenSet = new Set(hidden)
  const visible = nodes.filter((node) => !hiddenSet.has(node.id))

  const hasOpenGroup = visible.some(
    (node) => node.opened && node.subnodes.length > 0,
  )
  if (!hasOpenGroup) {
    return { nodes: visible, containers: [] }
  }

  const rendered: Node[] = []
  const containers: GroupContainer[] = []
  for (const node of visible) {
    for (const member of expand(node, containers)) {
      rendered.push(member)
    }
  }

  const boxById = new Map<string, Box>()
  for (const node of rendered) {
    boxById.set(node.id, node.box)
    if (node.subnodes.length > 0) {
      indexDescendants(node, node.box, boxById)
    }
  }

  const laidOut = rendered.map((node) => layoutFields(node, boxById))
  return { nodes: laidOut, containers }
}

function expand(node: Node, containers: GroupContainer[]): Node[] {
  if (node.opened && node.subnodes.length > 0) {
    const members = node.subnodes.flatMap((subnode) =>
      expand(subnode, containers),
    )
    containers.push(boundary(node, members))
    return members
  }
  return [node]
}

function boundary(group: Node, members: Node[]): GroupContainer {
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY
  for (const member of members) {
    minX = Math.min(minX, member.box.x)
    minY = Math.min(minY, member.box.y)
    maxX = Math.max(maxX, member.box.x + member.box.width)
    maxY = Math.max(maxY, member.box.y + member.box.height)
  }
  const x = minX - CONTAINER_PADDING
  const y = minY - CONTAINER_PADDING - GROUP_HEADER_HEIGHT
  const width = maxX - minX + CONTAINER_PADDING * 2
  const height = maxY - minY + CONTAINER_PADDING * 2 + GROUP_HEADER_HEIGHT
  return {
    id: group.id,
    name: group.name,
    box: { x, y, width, height },
    headerBox: { x, y, width, height: GROUP_HEADER_HEIGHT },
  }
}

function indexDescendants(
  node: Node,
  box: Box,
  boxById: Map<string, Box>,
): void {
  for (const subnode of node.subnodes) {
    boxById.set(subnode.id, box)
    indexDescendants(subnode, box, boxById)
  }
}

function layoutFields(node: Node, boxById: Map<string, Box>): Node {
  if (node.fields.length === 0) {
    return node
  }
  const hidden =
    node.hiddenFields.length > 0 ? new Set(node.hiddenFields) : undefined

  let row = 0
  const fields = node.fields.map((field) => {
    const r = row
    if (!hidden?.has(field.name)) {
      row++
    }
    const targetBox = boxById.get(field.target)
    const box: Box = {
      x: node.box.x,
      y: node.box.y + HEADER_HEIGHT + r * FIELD_HEIGHT,
      width: node.box.width,
      height: FIELD_HEIGHT,
    }
    const connection = targetBox
      ? processConnection(r, node.box, targetBox)
      : field.connection
    return { ...field, box, connection }
  })
  return { ...node, fields }
}

// Headers never overlap (each is the top strip of its own container), so the
// first hit is the right one even with nested groups.
export function headerAt(
  containers: readonly GroupContainer[],
  x: number,
  y: number,
): GroupContainer | undefined {
  return containers.find((group) => boxContains(group.headerBox, x, y))
}

// The on-screen footprint of each open group, so layout can size and place it
// by its expanded container rather than its collapsed box.
export function containerBoxes(
  nodes: readonly Node[],
  hidden: readonly string[],
): Map<string, Box> {
  const boxes = new Map<string, Box>()
  for (const group of buildRenderGraph(nodes, hidden).containers) {
    boxes.set(group.id, group.box)
  }
  return boxes
}
