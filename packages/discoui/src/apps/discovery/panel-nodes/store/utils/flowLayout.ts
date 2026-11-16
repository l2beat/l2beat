import { assert } from '@l2beat/shared-pure'
import type { Node } from '../State'
import { FIELD_HEIGHT, HEADER_HEIGHT } from './constants'
import type { GraphEdge } from './graphProjection'
import { getRowLayout } from './rows'
import type { NodeLocations } from './storage'

const LAYER_GAP = 160
const NODE_GAP = 20
const LANE_GAP = 12
const LANE_STEP = 4
const LANE_MARGIN = 6
const LANE_HEIGHT_MAX = 60
const LANE_PASSES = 3
const BAND_GAP = 160
const COMPONENT_GAP = 100
const BACKWARD_TOLL = 1
const CROSS_CHAIN_WEIGHT = 2
const WEIGHT_REAL = 1
const WEIGHT_MIXED = 2
const WEIGHT_LANE = 8
const LAYERING_ROUNDS = 8
const ORDERING_SWEEPS = 8
const TRANSPOSE_ROUNDS = 8
const PLACEMENT_ROUNDS = 400
const PLACEMENT_TOLERANCE = 0.25
const LANE_PASS_TOLERANCE = 2

interface Vertex {
  readonly id: string
  readonly width: number
  readonly height: number
  readonly chain: string
}

interface Edge {
  readonly source: number
  readonly target: number
  readonly lines: [number, number][]
  readonly crossChain: boolean
}

interface Segment {
  readonly upper: number
  readonly lower: number
  upperOffset: number
  lowerOffset: number
  readonly weight: number
  readonly crossBand: boolean
}

interface Route {
  readonly upper: number
  readonly lower: number
  readonly lanes: number[]
  readonly lines: [number, number][]
}

interface Layered {
  readonly layers: number[][]
  readonly layerOf: number[]
  readonly band: number[]
  readonly height: number[]
  readonly width: number[]
  readonly isLane: boolean[]
  readonly up: Segment[][]
  readonly down: Segment[][]
  readonly routes: Route[]
}

interface Placed {
  readonly vertices: readonly number[]
  readonly x: readonly number[]
  readonly y: readonly number[]
  readonly width: number
  readonly height: number
}

export function flowLayout(
  baseNodes: readonly Node[],
  freshLayout: boolean,
  visibleEdges: readonly GraphEdge[],
): NodeLocations {
  if (baseNodes.length === 0) {
    return {}
  }
  const { vertices, edges } = toGraph(baseNodes, visibleEdges)
  const placed = splitComponents(vertices.length, edges).map((component) =>
    layoutComponent(vertices, edges, component),
  )
  const offsets = packComponents(placed)
  const { left, top } = getAnchorPoints(baseNodes, freshLayout)

  const locations: NodeLocations = {}
  for (const [i, component] of placed.entries()) {
    const offset = offsets[i]
    assert(offset !== undefined, 'every component has an offset')
    for (const [j, vertex] of component.vertices.entries()) {
      locations[(vertices[vertex] as Vertex).id] = {
        x: left + offset.x + (component.x[j] as number),
        y: top + offset.y + (component.y[j] as number),
      }
    }
  }
  assert(Object.keys(locations).length === vertices.length, 'all placed')
  return locations
}

function toGraph(
  baseNodes: readonly Node[],
  visibleEdges: readonly GraphEdge[],
): { vertices: Vertex[]; edges: Edge[] } {
  const vertices = baseNodes.map(
    (node): Vertex => ({
      id: node.id,
      width: node.box.width,
      height: node.box.height,
      chain: nodeChain(node),
    }),
  )
  const anchors = anchorsByLeaf(baseNodes)
  const byPair = new Map<string, Edge>()
  for (const graphEdge of visibleEdges) {
    const source = anchors.get(graphEdge.source)
    const target = anchors.get(graphEdge.target)
    if (source === undefined || target === undefined) continue
    if (source.vertex === target.vertex) continue

    const key = `${source.vertex}:${target.vertex}`
    const edge = byPair.get(key) ?? {
      source: source.vertex,
      target: target.vertex,
      lines: [],
      crossChain:
        (vertices[source.vertex] as Vertex).chain !==
        (vertices[target.vertex] as Vertex).chain,
    }
    edge.lines.push([
      source.offset +
        portOffset(source.portNode, graphEdge.fieldName, graphEdge.target),
      target.offset + HEADER_HEIGHT / 2,
    ])
    byPair.set(key, edge)
  }
  return { vertices, edges: [...byPair.values()] }
}

interface LeafAnchor {
  readonly vertex: number
  readonly offset: number
  readonly portNode: Node
}

function anchorsByLeaf(baseNodes: readonly Node[]): Map<string, LeafAnchor> {
  const anchors = new Map<string, LeafAnchor>()
  for (const [vertex, top] of baseNodes.entries()) {
    const stack = [{ node: top, visible: top }]
    for (let item = stack.pop(); item !== undefined; item = stack.pop()) {
      const { node, visible } = item
      const offset = visible === top ? 0 : visible.box.y - top.box.y
      anchors.set(node.id, { vertex, offset, portNode: visible })
      const showsMembers = node === visible && node.opened
      for (const subnode of node.subnodes) {
        stack.push({ node: subnode, visible: showsMembers ? subnode : visible })
      }
    }
  }
  return anchors
}

function portOffset(node: Node, fieldName: string, target: string): number {
  const index =
    node.subnodes.length === 0
      ? node.fields.findIndex((field) => field.name === fieldName)
      : node.fields.findIndex((field) => field.target === target)
  if (index === -1) {
    return HEADER_HEIGHT / 2
  }
  const anchor = getRowLayout(node).anchorByField[index] as number
  return HEADER_HEIGHT + FIELD_HEIGHT * (anchor + 0.5)
}

function nodeChain(node: Node): string {
  let leaf = node
  for (let first = leaf.subnodes[0]; first; first = leaf.subnodes[0]) {
    leaf = first
  }
  const [prefix] = leaf.id.split(':', 1)
  assert(prefix !== undefined, 'node ids are chain specific')
  return prefix
}

function mean(values: readonly number[]): number {
  assert(values.length > 0, 'mean of nothing')
  let sum = 0
  for (const value of values) sum += value
  return sum / values.length
}

function splitComponents(count: number, edges: readonly Edge[]): number[][] {
  const parent = Array.from({ length: count }, (_, i) => i)
  const find = (vertex: number) => {
    let root = vertex
    while (parent[root] !== root) root = parent[root] as number
    for (let i = vertex; parent[i] !== root; ) {
      const next = parent[i] as number
      parent[i] = root
      i = next
    }
    return root
  }
  for (const edge of edges) {
    const a = find(edge.source)
    const b = find(edge.target)
    if (a !== b) parent[Math.max(a, b)] = Math.min(a, b)
  }
  const byRoot = new Map<number, number[]>()
  for (let vertex = 0; vertex < count; vertex++) {
    const root = find(vertex)
    const members = byRoot.get(root) ?? []
    members.push(vertex)
    byRoot.set(root, members)
  }
  return [...byRoot.values()]
}

function layoutComponent(
  vertices: readonly Vertex[],
  allEdges: readonly Edge[],
  component: readonly number[],
): Placed {
  const local = new Map(component.map((vertex, i) => [vertex, i]))
  const edges: Edge[] = []
  for (const edge of allEdges) {
    const source = local.get(edge.source)
    const target = local.get(edge.target)
    if (source === undefined || target === undefined) continue
    edges.push({ ...edge, source, target })
  }
  const members = component.map((vertex) => vertices[vertex] as Vertex)
  const layerOf = assignLayers(members.length, edges)
  const layered = buildLayered(members, edges, layerOf)
  orderLayers(layered)
  const { x, widths } = assignX(layered)
  const y = placeBands(layered, x, widths, members.length)

  let minY = Number.POSITIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY
  let maxX = 0
  for (const [v, vertex] of members.entries()) {
    minY = Math.min(minY, y[v] as number)
    maxY = Math.max(maxY, (y[v] as number) + vertex.height)
    maxX = Math.max(maxX, (x[v] as number) + vertex.width)
  }
  return {
    vertices: component,
    x: x.slice(0, members.length),
    y: y.slice(0, members.length).map((value) => value - minY),
    width: maxX,
    height: maxY - minY,
  }
}

function assignLayers(count: number, edges: readonly Edge[]): number[] {
  const order = feedbackOrder(count, edges)
  const predecessors: number[][] = Array.from({ length: count }, () => [])
  const successors: number[][] = Array.from({ length: count }, () => [])
  for (const edge of edges) {
    const forward =
      (order[edge.source] as number) < (order[edge.target] as number)
    const from = forward ? edge.source : edge.target
    const to = forward ? edge.target : edge.source
    ;(successors[from] as number[]).push(to)
    ;(predecessors[to] as number[]).push(from)
  }
  const layerOf = longestPath(predecessors, successors)
  refineLayers(layerOf, edges)
  const used = [...new Set(layerOf)].sort((a, b) => a - b)
  const compact = new Map(used.map((layer, i) => [layer, i]))
  return layerOf.map((layer) => compact.get(layer) as number)
}

// Eades, Lin and Smyth: few edges point backwards in the returned order.
function feedbackOrder(count: number, edges: readonly Edge[]): number[] {
  const outgoing: number[][] = Array.from({ length: count }, () => [])
  const incoming: number[][] = Array.from({ length: count }, () => [])
  for (const edge of edges) {
    ;(outgoing[edge.source] as number[]).push(edge.target)
    ;(incoming[edge.target] as number[]).push(edge.source)
  }
  const outDegree = outgoing.map((list) => list.length)
  const inDegree = incoming.map((list) => list.length)
  const removed = new Array<boolean>(count).fill(false)
  const order = new Array<number>(count).fill(0)
  const sinks: number[] = []
  const sources: number[] = []
  for (let v = 0; v < count; v++) {
    if (outDegree[v] === 0) sinks.push(v)
    else if (inDegree[v] === 0) sources.push(v)
  }
  let front = 0
  let back = count - 1
  const remove = (v: number, atFront: boolean) => {
    removed[v] = true
    order[v] = atFront ? front++ : back--
    for (const w of outgoing[v] as number[]) {
      inDegree[w] = (inDegree[w] as number) - 1
      if (inDegree[w] === 0) sources.push(w)
    }
    for (const w of incoming[v] as number[]) {
      outDegree[w] = (outDegree[w] as number) - 1
      if (outDegree[w] === 0) sinks.push(w)
    }
  }
  while (front <= back) {
    const sink = sinks.pop()
    if (sink !== undefined) {
      if (!removed[sink]) remove(sink, false)
      continue
    }
    const source = sources.pop()
    if (source !== undefined) {
      if (!removed[source]) remove(source, true)
      continue
    }
    remove(mostOutgoing(removed, outDegree, inDegree), true)
  }
  return order
}

function mostOutgoing(
  removed: readonly boolean[],
  outDegree: readonly number[],
  inDegree: readonly number[],
): number {
  let best = -1
  let bestSurplus = Number.NEGATIVE_INFINITY
  for (const [v, isRemoved] of removed.entries()) {
    if (isRemoved) continue
    const surplus = (outDegree[v] as number) - (inDegree[v] as number)
    if (surplus > bestSurplus) {
      best = v
      bestSurplus = surplus
    }
  }
  assert(best !== -1, 'a vertex remains')
  return best
}

function longestPath(predecessors: number[][], successors: number[][]) {
  const count = predecessors.length
  const layerOf = new Array<number>(count).fill(0)
  const remaining = predecessors.map((list) => list.length)
  const queue: number[] = []
  for (let v = 0; v < count; v++) if (remaining[v] === 0) queue.push(v)
  for (const v of queue) {
    for (const w of successors[v] as number[]) {
      layerOf[w] = Math.max(layerOf[w] as number, (layerOf[v] as number) + 1)
      remaining[w] = (remaining[w] as number) - 1
      if (remaining[w] === 0) queue.push(w)
    }
  }
  assert(queue.length === count, 'the feedback order leaves no cycle')
  return layerOf
}

interface Neighbour {
  readonly vertex: number
  readonly weight: number
  readonly outgoing: boolean
}

// Edges attach to the nearer side of a node, so a proxy admin can sit among
// its proxies instead of behind all of them.
function refineLayers(layerOf: number[], edges: readonly Edge[]) {
  const neighbours: Neighbour[][] = layerOf.map(() => [])
  for (const edge of edges) {
    const weight =
      edge.lines.length * (edge.crossChain ? CROSS_CHAIN_WEIGHT : 1)
    const { source, target } = edge
    ;(neighbours[source] as Neighbour[]).push({
      vertex: target,
      weight,
      outgoing: true,
    })
    ;(neighbours[target] as Neighbour[]).push({
      vertex: source,
      weight,
      outgoing: false,
    })
  }
  for (let round = 0; round < LAYERING_ROUNDS; round++) {
    let changed = false
    for (const [v, list] of neighbours.entries()) {
      if (list.length === 0) continue
      const taken = new Set(list.map((n) => layerOf[n.vertex] as number))
      let best = layerOf[v] as number
      let bestCost = layerCost(best, list, layerOf)
      const highest = Math.max(...taken) + 1
      for (let layer = Math.min(...taken) - 1; layer <= highest; layer++) {
        const cost = layerCost(layer, list, layerOf)
        if (cost < bestCost) {
          best = layer
          bestCost = cost
        }
      }
      if (best !== layerOf[v]) {
        layerOf[v] = best
        changed = true
      }
    }
    if (!changed) return
  }
}

function layerCost(
  layer: number,
  list: readonly Neighbour[],
  layerOf: readonly number[],
): number {
  let cost = 0
  for (const neighbour of list) {
    const other = layerOf[neighbour.vertex] as number
    if (other === layer) return Number.POSITIVE_INFINITY
    const backward = neighbour.outgoing ? layer > other : layer < other
    cost +=
      neighbour.weight *
      (Math.abs(layer - other) + (backward ? BACKWARD_TOLL : 0))
  }
  return cost
}

function buildLayered(
  members: readonly Vertex[],
  edges: readonly Edge[],
  layerOf: readonly number[],
): Layered {
  const bandOfChain = new Map<string, number>()
  for (const vertex of members) {
    if (!bandOfChain.has(vertex.chain))
      bandOfChain.set(vertex.chain, bandOfChain.size)
  }
  const layered: Layered = {
    layers: [],
    layerOf: [...layerOf],
    band: members.map((vertex) => bandOfChain.get(vertex.chain) as number),
    height: members.map((vertex) => vertex.height),
    width: members.map((vertex) => vertex.width),
    isLane: members.map(() => false),
    up: members.map(() => []),
    down: members.map(() => []),
    routes: [],
  }
  for (const route of toRoutes(edges, layerOf)) {
    if (layered.band[route.upper] === layered.band[route.lower]) {
      addRoute(layered, route)
    } else {
      addBandBridge(layered, route)
    }
  }
  for (const [vertex, layer] of layered.layerOf.entries()) {
    while (layered.layers.length <= layer) layered.layers.push([])
    ;(layered.layers[layer] as number[]).push(vertex)
  }
  assert(
    layered.layers.every((layer) => layer.length > 0),
    'compacted layers are never empty',
  )
  return layered
}

function toRoutes(edges: readonly Edge[], layerOf: readonly number[]): Route[] {
  return edges.map((edge) => {
    const isBackward =
      (layerOf[edge.source] as number) > (layerOf[edge.target] as number)
    const upper = isBackward ? edge.target : edge.source
    const lower = isBackward ? edge.source : edge.target
    assert(layerOf[upper] !== layerOf[lower], 'neighbours never share a layer')
    const lines = edge.lines.map(
      ([sourceOffset, targetOffset]): [number, number] =>
        isBackward
          ? [targetOffset, sourceOffset]
          : [sourceOffset, targetOffset],
    )
    return { upper, lower, lanes: [], lines }
  })
}

function addRoute(layered: Layered, route: Route) {
  const lowerLayer = layered.layerOf[route.lower] as number
  assert(
    lowerLayer > (layered.layerOf[route.upper] as number),
    'routes go right',
  )
  const band = layered.band[route.upper] as number
  let upper = route.upper
  let upperOffset = mean(route.lines.map((line) => line[0]))
  for (let layer = (layered.layerOf[upper] as number) + 1; ; layer++) {
    const isLast = layer === lowerLayer
    const lower = isLast ? route.lower : addLane(layered, layer, band)
    const lowerOffset = isLast ? mean(route.lines.map((line) => line[1])) : 0
    const lanes = Number(layered.isLane[upper]) + Number(!isLast)
    const kind = [WEIGHT_REAL, WEIGHT_MIXED, WEIGHT_LANE][lanes] as number
    const segment: Segment = {
      upper,
      lower,
      upperOffset,
      lowerOffset,
      weight: route.lines.length * kind,
      crossBand: false,
    }
    ;(layered.down[upper] as Segment[]).push(segment)
    ;(layered.up[lower] as Segment[]).push(segment)
    if (isLast) break
    route.lanes.push(lower)
    upper = lower
    upperOffset = 0
  }
  if (route.lanes.length > 0) layered.routes.push(route)
}

function addLane(layered: Layered, layer: number, band: number): number {
  const vertex = layered.layerOf.length
  layered.layerOf.push(layer)
  layered.band.push(band)
  layered.height.push(0)
  layered.width.push(0)
  layered.isLane.push(true)
  layered.up.push([])
  layered.down.push([])
  return vertex
}

// Steers ordering only: chains share columns but never mix their bands.
function addBandBridge(layered: Layered, route: Route) {
  const span =
    (layered.layerOf[route.lower] as number) -
    (layered.layerOf[route.upper] as number)
  if (span !== 1) return
  const segment: Segment = {
    upper: route.upper,
    lower: route.lower,
    upperOffset: mean(route.lines.map((line) => line[0])),
    lowerOffset: mean(route.lines.map((line) => line[1])),
    weight: route.lines.length,
    crossBand: true,
  }
  ;(layered.down[route.upper] as Segment[]).push(segment)
  ;(layered.up[route.lower] as Segment[]).push(segment)
}

function orderLayers(layered: Layered) {
  const position = layered.layerOf.map(() => 0)
  for (const layer of layered.layers) {
    layer.sort(
      (a, b) =>
        (layered.band[a] as number) - (layered.band[b] as number) || a - b,
    )
    for (const [i, vertex] of layer.entries()) position[vertex] = i
  }
  let best = layered.layers.map((layer) => [...layer])
  let bestCrossings = countCrossings(layered, position)
  for (let sweep = 0; sweep < ORDERING_SWEEPS && bestCrossings > 0; sweep++) {
    const fromAbove = sweep % 2 === 0
    const count = layered.layers.length
    for (let step = 1; step < count; step++) {
      const index = fromAbove ? step : count - 1 - step
      reorderLayer(layered, index, fromAbove, position)
    }
    transpose(layered, position)
    const crossings = countCrossings(layered, position)
    if (crossings < bestCrossings) {
      bestCrossings = crossings
      best = layered.layers.map((layer) => [...layer])
    }
  }
  for (const [i, layer] of best.entries()) {
    layered.layers[i] = layer
  }
}

function farKey(
  layered: Layered,
  segment: Segment,
  upwards: boolean,
  position: readonly number[],
): number {
  const far = upwards ? segment.upper : segment.lower
  const offset = upwards ? segment.upperOffset : segment.lowerOffset
  return (position[far] as number) + portFraction(layered, far, offset)
}

function portFraction(layered: Layered, vertex: number, offset: number) {
  const height = layered.height[vertex] as number
  if (height === 0) return 0.5
  return Math.min(Math.max(offset / height, 0), 0.99)
}

function reorderLayer(
  layered: Layered,
  index: number,
  fromAbove: boolean,
  position: number[],
) {
  const layer = layered.layers[index] as number[]
  const sides = fromAbove ? layered.up : layered.down
  const key = new Float64Array(layered.layerOf.length)
  for (const vertex of layer) {
    let sum = 0
    let weight = 0
    for (const segment of sides[vertex] as Segment[]) {
      sum += segment.weight * farKey(layered, segment, fromAbove, position)
      weight += segment.weight
    }
    key[vertex] = weight === 0 ? (position[vertex] as number) : sum / weight
  }
  layer.sort(
    (a, b) =>
      (layered.band[a] as number) - (layered.band[b] as number) ||
      (key[a] as number) - (key[b] as number) ||
      (position[a] as number) - (position[b] as number),
  )
  for (const [i, vertex] of layer.entries()) position[vertex] = i
}

function transpose(layered: Layered, position: number[]) {
  for (let round = 0; round < TRANSPOSE_ROUNDS; round++) {
    let improved = false
    for (const layer of layered.layers) {
      for (let i = 0; i + 1 < layer.length; i++) {
        const above = layer[i] as number
        const below = layer[i + 1] as number
        if (layered.band[above] !== layered.band[below]) continue
        const gain =
          swapGain(layered, above, below, true, position) +
          swapGain(layered, above, below, false, position)
        if (gain <= 0) continue
        layer[i] = below
        layer[i + 1] = above
        position[below] = i
        position[above] = i + 1
        improved = true
      }
    }
    if (!improved) return
  }
}

function swapGain(
  layered: Layered,
  above: number,
  below: number,
  upwards: boolean,
  position: readonly number[],
): number {
  const sides = upwards ? layered.up : layered.down
  let gain = 0
  for (const a of sides[above] as Segment[]) {
    const aboveKey = farKey(layered, a, upwards, position)
    for (const b of sides[below] as Segment[]) {
      const belowKey = farKey(layered, b, upwards, position)
      if (belowKey < aboveKey) gain++
      else if (aboveKey < belowKey) gain--
    }
  }
  return gain
}

function countCrossings(layered: Layered, position: readonly number[]) {
  let total = 0
  for (const layer of layered.layers) {
    const keys: [number, number][] = []
    for (const vertex of layer) {
      for (const segment of layered.down[vertex] as Segment[]) {
        keys.push([
          (position[vertex] as number) +
            portFraction(layered, vertex, segment.upperOffset),
          farKey(layered, segment, false, position),
        ])
      }
    }
    keys.sort((a, b) => a[0] - b[0] || a[1] - b[1])
    total += countInversions(keys.map((key) => key[1]))
  }
  return total
}

function countInversions(values: readonly number[]): number {
  const sorted = [...values]
  let inversions = 0
  for (let i = 1; i < sorted.length; i++) {
    const value = sorted[i] as number
    let j = i
    for (; j > 0 && (sorted[j - 1] as number) > value; j--) {
      sorted[j] = sorted[j - 1] as number
    }
    sorted[j] = value
    inversions += i - j
  }
  return inversions
}

function assignX(layered: Layered): { x: number[]; widths: number[] } {
  const widths = layered.layers.map((layer) =>
    layer.reduce((width, v) => Math.max(width, layered.width[v] as number), 0),
  )
  const layerX: number[] = []
  let cursor = 0
  for (const width of widths) {
    layerX.push(cursor)
    cursor += width + LAYER_GAP
  }
  return { x: layered.layerOf.map((layer) => layerX[layer] as number), widths }
}

function placeBands(
  layered: Layered,
  x: readonly number[],
  widths: readonly number[],
  realCount: number,
) {
  const y = new Array<number>(layered.layerOf.length).fill(0)
  const bandCount = layered.band.reduce((a, b) => Math.max(a, b), 0) + 1
  let cursor = 0
  for (let band = 0; band < bandCount; band++) {
    const view: Layered = {
      ...layered,
      layers: layered.layers.map((layer) =>
        layer.filter((v) => layered.band[v] === band),
      ),
      routes: layered.routes.filter(
        (route) => layered.band[route.upper] === band,
      ),
    }
    let bandY = assignY(view, undefined, LANE_PASS_TOLERANCE)
    for (let pass = 1; pass <= LANE_PASSES; pass++) {
      sizeLanes(view, widths, x, bandY)
      sortByCentre(view, bandY)
      const isLast = pass === LANE_PASSES
      const tolerance = isLast ? PLACEMENT_TOLERANCE : LANE_PASS_TOLERANCE
      bandY = assignY(view, bandY, tolerance)
    }

    let top = Number.POSITIVE_INFINITY
    let bottom = Number.NEGATIVE_INFINITY
    for (let v = 0; v < realCount; v++) {
      if (layered.band[v] !== band) continue
      top = Math.min(top, bandY[v] as number)
      bottom = Math.max(
        bottom,
        (bandY[v] as number) + (layered.height[v] as number),
      )
    }
    for (let v = 0; v < y.length; v++) {
      if (layered.band[v] === band) y[v] = (bandY[v] as number) - top + cursor
    }
    cursor += bottom - top + BAND_GAP
  }
  return y
}

// Block coordinate descent on a convex problem: each layer is solved exactly
// given its neighbours, so the sweeps converge on the global optimum.
function assignY(
  layered: Layered,
  start: Float64Array | undefined,
  tolerance: number,
): Float64Array {
  const offsets = layered.layers.map((layer) => stackOffsets(layered, layer))
  const y = start ?? new Float64Array(layered.layerOf.length)
  if (start === undefined) {
    for (const [index, layer] of layered.layers.entries()) {
      for (const [i, vertex] of layer.entries())
        y[vertex] = offsets[index]?.[i] as number
    }
  }
  const scratch = makeScratch(
    Math.max(0, ...layered.layers.map((l) => l.length)),
  )
  for (let round = 0; round < PLACEMENT_ROUNDS; round++) {
    let moved = 0
    for (let step = 0; step < layered.layers.length; step++) {
      const index = round % 2 === 0 ? step : layered.layers.length - 1 - step
      const layer = layered.layers[index] as number[]
      const layerOffsets = offsets[index] as number[]
      moved = Math.max(
        moved,
        placeLayer(layered, layer, layerOffsets, y, scratch),
      )
    }
    if (moved < tolerance) break
  }
  return y
}

// Lanes may overlap each other since curves may cross curves; a node after a
// run of lanes clears the lowest of them.
function stackOffsets(layered: Layered, layer: readonly number[]): number[] {
  const offsets: number[] = []
  let cursor = 0
  let runBottom = Number.NEGATIVE_INFINITY
  for (const [i, vertex] of layer.entries()) {
    offsets.push(cursor)
    const next = layer[i + 1]
    if (next === undefined) break
    const bottom = cursor + (layered.height[vertex] as number)
    const nextIsLane = layered.isLane[next] as boolean
    if (layered.isLane[vertex] && nextIsLane) {
      runBottom = Math.max(runBottom, bottom)
      cursor += LANE_STEP
    } else if (layered.isLane[vertex]) {
      cursor = Math.max(runBottom, bottom) + LANE_GAP
      runBottom = Number.NEGATIVE_INFINITY
    } else {
      cursor = bottom + (nextIsLane ? LANE_GAP : NODE_GAP)
    }
  }
  return offsets
}

function placeLayer(
  layered: Layered,
  layer: readonly number[],
  offsets: readonly number[],
  y: Float64Array,
  scratch: Scratch,
): number {
  const { targets, weights } = scratch
  for (const [i, vertex] of layer.entries()) {
    let sum = 0
    let weight = 0
    for (const segment of layered.up[vertex] as Segment[]) {
      if (segment.crossBand) continue
      const anchor = (y[segment.upper] as number) + segment.upperOffset
      sum += segment.weight * (anchor - segment.lowerOffset)
      weight += segment.weight
    }
    for (const segment of layered.down[vertex] as Segment[]) {
      if (segment.crossBand) continue
      const anchor = (y[segment.lower] as number) + segment.lowerOffset
      sum += segment.weight * (anchor - segment.upperOffset)
      weight += segment.weight
    }
    const own = y[vertex] as number
    targets[i] = (weight === 0 ? own : sum / weight) - (offsets[i] as number)
    weights[i] = weight === 0 ? 1e-6 : weight
  }
  isotonicRegression(scratch, layer.length)
  let moved = 0
  for (const [i, vertex] of layer.entries()) {
    const next = (targets[i] as number) + (offsets[i] as number)
    moved = Math.max(moved, Math.abs(next - (y[vertex] as number)))
    y[vertex] = next
  }
  return moved
}

interface Scratch {
  readonly targets: Float64Array
  readonly weights: Float64Array
  readonly means: Float64Array
  readonly totals: Float64Array
  readonly sizes: Int32Array
}

function makeScratch(size: number): Scratch {
  return {
    targets: new Float64Array(size),
    weights: new Float64Array(size),
    means: new Float64Array(size),
    totals: new Float64Array(size),
    sizes: new Int32Array(size),
  }
}

// Pool adjacent violators, in place: replaces the first `count` targets with
// the closest non-decreasing sequence in weighted least squares.
function isotonicRegression(scratch: Scratch, count: number) {
  const { targets, weights, means, totals, sizes } = scratch
  let blocks = 0
  for (let i = 0; i < count; i++) {
    let blockMean = targets[i] as number
    let total = weights[i] as number
    let size = 1
    while (blocks > 0 && (means[blocks - 1] as number) >= blockMean) {
      const previousTotal = totals[blocks - 1] as number
      const previousMean = means[blocks - 1] as number
      blockMean =
        (previousMean * previousTotal + blockMean * total) /
        (previousTotal + total)
      total += previousTotal
      size += sizes[blocks - 1] as number
      blocks--
    }
    means[blocks] = blockMean
    totals[blocks] = total
    sizes[blocks] = size
    blocks++
  }
  let k = 0
  for (let block = 0; block < blocks; block++) {
    for (let s = 0; s < (sizes[block] as number); s++) {
      targets[k++] = means[block] as number
    }
  }
  assert(k === count, 'one value per target')
}

function sizeLanes(
  layered: Layered,
  widths: readonly number[],
  x: readonly number[],
  y: Float64Array,
) {
  for (const route of layered.routes) {
    const fromX =
      (x[route.upper] as number) + (layered.width[route.upper] as number)
    const run = Math.max((x[route.lower] as number) - fromX, 1)
    for (const lane of route.lanes) {
      const left = ((x[lane] as number) - fromX) / run
      const right =
        left + (widths[layered.layerOf[lane] as number] as number) / run
      let top = Number.POSITIVE_INFINITY
      let bottom = Number.NEGATIVE_INFINITY
      for (const [upperOffset, lowerOffset] of route.lines) {
        const fromY = (y[route.upper] as number) + upperOffset
        const toY = (y[route.lower] as number) + lowerOffset
        for (const t of [left, right]) {
          top = Math.min(top, fromY + (toY - fromY) * t)
          bottom = Math.max(bottom, fromY + (toY - fromY) * t)
        }
      }
      const height = Math.min(bottom - top + 2 * LANE_MARGIN, LANE_HEIGHT_MAX)
      setLaneHeight(layered, lane, height)
      y[lane] = (top + bottom) / 2 - height / 2
    }
  }
}

function sortByCentre(layered: Layered, y: Float64Array) {
  const centre = (v: number) =>
    (y[v] as number) + (layered.height[v] as number) / 2
  for (const layer of layered.layers)
    layer.sort((a, b) => centre(a) - centre(b))
}

function setLaneHeight(layered: Layered, lane: number, height: number) {
  const before = layered.up[lane]?.[0]
  const after = layered.down[lane]?.[0]
  assert(before !== undefined, 'lanes have a segment above')
  assert(after !== undefined, 'lanes have a segment below')
  layered.height[lane] = height
  before.lowerOffset = height / 2
  after.upperOffset = height / 2
}

function packComponents(placed: readonly Placed[]): { x: number; y: number }[] {
  const order = placed
    .map((component, i) => ({ component, i }))
    .sort(
      (a, b) =>
        b.component.vertices.length - a.component.vertices.length || a.i - b.i,
    )
  const rowWidth = placed.reduce((a, c) => Math.max(a, c.width), 0)
  const offsets = new Array<{ x: number; y: number }>(placed.length)
  let x = 0
  let y = 0
  let rowHeight = 0
  for (const { component, i } of order) {
    if (x > 0 && x + component.width > rowWidth) {
      y += rowHeight + COMPONENT_GAP
      x = 0
      rowHeight = 0
    }
    offsets[i] = { x, y }
    x += component.width + COMPONENT_GAP
    rowHeight = Math.max(rowHeight, component.height)
  }
  return offsets
}

function getAnchorPoints(
  nodes: readonly Node[],
  freshLayout: boolean,
): { top: number; left: number } {
  if (freshLayout) {
    return { top: 0, left: 0 }
  }
  let top = Number.POSITIVE_INFINITY
  let left = Number.POSITIVE_INFINITY
  for (const node of nodes) {
    top = Math.min(top, node.box.y)
    left = Math.min(left, node.box.x)
  }
  return { top, left }
}
