import type { Node } from '../State'

export interface GraphEdge {
  readonly source: string
  readonly target: string
  readonly fieldName: string
}

export interface GraphProjection {
  readonly leafNodes: readonly Node[]
  readonly leafById: ReadonlyMap<string, Node>
  readonly leafIdsByItemId: ReadonlyMap<string, readonly string[]>
  readonly incomingByTarget: ReadonlyMap<string, readonly GraphEdge[]>
  readonly hiddenNodeIds: readonly string[]
  readonly hiddenNodeIdSet: ReadonlySet<string>
  readonly visibleEdges: readonly GraphEdge[]
  readonly visibleFieldNamesByNodeId: ReadonlyMap<string, ReadonlySet<string>>
}

interface EdgeIndex {
  incomingByTarget: Map<string, GraphEdge[]>
  outgoing: Map<string, string[]>
  outgoingVisible: Map<string, string[]>
  hiddenFieldNamesBySource: Map<string, ReadonlySet<string>>
}

let cachedNodes: readonly Node[] | undefined
let cachedProjection: GraphProjection | undefined

export function getGraphProjection(nodes: readonly Node[]): GraphProjection {
  if (nodes === cachedNodes && cachedProjection !== undefined) {
    return cachedProjection
  }

  const { leafNodes, leafIdsByItemId } = indexItems(nodes)
  const leafById = new Map(leafNodes.map((node) => [node.id, node]))
  if (leafById.size !== leafNodes.length) {
    throw new Error('Duplicate graph node id')
  }

  const edgeIndex = indexEdges(leafNodes, leafById)
  const hiddenNodeIdSet = getHiddenNodeIdSet(nodes, leafNodes, edgeIndex)
  const { visibleEdges, visibleFieldNamesByNodeId } = projectVisibleEdges(
    nodes,
    leafIdsByItemId,
    hiddenNodeIdSet,
    edgeIndex,
  )

  const projection = {
    leafNodes,
    leafById,
    leafIdsByItemId,
    incomingByTarget: edgeIndex.incomingByTarget,
    hiddenNodeIds: [...hiddenNodeIdSet],
    hiddenNodeIdSet,
    visibleEdges,
    visibleFieldNamesByNodeId,
  }
  cachedNodes = nodes
  cachedProjection = projection
  return projection
}

function indexEdges(
  leafNodes: readonly Node[],
  leafById: ReadonlyMap<string, Node>,
): EdgeIndex {
  const incomingByTarget = new Map<string, GraphEdge[]>()
  const outgoing = new Map<string, string[]>()
  const outgoingVisible = new Map<string, string[]>()
  const hiddenFieldNamesBySource = new Map<string, ReadonlySet<string>>()
  for (const node of leafNodes) {
    const hiddenFields = new Set(node.hiddenFields)
    hiddenFieldNamesBySource.set(node.id, hiddenFields)
    const fieldNames = new Set<string>()
    const targets: string[] = []
    const targetsVisible: string[] = []
    for (const field of node.fields) {
      if (fieldNames.has(field.name)) {
        throw new Error(`Duplicate field name ${node.id}:${field.name}`)
      }
      fieldNames.add(field.name)
      if (!leafById.has(field.target)) continue
      const edge = {
        source: node.id,
        target: field.target,
        fieldName: field.name,
      }
      const incoming = incomingByTarget.get(field.target) ?? []
      incoming.push(edge)
      incomingByTarget.set(field.target, incoming)
      targets.push(field.target)
      if (!hiddenFields.has(field.name)) targetsVisible.push(field.target)
    }
    outgoing.set(node.id, targets)
    outgoingVisible.set(node.id, targetsVisible)
  }
  return {
    incomingByTarget,
    outgoing,
    outgoingVisible,
    hiddenFieldNamesBySource,
  }
}

function getHiddenNodeIdSet(
  nodes: readonly Node[],
  leafNodes: readonly Node[],
  edgeIndex: EdgeIndex,
): Set<string> {
  const roots = leafNodes
    .filter(
      (node) => node.isInitial || !edgeIndex.incomingByTarget.has(node.id),
    )
    .map((node) => node.id)
  const reachable = getReachable(roots, edgeIndex.outgoing)
  const detached = leafNodes
    .filter((node) => !reachable.has(node.id))
    .map((node) => node.id)
  const visible = getReachable(
    [...roots, ...detached],
    edgeIndex.outgoingVisible,
  )
  const hiddenNodeIdSet = new Set(
    leafNodes
      .filter((node) => reachable.has(node.id) && !visible.has(node.id))
      .map((node) => node.id),
  )
  addHiddenGroups(nodes, hiddenNodeIdSet)
  return hiddenNodeIdSet
}

function projectVisibleEdges(
  nodes: readonly Node[],
  leafIdsByItemId: ReadonlyMap<string, readonly string[]>,
  hiddenNodeIdSet: ReadonlySet<string>,
  edgeIndex: EdgeIndex,
): {
  visibleEdges: GraphEdge[]
  visibleFieldNamesByNodeId: Map<string, Set<string>>
} {
  const visibleEdges: GraphEdge[] = []
  const visibleFieldNamesByNodeId = new Map<string, Set<string>>()
  for (const incoming of edgeIndex.incomingByTarget.values()) {
    for (const edge of incoming) {
      if (hiddenNodeIdSet.has(edge.source)) continue
      if (hiddenNodeIdSet.has(edge.target)) continue
      const hiddenFields = edgeIndex.hiddenFieldNamesBySource.get(edge.source)
      if (hiddenFields === undefined)
        throw new Error(`Missing node ${edge.source}`)
      if (hiddenFields.has(edge.fieldName)) continue
      visibleEdges.push(edge)
      const names = visibleFieldNamesByNodeId.get(edge.source) ?? new Set()
      names.add(edge.fieldName)
      visibleFieldNamesByNodeId.set(edge.source, names)
    }
  }
  for (const node of getAllItems(nodes)) {
    if (node.subnodes.length === 0 || hiddenNodeIdSet.has(node.id)) continue
    const descendantIds = new Set(leafIdsByItemId.get(node.id) ?? [])
    const visibleTargets = new Set(
      visibleEdges
        .filter((edge) => descendantIds.has(edge.source))
        .map((edge) => edge.target),
    )
    const hiddenFields = new Set(node.hiddenFields)
    const names = new Set(
      node.fields
        .filter(
          (field) =>
            visibleTargets.has(field.target) && !hiddenFields.has(field.name),
        )
        .map((field) => field.name),
    )
    visibleFieldNamesByNodeId.set(node.id, names)
  }
  return { visibleEdges, visibleFieldNamesByNodeId }
}

function getAllItems(nodes: readonly Node[]): Node[] {
  const items: Node[] = []
  const stack = [...nodes]
  while (stack.length > 0) {
    const node = stack.pop()
    if (node === undefined) throw new Error('Missing stacked node')
    items.push(node)
    for (const subnode of node.subnodes) stack.push(subnode)
  }
  return items
}

function indexItems(nodes: readonly Node[]): {
  leafNodes: Node[]
  leafIdsByItemId: Map<string, readonly string[]>
} {
  const leafNodes: Node[] = []
  const leafIdsByItemId = new Map<string, readonly string[]>()
  const itemIds = new Set<string>()
  const stack = nodes.map((node) => ({ node, visited: false })).reverse()
  while (stack.length > 0) {
    const current = stack.pop()
    if (current === undefined) throw new Error('Missing stacked item')
    if (!current.visited) {
      if (itemIds.has(current.node.id))
        throw new Error('Duplicate graph item id')
      itemIds.add(current.node.id)
    }
    if (!current.visited && current.node.subnodes.length > 0) {
      stack.push({ node: current.node, visited: true })
      for (const subnode of current.node.subnodes) {
        stack.push({ node: subnode, visited: false })
      }
      continue
    }
    if (current.node.subnodes.length === 0) {
      leafNodes.push(current.node)
      leafIdsByItemId.set(current.node.id, [current.node.id])
      continue
    }
    leafIdsByItemId.set(
      current.node.id,
      current.node.subnodes.flatMap(
        (node) => leafIdsByItemId.get(node.id) ?? [],
      ),
    )
  }
  return { leafNodes, leafIdsByItemId }
}

function getReachable(
  roots: readonly string[],
  outgoing: ReadonlyMap<string, readonly string[]>,
): Set<string> {
  const reachable = new Set(roots)
  const queue = [...roots]
  for (const source of queue) {
    for (const target of outgoing.get(source) ?? []) {
      if (reachable.has(target)) continue
      reachable.add(target)
      queue.push(target)
    }
  }
  return reachable
}

function addHiddenGroups(nodes: readonly Node[], hidden: Set<string>): void {
  const stack = nodes.map((node) => ({ node, visited: false }))
  while (stack.length > 0) {
    const current = stack.pop()
    if (current === undefined) throw new Error('Missing stacked group')
    if (!current.visited && current.node.subnodes.length > 0) {
      stack.push({ node: current.node, visited: true })
      for (const subnode of current.node.subnodes) {
        stack.push({ node: subnode, visited: false })
      }
      continue
    }
    if (
      current.node.subnodes.length > 0 &&
      current.node.subnodes.every((node) => hidden.has(node.id))
    ) {
      hidden.add(current.node.id)
    }
  }
}
