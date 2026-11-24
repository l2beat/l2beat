import { assert } from '@l2beat/shared-pure'
import type { Box, Node, State } from '../State'
import { MIN_ZOOM } from './constants'

export const PERIMETER_PADDING = 28
export const PERIMETER_BORDER_WIDTH = 2
const PERIMETER_STROKE_HALF = PERIMETER_BORDER_WIDTH / 2
const PERIMETER_VIEWPORT_MARGIN = 48
const FALLBACK_VIEWPORT_WIDTH = 1000
const FALLBACK_VIEWPORT_HEIGHT = 800

export type NodeCriticality = 'all' | 'some' | 'none'

export interface PerimeterZone {
  readonly box: Box
  readonly count: number
  readonly nodeIds: readonly string[]
}

interface ZoneCluster {
  readonly rawBox: Box
  readonly count: number
  readonly nodeIds: readonly string[]
}

let cachedNodes: readonly Node[] | undefined
let cachedHidden: ReadonlySet<string> | undefined
let cachedZones: PerimeterZone[] | undefined

export function getNodeCriticality(
  node: Node,
  hidden: ReadonlySet<string>,
): NodeCriticality {
  if (node.subnodes.length === 0) {
    return !hidden.has(node.id) && node.isCritical ? 'all' : 'none'
  }
  const { visible, critical } = countLeaves(node, hidden)
  if (critical === 0) return 'none'
  if (critical === visible) return 'all'
  return 'some'
}

export function countCriticalLeaves(
  nodes: readonly Node[],
  hidden: ReadonlySet<string>,
): number {
  let total = 0
  for (const node of nodes) {
    total += countLeaves(node, hidden).critical
  }
  return total
}

function countLeaves(
  root: Node,
  hidden: ReadonlySet<string>,
): { visible: number; critical: number } {
  let visible = 0
  let critical = 0
  const stack: Node[] = [root]
  while (stack.length > 0) {
    const current = stack.pop()
    assert(current !== undefined, 'stack item exists')
    if (current.subnodes.length === 0) {
      if (hidden.has(current.id)) continue
      visible++
      if (current.isCritical) critical++
      continue
    }
    for (const subnode of current.subnodes) {
      stack.push(subnode)
    }
  }
  return { visible, critical }
}

// Partitions visible critical nodes into the fewest rectangular perimeter
// zones whose stroked boundaries never intersect any non-critical node.
export function computeSecurityPerimeter(
  nodes: readonly Node[],
  hidden: ReadonlySet<string>,
): PerimeterZone[] {
  if (
    nodes === cachedNodes &&
    hidden === cachedHidden &&
    cachedZones !== undefined
  ) {
    return cachedZones
  }
  const zones = computeSecurityPerimeterUncached(nodes, hidden)
  cachedNodes = nodes
  cachedHidden = hidden
  cachedZones = zones
  return zones
}

function computeSecurityPerimeterUncached(
  nodes: readonly Node[],
  hidden: ReadonlySet<string>,
): PerimeterZone[] {
  const criticalNodes: Node[] = []
  const obstacles: Box[] = []
  for (const node of nodes) {
    if (hidden.has(node.id)) continue
    if (getNodeCriticality(node, hidden) === 'all') {
      criticalNodes.push(node)
    } else {
      obstacles.push(node.box)
    }
  }
  if (criticalNodes.length === 0) return []

  const allRaw = unionBoxes(criticalNodes.map((node) => node.box))
  const fullPadded = expandUniform(allRaw, PERIMETER_PADDING)
  if (
    !intersectsAny(expandUniform(fullPadded, PERIMETER_STROKE_HALF), obstacles)
  ) {
    return [
      {
        box: fullPadded,
        count: countCriticalLeaves(criticalNodes, hidden),
        nodeIds: criticalNodes.map((node) => node.id),
      },
    ]
  }

  const clusters: ZoneCluster[] = criticalNodes.map((node) => ({
    rawBox: node.box,
    count: countLeaves(node, hidden).critical,
    nodeIds: [node.id],
  }))

  mergeClusters(clusters, obstacles)

  const zones: PerimeterZone[] = []
  for (const cluster of clusters) {
    const box = padZoneBox(cluster.rawBox, obstacles)
    // Suppress any enclosure whose outer stroke would still intersect a
    // non-critical node (e.g. an overlapping node); the node badge remains.
    if (intersectsAny(expandUniform(box, PERIMETER_STROKE_HALF), obstacles)) {
      continue
    }
    zones.push({
      box,
      count: cluster.count,
      nodeIds: cluster.nodeIds,
    })
  }
  return zones.sort((a, b) => a.box.y - b.box.y || a.box.x - b.box.x)
}

function mergeClusters(clusters: ZoneCluster[], obstacles: readonly Box[]) {
  while (clusters.length > 1) {
    const pair = findClosestMergeablePair(clusters, obstacles)
    if (pair === undefined) break
    const [i, j] = pair
    const first = clusters[i]
    const second = clusters[j]
    assert(first !== undefined && second !== undefined, 'valid pair')
    clusters[i] = {
      rawBox: unionBox(first.rawBox, second.rawBox),
      count: first.count + second.count,
      nodeIds: [...first.nodeIds, ...second.nodeIds],
    }
    clusters.splice(j, 1)
  }
}

function findClosestMergeablePair(
  clusters: readonly ZoneCluster[],
  obstacles: readonly Box[],
): [number, number] | undefined {
  let bestPair: [number, number] | undefined
  let bestDistance = Number.POSITIVE_INFINITY
  for (let i = 0; i < clusters.length; i++) {
    const a = clusters[i] as ZoneCluster
    for (let j = i + 1; j < clusters.length; j++) {
      const b = clusters[j] as ZoneCluster
      const distance = boxDistance(a.rawBox, b.rawBox)
      if (distance >= bestDistance) continue
      const merged = expandUniform(
        unionBox(a.rawBox, b.rawBox),
        PERIMETER_STROKE_HALF,
      )
      if (intersectsAny(merged, obstacles)) continue
      bestDistance = distance
      bestPair = [i, j]
    }
  }
  return bestPair
}

function padZoneBox(rawBox: Box, obstacles: readonly Box[]): Box {
  const rawRight = rawBox.x + rawBox.width
  const rawBottom = rawBox.y + rawBox.height
  let padLeft = PERIMETER_PADDING
  let padRight = PERIMETER_PADDING
  let padTop = PERIMETER_PADDING
  let padBottom = PERIMETER_PADDING

  for (const obstacle of obstacles) {
    const obsRight = obstacle.x + obstacle.width
    const obsBottom = obstacle.y + obstacle.height
    const overlapsY = obstacle.y < rawBottom && obsBottom > rawBox.y
    const overlapsX = obstacle.x < rawRight && obsRight > rawBox.x

    if (overlapsY && obsRight <= rawBox.x) {
      padLeft = Math.min(padLeft, clearanceFor(rawBox.x - obsRight))
    } else if (overlapsY && obstacle.x >= rawRight) {
      padRight = Math.min(padRight, clearanceFor(obstacle.x - rawRight))
    }

    if (overlapsX && obsBottom <= rawBox.y) {
      padTop = Math.min(padTop, clearanceFor(rawBox.y - obsBottom))
    } else if (overlapsX && obstacle.y >= rawBottom) {
      padBottom = Math.min(padBottom, clearanceFor(obstacle.y - rawBottom))
    }
  }

  return trimCornerOverlaps(
    rawBox,
    { left: padLeft, right: padRight, top: padTop, bottom: padBottom },
    obstacles,
  )
}

interface Padding {
  left: number
  right: number
  top: number
  bottom: number
}

function trimCornerOverlaps(
  rawBox: Box,
  pad: Padding,
  obstacles: readonly Box[],
): Box {
  const rawRight = rawBox.x + rawBox.width
  const rawBottom = rawBox.y + rawBox.height

  for (const obstacle of obstacles) {
    const stroked = expandUniform(
      applyPadding(rawBox, pad),
      PERIMETER_STROKE_HALF,
    )
    if (!boxesIntersect(stroked, obstacle)) continue
    if (boxesIntersect(rawBox, obstacle)) continue

    const obsRight = obstacle.x + obstacle.width
    const obsBottom = obstacle.y + obstacle.height
    const gapX =
      obsRight <= rawBox.x
        ? rawBox.x - obsRight
        : obstacle.x >= rawRight
          ? obstacle.x - rawRight
          : Number.POSITIVE_INFINITY
    const gapY =
      obsBottom <= rawBox.y
        ? rawBox.y - obsBottom
        : obstacle.y >= rawBottom
          ? obstacle.y - rawBottom
          : Number.POSITIVE_INFINITY

    if (gapX <= gapY) {
      const limit = clearanceFor(gapX)
      if (obsRight <= rawBox.x) pad.left = Math.min(pad.left, limit)
      else if (obstacle.x >= rawRight) pad.right = Math.min(pad.right, limit)
    } else {
      const limit = clearanceFor(gapY)
      if (obsBottom <= rawBox.y) pad.top = Math.min(pad.top, limit)
      else if (obstacle.y >= rawBottom) pad.bottom = Math.min(pad.bottom, limit)
    }
  }

  return applyPadding(rawBox, pad)
}

function clearanceFor(gap: number): number {
  return Math.max(0, gap / 2 - PERIMETER_STROKE_HALF)
}

function applyPadding(box: Box, pad: Padding): Box {
  return {
    x: box.x - pad.left,
    y: box.y - pad.top,
    width: box.width + pad.left + pad.right,
    height: box.height + pad.top + pad.bottom,
  }
}

function expandUniform(box: Box, padding: number): Box {
  return {
    x: box.x - padding,
    y: box.y - padding,
    width: box.width + padding * 2,
    height: box.height + padding * 2,
  }
}

function unionBox(a: Box, b: Box): Box {
  const x = Math.min(a.x, b.x)
  const y = Math.min(a.y, b.y)
  return {
    x,
    y,
    width: Math.max(a.x + a.width, b.x + b.width) - x,
    height: Math.max(a.y + a.height, b.y + b.height) - y,
  }
}

function unionBoxes(boxes: readonly Box[]): Box {
  assert(boxes.length > 0, 'cannot union empty box list')
  let result = boxes[0] as Box
  for (let i = 1; i < boxes.length; i++) {
    result = unionBox(result, boxes[i] as Box)
  }
  return result
}

function boxesIntersect(a: Box, b: Box): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

function intersectsAny(box: Box, obstacles: readonly Box[]): boolean {
  for (const obstacle of obstacles) {
    if (boxesIntersect(box, obstacle)) return true
  }
  return false
}

function boxDistance(a: Box, b: Box): number {
  const dx = Math.max(0, b.x - (a.x + a.width), a.x - (b.x + b.width))
  const dy = Math.max(0, b.y - (a.y + a.height), a.y - (b.y + b.height))
  return Math.hypot(dx, dy)
}

export function getPerimeterFocusBoxes(
  nodes: readonly Node[],
  hidden: ReadonlySet<string>,
  zones: readonly PerimeterZone[] = computeSecurityPerimeter(nodes, hidden),
): Box[] {
  const enclosedIds = new Set(zones.flatMap((zone) => zone.nodeIds))
  const boxes: Box[] = zones.map((zone) => zone.box)
  for (const node of nodes) {
    if (hidden.has(node.id) || enclosedIds.has(node.id)) continue
    if (getNodeCriticality(node, hidden) !== 'none') {
      boxes.push(node.box)
    }
  }
  return boxes
}

export function isPerimeterVisibleInViewport(
  boxes: readonly Box[],
  transform: State['transform'],
  viewportContainer: HTMLElement | undefined,
): boolean {
  const rect = viewportContainer?.getBoundingClientRect()
  const width =
    rect !== undefined && rect.width > 0 ? rect.width : FALLBACK_VIEWPORT_WIDTH
  const height =
    rect !== undefined && rect.height > 0
      ? rect.height
      : FALLBACK_VIEWPORT_HEIGHT
  for (const box of boxes) {
    const left = box.x * transform.scale + transform.offsetX
    const top = box.y * transform.scale + transform.offsetY
    const right = left + box.width * transform.scale
    const bottom = top + box.height * transform.scale
    if (right > 0 && left < width && bottom > 0 && top < height) {
      return true
    }
  }
  return false
}

export function focusSecurityPerimeter(
  boxes: readonly Box[],
  currentTransform: State['transform'],
  viewportContainer: HTMLElement | undefined,
): State['transform'] {
  if (boxes.length === 0) {
    return currentTransform
  }
  const target = unionBoxes(boxes)
  const rect = viewportContainer?.getBoundingClientRect()
  if (rect === undefined || rect.width <= 0 || rect.height <= 0) {
    return {
      scale: 1,
      offsetX: PERIMETER_VIEWPORT_MARGIN - target.x,
      offsetY: PERIMETER_VIEWPORT_MARGIN - target.y,
    }
  }
  const usableWidth = Math.max(1, rect.width - PERIMETER_VIEWPORT_MARGIN * 2)
  const usableHeight = Math.max(1, rect.height - PERIMETER_VIEWPORT_MARGIN * 2)
  const fitScale = Math.min(
    1,
    usableWidth / target.width,
    usableHeight / target.height,
  )
  const scale = Math.max(MIN_ZOOM, fitScale)
  const fitsWidth = target.width * scale <= usableWidth
  const fitsHeight = target.height * scale <= usableHeight
  return {
    scale,
    offsetX: fitsWidth
      ? (rect.width - target.width * scale) / 2 - target.x * scale
      : PERIMETER_VIEWPORT_MARGIN - target.x * scale,
    offsetY: fitsHeight
      ? (rect.height - target.height * scale) / 2 - target.y * scale
      : PERIMETER_VIEWPORT_MARGIN - target.y * scale,
  }
}
