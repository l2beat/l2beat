import { assert } from '@l2beat/shared-pure'
import type { Box, Node } from '../State'
import { flowLayout } from './flowLayout'
import type { GraphEdge } from './graphProjection'
import { getNodeCriticality } from './securityPerimeter'
import type { NodeLocations } from './storage'
import { topLevelByDescendant } from './subnodes'

const PERIMETER_LAYOUT_GAP = 160
const EMPTY_HIDDEN = new Set<string>()

type OutsideSide = 'left' | 'right' | 'below'

interface PlacedBucket {
  readonly locations: NodeLocations
  readonly width: number
  readonly height: number
}

// Places every ossification-critical node inside one contiguous central region
// and non-critical nodes around it by connection direction, so the security
// perimeter wraps all critical contracts without enclosing anything outside.
export function perimeterLayout(
  baseNodes: readonly Node[],
  freshLayout: boolean,
  visibleEdges: readonly GraphEdge[],
  hidden: ReadonlySet<string> = EMPTY_HIDDEN,
): NodeLocations {
  if (baseNodes.length === 0) {
    return {}
  }

  const inside: Node[] = []
  const outside: Node[] = []
  for (const node of baseNodes) {
    if (getNodeCriticality(node, hidden) === 'all') {
      inside.push(node)
    } else {
      outside.push(node)
    }
  }

  if (inside.length === 0 || outside.length === 0) {
    return flowLayout(baseNodes, freshLayout, visibleEdges)
  }

  const { left, right, below } = partitionOutside(
    outside,
    new Set(inside.map((node) => node.id)),
    baseNodes,
    visibleEdges,
  )

  const insidePlaced = layoutBucket(inside, visibleEdges)
  const leftPlaced =
    left.length > 0 ? layoutBucket(left, visibleEdges) : undefined
  const rightPlaced =
    right.length > 0 ? layoutBucket(right, visibleEdges) : undefined
  const belowPlaced =
    below.length > 0 ? layoutBucket(below, visibleEdges) : undefined

  const combined = composeBuckets(
    insidePlaced,
    leftPlaced,
    rightPlaced,
    belowPlaced,
  )
  const anchor = getAnchorPoint(baseNodes, freshLayout)
  const locations: NodeLocations = {}
  for (const [id, point] of Object.entries(combined)) {
    locations[id] = {
      x: point.x + anchor.x,
      y: point.y + anchor.y,
    }
  }
  assert(
    Object.keys(locations).length === baseNodes.length,
    'every node placed',
  )
  return locations
}

function partitionOutside(
  outside: readonly Node[],
  insideIds: ReadonlySet<string>,
  baseNodes: readonly Node[],
  visibleEdges: readonly GraphEdge[],
): { left: Node[]; right: Node[]; below: Node[] } {
  const outsideIds = new Set(outside.map((node) => node.id))
  const byLeaf = topLevelByDescendant(baseNodes)
  const toInside = new Map<string, number>()
  const fromInside = new Map<string, number>()
  const outNeighbors = new Map<string, string[]>()
  const inNeighbors = new Map<string, string[]>()

  for (const edge of visibleEdges) {
    const source = byLeaf.get(edge.source)?.id
    const target = byLeaf.get(edge.target)?.id
    if (source === undefined || target === undefined || source === target) {
      continue
    }
    if (outsideIds.has(source) && insideIds.has(target)) {
      toInside.set(source, (toInside.get(source) ?? 0) + 1)
    } else if (insideIds.has(source) && outsideIds.has(target)) {
      fromInside.set(target, (fromInside.get(target) ?? 0) + 1)
    } else if (outsideIds.has(source) && outsideIds.has(target)) {
      pushNeighbor(outNeighbors, source, target)
      pushNeighbor(inNeighbors, target, source)
    }
  }

  const sides = new Map<string, OutsideSide>()
  for (const node of outside) {
    const inward = toInside.get(node.id) ?? 0
    const outward = fromInside.get(node.id) ?? 0
    if (inward > outward) {
      sides.set(node.id, 'left')
    } else if (outward > 0) {
      sides.set(node.id, 'right')
    }
  }

  propagateSide(sides, 'right', outNeighbors)
  propagateSide(sides, 'left', inNeighbors)
  propagateUndirected(sides, 'right', outNeighbors, inNeighbors)
  propagateUndirected(sides, 'left', outNeighbors, inNeighbors)

  const left: Node[] = []
  const right: Node[] = []
  const below: Node[] = []
  for (const node of outside) {
    const side = sides.get(node.id) ?? 'below'
    if (side === 'left') left.push(node)
    else if (side === 'right') right.push(node)
    else below.push(node)
  }
  return { left, right, below }
}

function pushNeighbor(
  map: Map<string, string[]>,
  from: string,
  to: string,
): void {
  const list = map.get(from) ?? []
  list.push(to)
  map.set(from, list)
}

function propagateSide(
  sides: Map<string, OutsideSide>,
  targetSide: 'left' | 'right',
  neighbors: ReadonlyMap<string, readonly string[]>,
): void {
  const queue = [...sides.entries()]
    .filter(([, side]) => side === targetSide)
    .map(([id]) => id)
  for (const current of queue) {
    for (const next of neighbors.get(current) ?? []) {
      if (sides.has(next)) continue
      sides.set(next, targetSide)
      queue.push(next)
    }
  }
}

function propagateUndirected(
  sides: Map<string, OutsideSide>,
  targetSide: 'left' | 'right',
  outNeighbors: ReadonlyMap<string, readonly string[]>,
  inNeighbors: ReadonlyMap<string, readonly string[]>,
): void {
  const queue = [...sides.entries()]
    .filter(([, side]) => side === targetSide)
    .map(([id]) => id)
  for (const current of queue) {
    for (const next of [
      ...(outNeighbors.get(current) ?? []),
      ...(inNeighbors.get(current) ?? []),
    ]) {
      if (sides.has(next)) continue
      sides.set(next, targetSide)
      queue.push(next)
    }
  }
}

function layoutBucket(
  nodes: readonly Node[],
  visibleEdges: readonly GraphEdge[],
): PlacedBucket {
  const locations = flowLayout(nodes, true, visibleEdges)
  let maxX = 0
  let maxY = 0
  for (const node of nodes) {
    const point = locations[node.id]
    assert(point !== undefined, 'bucket node placed')
    maxX = Math.max(maxX, point.x + node.box.width)
    maxY = Math.max(maxY, point.y + node.box.height)
  }
  return { locations, width: maxX, height: maxY }
}

function composeBuckets(
  inside: PlacedBucket,
  left: PlacedBucket | undefined,
  right: PlacedBucket | undefined,
  below: PlacedBucket | undefined,
): NodeLocations {
  const midHeight = Math.max(
    left?.height ?? 0,
    inside.height,
    right?.height ?? 0,
  )
  const insideX = left ? left.width + PERIMETER_LAYOUT_GAP : 0
  const rightX = insideX + inside.width + PERIMETER_LAYOUT_GAP
  const topWidth = right ? rightX + right.width : insideX + inside.width

  const combined: NodeLocations = {}
  if (left) {
    addOffset(combined, left.locations, 0, 0)
  }
  addOffset(combined, inside.locations, insideX, 0)
  if (right) {
    addOffset(combined, right.locations, rightX, 0)
  }
  if (below) {
    const belowX = Math.max(0, (topWidth - below.width) / 2)
    addOffset(
      combined,
      below.locations,
      belowX,
      midHeight + PERIMETER_LAYOUT_GAP,
    )
  }
  return combined
}

function addOffset(
  target: NodeLocations,
  source: NodeLocations,
  dx: number,
  dy: number,
): void {
  for (const [id, point] of Object.entries(source)) {
    target[id] = { x: point.x + dx, y: point.y + dy }
  }
}

function getAnchorPoint(
  nodes: readonly Node[],
  freshLayout: boolean,
): Pick<Box, 'x' | 'y'> {
  if (freshLayout) {
    return { x: 0, y: 0 }
  }
  let x = Number.POSITIVE_INFINITY
  let y = Number.POSITIVE_INFINITY
  for (const node of nodes) {
    x = Math.min(x, node.box.x)
    y = Math.min(y, node.box.y)
  }
  return { x, y }
}
