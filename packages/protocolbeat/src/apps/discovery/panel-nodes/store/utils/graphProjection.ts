import type { Node } from '../State'

export interface GraphEdge {
  readonly source: string
  readonly target: string
  readonly fieldName: string
}

export interface GraphProjection {
  readonly leafNodes: readonly Node[]
  readonly leafIdsByItemId: ReadonlyMap<string, readonly string[]>
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

  const { leafNodes, leafIdsByItemId, groupIds } = indexItems(nodes)
  const leafIds = new Set(leafNodes.map((node) => node.id))
  const incomingByTarget = new Map<string, GraphEdge[]>()
  const outgoingBySource = new Map<string, GraphEdge[]>()
  const hiddenFieldsBySource = new Map<string, ReadonlySet<string>>()
  for (const node of leafNodes) {
    const hiddenFields = new Set(node.hiddenFields)
    const fieldNames = new Set<string>()
    hiddenFieldsBySource.set(node.id, hiddenFields)
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

  const roots = leafNodes
    .filter((node) => node.isInitial || !incomingByTarget.has(node.id))
    .map((node) => node.id)
  const reachable = getReachable(roots, outgoingBySource)
  const detached = leafNodes
    .filter((node) => !reachable.has(node.id))
    .map((node) => node.id)
  const visible = getReachable(
    [...roots, ...detached],
    outgoingBySource,
    hiddenFieldsBySource,
  )
  const hiddenNodeIds = new Set(
    leafNodes
      .filter((node) => reachable.has(node.id) && !visible.has(node.id))
      .map((node) => node.id),
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
    hiddenNodeIds,
    visibleEdges,
    incomingByTarget,
  }
  cachedNodes = nodes
  cachedProjection = projection
  return projection
}

export function setItemsHidden(
  nodes: Node[],
  itemIds: ReadonlySet<string>,
  hidden: boolean,
): Node[]
export function setItemsHidden(
  nodes: readonly Node[],
  itemIds: ReadonlySet<string>,
  hidden: boolean,
): readonly Node[]
export function setItemsHidden(
  nodes: readonly Node[],
  itemIds: ReadonlySet<string>,
  hidden: boolean,
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
      if (hidden && initialIds.has(targetId)) continue
      for (const edge of projection.incomingByTarget.get(targetId) ?? []) {
        const names = namesBySource.get(edge.source) ?? new Set()
        names.add(edge.fieldName)
        namesBySource.set(edge.source, names)
      }
    }
  }
  if (namesBySource.size === 0) return nodes

  const updated = updateLeafNodes(nodes, (node) => {
    const names = namesBySource.get(node.id)
    if (names === undefined) return node
    const hiddenFields = hidden
      ? [...new Set([...node.hiddenFields, ...names])]
      : node.hiddenFields.filter((name) => !names.has(name))
    if (hiddenFields.length === node.hiddenFields.length) return node
    return { ...node, hiddenFields }
  })
  return updated.every((node, index) => node === nodes[index]) ? nodes : updated
}

export function updateLeafNodes(
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
    const leaf = subnodes.length === 0 ? update(current.node) : current.node
    const childrenChanged = subnodes.some(
      (subnode, index) => subnode !== current.node.subnodes[index],
    )
    const node = childrenChanged
      ? { ...current.node, subnodes, hiddenFields: [] }
      : leaf
    updated.set(node.id, node)
  }
  return nodes.map((node) => updated.get(node.id) ?? node)
}

function indexItems(nodes: readonly Node[]): {
  leafNodes: Node[]
  leafIdsByItemId: Map<string, readonly string[]>
  groupIds: Set<string>
} {
  const leafNodes: Node[] = []
  const leafIdsByItemId = new Map<string, readonly string[]>()
  const groupIds = new Set<string>()
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
  return { leafNodes, leafIdsByItemId, groupIds }
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
