import {
  type LayoutLink,
  type LayoutNode,
  layoutRelationGraph,
} from './relationGraphLayout'
import {
  mostCommonDeployedSymbol,
  nodeLabel,
  type RelationGraph,
  type RelationGraphNode,
  type RelationGraphRelation,
  relationId,
  sourceId,
  targetId,
  unorderedPairKey,
} from './relationGraphModel'

/**
 * The scene is the drawable form of the relations graph: every node placed by
 * the force layout, every relation resolved to its endpoints and curve shape.
 * It is built once per graph payload and then only read — except node
 * positions, which dragging mutates in place. Links hold references to the
 * shared node objects, so moving a node moves its links.
 *
 * Deleted relations are deliberately not the scene's concern: deleting must
 * not re-run the layout, so the renderer and the hit tests skip deleted links
 * at read time instead.
 */
export interface RelationGraphScene {
  nodes: SceneNode[]
  links: SceneLink[]
  clusterLabels: SceneClusterLabel[]
  nodeById: Map<string, SceneNode>
  /** Layout bounds, used to fit the initial camera. */
  width: number
  height: number
}

export interface SceneNode {
  /** The graph payload behind this node; geometry lives beside it, not in it. */
  readonly data: RelationGraphNode
  /** Displayed name, precomputed because it is drawn every frame. */
  readonly label: string
  x: number
  y: number
}

export interface SceneLink {
  readonly relation: RelationGraphRelation
  /** Precomputed relationId — compared against sets every frame. */
  readonly id: string
  readonly source: SceneNode
  readonly target: SceneNode
  /**
   * Sideways offset of the curve's control point in world units, so parallel
   * relations between the same two tokens stay distinguishable. Zero means a
   * straight line.
   */
  readonly curve: number
}

export interface SceneClusterLabel {
  readonly text: string
  /** The label sits at the live centroid of these nodes, so it follows drags. */
  readonly nodes: SceneNode[]
}

/** How far apart the curved duplicates of a same-pair relation sit, world units. */
const PARALLEL_RELATION_SPACING = 16

export function buildRelationGraphScene(
  graph: RelationGraph,
): RelationGraphScene {
  type WorkingNode = LayoutNode & { data: RelationGraphNode }
  const workingNodes = graph.nodes.map(
    (node): WorkingNode => ({ id: node.id, data: node }),
  )
  const workingById = new Map(workingNodes.map((node) => [node.id, node]))
  const layout = layoutRelationGraph(
    workingNodes,
    buildSimulationLinks(graph.relations, workingById),
  )

  const nodes = workingNodes.map((node): SceneNode => {
    if (node.x === undefined || node.y === undefined) {
      throw new Error(`Graph layout left node ${node.id} without a position`)
    }
    return {
      data: node.data,
      label: nodeLabel(node.data),
      x: node.x,
      y: node.y,
    }
  })
  const nodeById = new Map(nodes.map((node) => [node.data.id, node]))
  const sceneNodeOf = (working: WorkingNode) => {
    const node = nodeById.get(working.id)
    if (node === undefined) {
      throw new Error(`Graph layout returned unknown node ${working.id}`)
    }
    return node
  }

  return {
    nodes,
    links: buildSceneLinks(graph.relations, nodeById),
    clusterLabels: layout.clusters.flatMap((cluster) => {
      const text = mostCommonDeployedSymbol(cluster.nodes.map((n) => n.data))
      if (text === undefined) return []
      return [{ text, nodes: cluster.nodes.map(sceneNodeOf) }]
    }),
    nodeById,
    width: layout.width,
    height: layout.height,
  }
}

/**
 * The force simulation must see one spring per node pair, not one per
 * relation, or pairs with many parallel relations would be pulled unnaturally
 * close together.
 */
function buildSimulationLinks<Node extends LayoutNode>(
  relations: RelationGraphRelation[],
  nodeById: Map<string, Node>,
): LayoutLink<Node>[] {
  const byPair = new Map<string, LayoutLink<Node>>()
  for (const relation of relations) {
    const source = requireNode(nodeById, sourceId(relation))
    const target = requireNode(nodeById, targetId(relation))
    byPair.set(unorderedPairKey(source.id, target.id), { source, target })
  }
  return [...byPair.values()]
}

function buildSceneLinks(
  relations: RelationGraphRelation[],
  nodeById: Map<string, SceneNode>,
): SceneLink[] {
  const groups = new Map<string, RelationGraphRelation[]>()
  for (const relation of relations) {
    const key = unorderedPairKey(sourceId(relation), targetId(relation))
    const group = groups.get(key)
    if (group === undefined) {
      groups.set(key, [relation])
    } else {
      group.push(relation)
    }
  }

  return relations.map((relation): SceneLink => {
    const source = requireNode(nodeById, sourceId(relation))
    const target = requireNode(nodeById, targetId(relation))
    const group = groups.get(
      unorderedPairKey(sourceId(relation), targetId(relation)),
    )
    if (group === undefined) {
      throw new Error('Relation graph contains an ungrouped relation')
    }
    // Spread the group symmetrically around the straight line. The sign flips
    // with the endpoint order so that the same relation always bends to the
    // same side no matter which endpoint is the locked one.
    const direction = source.data.id < target.data.id ? 1 : -1
    const curve =
      (group.indexOf(relation) - (group.length - 1) / 2) *
      PARALLEL_RELATION_SPACING *
      direction

    return { relation, id: relationId(relation), source, target, curve }
  })
}

function requireNode<Node>(nodeById: Map<string, Node>, id: string): Node {
  const node = nodeById.get(id)
  if (node === undefined) {
    throw new Error(`Relation graph contains unknown endpoint ${id}`)
  }
  return node
}

/**
 * A link is always a quadratic curve; a straight link is the degenerate curve
 * whose control point is the midpoint. One shape means one code path for
 * drawing, arrows, labels, and distance checks.
 *
 * The geometry is space-agnostic: built from world coordinates here, and still
 * valid after an affine screen transform of all three points.
 */
export interface LinkGeometry {
  sx: number
  sy: number
  cx: number
  cy: number
  tx: number
  ty: number
}

export function linkGeometry(link: SceneLink): LinkGeometry {
  const { source, target, curve } = link
  const cx = (source.x + target.x) / 2
  const cy = (source.y + target.y) / 2
  const base = {
    sx: source.x,
    sy: source.y,
    cx,
    cy,
    tx: target.x,
    ty: target.y,
  }
  if (curve === 0) return base

  const dx = target.x - source.x
  const dy = target.y - source.y
  const length = Math.hypot(dx, dy)
  // Coincident endpoints have no sideways direction to offset into.
  if (length === 0) return base

  return {
    ...base,
    cx: cx + (-dy / length) * curve,
    cy: cy + (dx / length) * curve,
  }
}

export function pointOnLink(geometry: LinkGeometry, t: number) {
  const u = 1 - t
  return {
    x: u * u * geometry.sx + 2 * u * t * geometry.cx + t * t * geometry.tx,
    y: u * u * geometry.sy + 2 * u * t * geometry.cy + t * t * geometry.ty,
  }
}

/** Normalized direction of travel at `t`, for orienting arrows. */
export function linkTangent(geometry: LinkGeometry, t: number) {
  const u = 1 - t
  const x =
    2 * u * (geometry.cx - geometry.sx) + 2 * t * (geometry.tx - geometry.cx)
  const y =
    2 * u * (geometry.cy - geometry.sy) + 2 * t * (geometry.ty - geometry.cy)
  const length = Math.hypot(x, y)
  if (length === 0) return { x: 1, y: 0 }
  return { x: x / length, y: y / length }
}

const LINK_DISTANCE_SAMPLES = 16

/**
 * Distance from a point to the curve, approximated by sampling. Exact for
 * straight links; for curved ones the error is far below the pointer
 * tolerances used for hit testing.
 */
export function distanceToLink(
  geometry: LinkGeometry,
  x: number,
  y: number,
): number {
  let previousX = geometry.sx
  let previousY = geometry.sy
  let best = Number.POSITIVE_INFINITY
  for (let i = 1; i <= LINK_DISTANCE_SAMPLES; i++) {
    const point = pointOnLink(geometry, i / LINK_DISTANCE_SAMPLES)
    best = Math.min(
      best,
      distanceToSegment(x, y, previousX, previousY, point.x, point.y),
    )
    previousX = point.x
    previousY = point.y
  }
  return best
}

/**
 * Nearest node whose center is within `radius` of the point, or undefined.
 *
 * Both hit tests scan linearly. At the graph's scale (thousands of elements,
 * one scan per pointer event) this is well under a millisecond, and unlike a
 * spatial index it cannot go stale while nodes are dragged.
 */
export function findNodeAt(
  scene: RelationGraphScene,
  x: number,
  y: number,
  radius: number,
): SceneNode | undefined {
  let best: SceneNode | undefined
  let bestDistance = radius
  for (const node of scene.nodes) {
    const distance = Math.hypot(node.x - x, node.y - y)
    if (distance <= bestDistance) {
      best = node
      bestDistance = distance
    }
  }
  return best
}

/** Nearest link within `tolerance` of the point, or undefined. */
export function findLinkAt(
  scene: RelationGraphScene,
  x: number,
  y: number,
  tolerance: number,
  excludedIds?: ReadonlySet<string>,
): SceneLink | undefined {
  let best: SceneLink | undefined
  let bestDistance = tolerance
  for (const link of scene.links) {
    if (excludedIds?.has(link.id)) continue
    const geometry = linkGeometry(link)
    // The curve never leaves the triangle of its three points, so a box check
    // around them rejects most links before the sampled distance runs.
    if (
      x < Math.min(geometry.sx, geometry.cx, geometry.tx) - tolerance ||
      x > Math.max(geometry.sx, geometry.cx, geometry.tx) + tolerance ||
      y < Math.min(geometry.sy, geometry.cy, geometry.ty) - tolerance ||
      y > Math.max(geometry.sy, geometry.cy, geometry.ty) + tolerance
    ) {
      continue
    }
    const distance = distanceToLink(geometry, x, y)
    if (distance <= bestDistance) {
      best = link
      bestDistance = distance
    }
  }
  return best
}

function distanceToSegment(
  x: number,
  y: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const abx = bx - ax
  const aby = by - ay
  const lengthSquared = abx * abx + aby * aby
  const t =
    lengthSquared === 0
      ? 0
      : Math.max(
          0,
          Math.min(1, ((x - ax) * abx + (y - ay) * aby) / lengthSquared),
        )
  return Math.hypot(x - (ax + abx * t), y - (ay + aby * t))
}
