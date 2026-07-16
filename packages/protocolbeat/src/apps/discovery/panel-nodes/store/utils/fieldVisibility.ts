import type { Node } from '../State'
import type { GraphProjection } from './graphProjection'

export interface FieldVisibilityPlan {
  readonly hidden: boolean
  readonly fieldNamesBySource: ReadonlyMap<string, ReadonlySet<string>>
}

export function planFieldVisibility(
  projection: GraphProjection,
  itemIds: ReadonlySet<string>,
  hidden: boolean,
): FieldVisibilityPlan {
  const targetIds = new Set<string>()
  for (const itemId of itemIds) {
    for (const leafId of projection.leafIdsByItemId.get(itemId) ?? []) {
      const leaf = projection.leafById.get(leafId)
      if (!hidden || !leaf?.isInitial) targetIds.add(leafId)
    }
  }

  const fieldNamesBySource = new Map<string, Set<string>>()
  for (const targetId of targetIds) {
    for (const edge of projection.incomingByTarget.get(targetId) ?? []) {
      const source = projection.leafById.get(edge.source)
      if (source === undefined) throw new Error(`Missing node ${edge.source}`)
      const currentlyHidden = source.hiddenFields.includes(edge.fieldName)
      if (currentlyHidden === hidden) continue
      const names = fieldNamesBySource.get(edge.source) ?? new Set()
      names.add(edge.fieldName)
      fieldNamesBySource.set(edge.source, names)
    }
  }
  return { hidden, fieldNamesBySource }
}

export function applyFieldVisibility(
  nodes: readonly Node[],
  plan: FieldVisibilityPlan,
): Node[] {
  if (plan.fieldNamesBySource.size === 0) return [...nodes]
  return updateLeafNodes(nodes, (node) => {
    const names = plan.fieldNamesBySource.get(node.id)
    if (names === undefined) return node
    const hiddenFields = plan.hidden
      ? [...new Set([...node.hiddenFields, ...names])]
      : node.hiddenFields.filter((name) => !names.has(name))
    return { ...node, hiddenFields }
  })
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
