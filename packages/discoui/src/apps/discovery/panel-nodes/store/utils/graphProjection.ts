import type { Node } from '../State'

export interface GraphEdge {
  readonly source: string
  readonly target: string
  readonly fieldName: string
}

export interface GraphProjection {
  readonly leafNodes: readonly Node[]
  readonly leafIdsByItemId: ReadonlyMap<string, readonly string[]>
  readonly hiddenFieldCount: number
  // Nodes cut off from every root by hidden fields. Hiding all inbound fields
  // of a node always hides it; roots (initial contracts and nodes nothing
  // references) can never be hidden.
  readonly hiddenNodeIds: ReadonlySet<string>
  readonly visibleEdges: readonly GraphEdge[]
  readonly incomingByTarget: ReadonlyMap<string, readonly GraphEdge[]>
}

let cachedNodes: readonly Node[] | undefined
let cachedProjection: GraphProjection | undefined

export function getGraphProjection(nodes: readonly Node[]): GraphProjection {
  if (nodes === cachedNodes && cachedProjection !== undefined) {
    return cachedProjection
  }

  const { leafNodes, leafIdsByItemId, groupIds, hiddenFieldCount } =
    indexItems(nodes)
  const { incomingByTarget, outgoingBySource, hiddenFieldsBySource } =
    indexEdges(leafNodes)

  const roots = leafNodes
    .filter((node) => node.isInitial || !incomingByTarget.has(node.id))
    .map((node) => node.id)
  const reachable = getReachable(roots, outgoingBySource)
  // Detached components are visible while their visible edges still support a
  // cycle. Pruning unsupported nodes makes hiding the last inbound field
  // cascade through detached components just like it does through rooted ones.
  const detachedIds = new Set(
    leafNodes.filter((node) => !reachable.has(node.id)).map((node) => node.id),
  )
  const detachedSeeds = getSupportedDetached(
    detachedIds,
    outgoingBySource,
    hiddenFieldsBySource,
  )
  const visible = getReachable(
    [...roots, ...detachedSeeds],
    outgoingBySource,
    hiddenFieldsBySource,
  )
  const hiddenNodeIds = new Set(
    leafNodes.filter((node) => !visible.has(node.id)).map((node) => node.id),
  )
  for (const groupId of groupIds) {
    const leaves = leafIdsByItemId.get(groupId)
    if (leaves?.every((id) => hiddenNodeIds.has(id))) hiddenNodeIds.add(groupId)
  }
  const visibleEdges = [...outgoingBySource.values()]
    .flat()
    .filter(
      (edge) =>
        !hiddenNodeIds.has(edge.source) &&
        !hiddenNodeIds.has(edge.target) &&
        !hiddenFieldsBySource.get(edge.source)?.has(edge.fieldName),
    )

  const projection = {
    leafNodes,
    leafIdsByItemId,
    hiddenFieldCount,
    hiddenNodeIds,
    visibleEdges,
    incomingByTarget,
  }
  cachedNodes = nodes
  cachedProjection = projection
  return projection
}

// A node can only be hidden by hiding the values that reference it, so roots
// (initial contracts and nodes with no inbound references) are unhideable.
export function isHideable(projection: GraphProjection, node: Node): boolean {
  return !node.isInitial && projection.incomingByTarget.has(node.id)
}

export function hideItems(
  nodes: readonly Node[],
  itemIds: ReadonlySet<string>,
): readonly Node[] {
  const projection = getGraphProjection(nodes)
  const initialIds = new Set(
    projection.leafNodes
      .filter((node) => node.isInitial)
      .map((node) => node.id),
  )
  const namesBySource = new Map<string, Set<string>>()
  for (const itemId of itemIds) {
    for (const targetId of projection.leafIdsByItemId.get(itemId) ?? []) {
      if (initialIds.has(targetId)) continue
      for (const edge of projection.incomingByTarget.get(targetId) ?? []) {
        const names = namesBySource.get(edge.source) ?? new Set()
        names.add(edge.fieldName)
        namesBySource.set(edge.source, names)
      }
    }
  }
  if (namesBySource.size === 0) return nodes

  const updated = mapGraphItems(nodes, (node) => {
    const names = namesBySource.get(node.id)
    if (names === undefined) return node
    const hiddenFields = [...new Set([...node.hiddenFields, ...names])]
    if (hiddenFields.length === node.hiddenFields.length) return node
    return { ...node, hiddenFields }
  })
  return updated.every((node, index) => node === nodes[index]) ? nodes : updated
}

// Applies update to every item in the tree, leaves and groups alike, rebuilt
// bottom-up. Items whose subtree and own update both come back unchanged keep
// their reference so downstream memoization keeps working.
export function mapGraphItems(
  nodes: readonly Node[],
  update: (node: Node) => Node,
): Node[] {
  const updated = new Map<string, Node>()
  const stack = nodes.map((node) => ({ node, visited: false })).reverse()
  while (stack.length > 0) {
    const current = stack.pop()
    if (current === undefined) throw new Error('Missing stacked update')
    if (!current.visited && current.node.subnodes.length > 0) {
      stack.push({ node: current.node, visited: true })
      for (const subnode of current.node.subnodes) {
        stack.push({ node: subnode, visited: false })
      }
      continue
    }
    const subnodes = current.node.subnodes.map((node) => {
      const next = updated.get(node.id)
      if (next === undefined) throw new Error(`Missing updated node ${node.id}`)
      return next
    })
    const childrenChanged = subnodes.some(
      (subnode, index) => subnode !== current.node.subnodes[index],
    )
    const withChildren = childrenChanged
      ? { ...current.node, subnodes }
      : current.node
    const node = update(withChildren)
    updated.set(node.id, node)
  }
  return nodes.map((node) => updated.get(node.id) ?? node)
}

function indexItems(nodes: readonly Node[]): {
  leafNodes: Node[]
  leafIdsByItemId: Map<string, readonly string[]>
  groupIds: Set<string>
  hiddenFieldCount: number
} {
  const leafNodes: Node[] = []
  const leafIdsByItemId = new Map<string, readonly string[]>()
  const groupIds = new Set<string>()
  const itemIds = new Set<string>()
  let hiddenFieldCount = 0
  const stack = nodes.map((node) => ({ node, visited: false })).reverse()
  while (stack.length > 0) {
    const current = stack.pop()
    if (current === undefined) throw new Error('Missing stacked item')
    if (!current.visited) {
      if (itemIds.has(current.node.id))
        throw new Error('Duplicate graph item id')
      itemIds.add(current.node.id)
      hiddenFieldCount += current.node.hiddenFields.length
    }
    if (!current.visited && current.node.subnodes.length > 0) {
      groupIds.add(current.node.id)
      stack.push({ node: current.node, visited: true })
      for (const subnode of current.node.subnodes) {
        stack.push({ node: subnode, visited: false })
      }
      continue
    }
    if (current.node.subnodes.length === 0) {
      leafNodes.push(current.node)
      leafIdsByItemId.set(current.node.id, [current.node.id])
    } else {
      leafIdsByItemId.set(
        current.node.id,
        current.node.subnodes.flatMap(
          (node) => leafIdsByItemId.get(node.id) ?? [],
        ),
      )
    }
  }
  return { leafNodes, leafIdsByItemId, groupIds, hiddenFieldCount }
}

function addToIndex(
  index: Map<string, GraphEdge[]>,
  id: string,
  edge: GraphEdge,
): void {
  const edges = index.get(id) ?? []
  edges.push(edge)
  index.set(id, edges)
}

function indexEdges(leafNodes: readonly Node[]): {
  incomingByTarget: Map<string, GraphEdge[]>
  outgoingBySource: Map<string, GraphEdge[]>
  hiddenFieldsBySource: Map<string, ReadonlySet<string>>
} {
  const leafIds = new Set(leafNodes.map((node) => node.id))
  const incomingByTarget = new Map<string, GraphEdge[]>()
  const outgoingBySource = new Map<string, GraphEdge[]>()
  const hiddenFieldsBySource = new Map<string, ReadonlySet<string>>()
  for (const node of leafNodes) {
    const fieldNames = new Set<string>()
    hiddenFieldsBySource.set(node.id, new Set(node.hiddenFields))
    for (const field of node.fields) {
      if (fieldNames.has(field.name)) {
        throw new Error(`Duplicate field name ${node.id}:${field.name}`)
      }
      fieldNames.add(field.name)
      if (!leafIds.has(field.target)) continue
      const edge = {
        source: node.id,
        target: field.target,
        fieldName: field.name,
      }
      addToIndex(incomingByTarget, field.target, edge)
      addToIndex(outgoingBySource, node.id, edge)
    }
  }
  return { incomingByTarget, outgoingBySource, hiddenFieldsBySource }
}

function getSupportedDetached(
  detachedIds: ReadonlySet<string>,
  outgoingBySource: ReadonlyMap<string, readonly GraphEdge[]>,
  hiddenFieldsBySource: ReadonlyMap<string, ReadonlySet<string>>,
): Set<string> {
  const incomingCount = new Map<string, number>()
  for (const id of detachedIds) incomingCount.set(id, 0)
  for (const source of detachedIds) {
    const hiddenFields = hiddenFieldsBySource.get(source)
    for (const edge of outgoingBySource.get(source) ?? []) {
      if (hiddenFields?.has(edge.fieldName)) continue
      if (!detachedIds.has(edge.target)) continue
      incomingCount.set(edge.target, (incomingCount.get(edge.target) ?? 0) + 1)
    }
  }

  const supported = new Set(detachedIds)
  const queue = [...incomingCount]
    .filter(([, count]) => count === 0)
    .map(([id]) => id)
  for (const source of queue) {
    if (!supported.delete(source)) continue
    const hiddenFields = hiddenFieldsBySource.get(source)
    for (const edge of outgoingBySource.get(source) ?? []) {
      if (hiddenFields?.has(edge.fieldName)) continue
      if (!supported.has(edge.target)) continue
      const count = (incomingCount.get(edge.target) ?? 0) - 1
      incomingCount.set(edge.target, count)
      if (count === 0) queue.push(edge.target)
    }
  }
  return supported
}

function getReachable(
  roots: readonly string[],
  outgoingBySource: ReadonlyMap<string, readonly GraphEdge[]>,
  hiddenFieldsBySource?: ReadonlyMap<string, ReadonlySet<string>>,
): Set<string> {
  const reachable = new Set(roots)
  const queue = [...roots]
  for (const source of queue) {
    const hiddenFields = hiddenFieldsBySource?.get(source)
    for (const edge of outgoingBySource.get(source) ?? []) {
      if (hiddenFields?.has(edge.fieldName)) continue
      if (reachable.has(edge.target)) continue
      reachable.add(edge.target)
      queue.push(edge.target)
    }
  }
  return reachable
}
