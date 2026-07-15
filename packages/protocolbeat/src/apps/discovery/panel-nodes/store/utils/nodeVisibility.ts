import type { Node } from '../State'

interface VisibilityGraph {
  readonly leaves: Node[]
  readonly roots: string[]
  readonly outgoing: Map<string, string[]>
  readonly outgoingVisible: Map<string, string[]>
}

let cachedNodes: readonly Node[] | undefined
let cachedHiddenIds: readonly string[] | undefined

export function getHiddenNodeIds(nodes: readonly Node[]): readonly string[] {
  if (nodes === cachedNodes && cachedHiddenIds !== undefined) {
    return cachedHiddenIds
  }
  const graph = buildVisibilityGraph(nodes)
  const reachable = getReachable(graph.roots, graph.outgoing)
  const detached = graph.leaves
    .filter((node) => !reachable.has(node.id))
    .map((node) => node.id)
  const visible = getReachable(
    [...graph.roots, ...detached],
    graph.outgoingVisible,
  )
  const hidden = new Set(
    graph.leaves
      .filter((node) => reachable.has(node.id) && !visible.has(node.id))
      .map((node) => node.id),
  )
  addHiddenGroups(nodes, hidden)
  const result = [...hidden]
  cachedNodes = nodes
  cachedHiddenIds = result
  return result
}

export function setInboundFieldsHidden(
  nodes: readonly Node[],
  targetIds: ReadonlySet<string>,
  hidden: boolean,
): Node[] {
  const targets = collectTargetLeaves(nodes, targetIds)
  if (hidden) {
    for (const node of getLeafNodes(nodes)) {
      if (node.isInitial) targets.delete(node.id)
    }
  }
  return updateLeafNodes(nodes, (node) => {
    const matching = new Set(
      node.fields
        .filter((field) => targets.has(field.target))
        .map((field) => field.name),
    )
    if (matching.size === 0) return node
    const hiddenFields = hidden
      ? [...new Set([...node.hiddenFields, ...matching])]
      : node.hiddenFields.filter((name) => !matching.has(name))
    return { ...node, hiddenFields }
  })
}

export function getLeafNodes(nodes: readonly Node[]): Node[] {
  const leaves: Node[] = []
  const stack = nodes.slice().reverse()
  while (stack.length > 0) {
    const node = stack.pop()
    if (node === undefined) throw new Error('Missing stacked node')
    if (node.subnodes.length === 0) {
      leaves.push(node)
      continue
    }
    for (const subnode of node.subnodes) stack.push(subnode)
  }
  return leaves
}

function buildVisibilityGraph(nodes: readonly Node[]): VisibilityGraph {
  const leaves = getLeafNodes(nodes)
  const ids = new Set(leaves.map((node) => node.id))
  if (ids.size !== leaves.length) throw new Error('Duplicate graph node id')
  const incoming = new Map(leaves.map((node) => [node.id, 0]))
  const outgoing = new Map<string, string[]>()
  const outgoingVisible = new Map<string, string[]>()

  for (const node of leaves) {
    const hiddenFields = new Set(node.hiddenFields)
    const targets: string[] = []
    const targetsVisible: string[] = []
    for (const field of node.fields) {
      if (!ids.has(field.target)) continue
      targets.push(field.target)
      if (!hiddenFields.has(field.name)) targetsVisible.push(field.target)
      const count = incoming.get(field.target)
      if (count === undefined) throw new Error(`Missing node ${field.target}`)
      incoming.set(field.target, count + 1)
    }
    outgoing.set(node.id, targets)
    outgoingVisible.set(node.id, targetsVisible)
  }
  const roots = leaves
    .filter((node) => node.isInitial || incoming.get(node.id) === 0)
    .map((node) => node.id)
  return { leaves, roots, outgoing, outgoingVisible }
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

function collectTargetLeaves(
  nodes: readonly Node[],
  targetIds: ReadonlySet<string>,
): Set<string> {
  const targets = new Set<string>()
  const stack = nodes.map((node) => ({ node, selected: false }))
  while (stack.length > 0) {
    const current = stack.pop()
    if (current === undefined) throw new Error('Missing stacked target')
    const selected = current.selected || targetIds.has(current.node.id)
    if (current.node.subnodes.length === 0) {
      if (selected) targets.add(current.node.id)
      continue
    }
    for (const subnode of current.node.subnodes) {
      stack.push({ node: subnode, selected })
    }
  }
  return targets
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
    const node = subnodes.length === 0 ? update(current.node) : current.node
    if (
      subnodes.length > 0 &&
      subnodes.some(
        (subnode, index) => subnode !== current.node.subnodes[index],
      )
    ) {
      updated.set(current.node.id, {
        ...current.node,
        subnodes,
        hiddenFields: [],
      })
      continue
    }
    updated.set(node.id, node)
  }
  return nodes.map((node) => updated.get(node.id) ?? node)
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
