import type { Node } from '../State'
import type { NodeLocations } from './storage'

const X_SPACING = 120
const Y_SPACING = 40

function isEoa(node: Node): boolean {
  return node.addressType === 'EOA' || node.addressType === 'EOAPermissioned'
}

/**
 * For each node, the number of distinct other nodes that reference it (have a
 * field pointing at it). Used to order nodes within a column.
 */
function countReferencedBy(nodes: readonly Node[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const node of nodes) {
    counts.set(node.id, 0)
  }
  for (const node of nodes) {
    const referencedTargets = new Set<string>()
    for (const field of node.fields) {
      if (field.target !== node.id) {
        referencedTargets.add(field.target)
      }
    }
    for (const target of referencedTargets) {
      const current = counts.get(target)
      if (current !== undefined) {
        counts.set(target, current + 1)
      }
    }
  }
  return counts
}

/**
 * Groups nodes by similarity (same flattened source OR same template + value
 * keys) using union-find, so transitively related nodes share a group. Returns
 * the groups as columns: multi-member groups first, sorted by size descending
 * (the largest group leftmost), then a column with every non-EOA node that has
 * no similarities ("other"), and finally a rightmost column grouping all EOAs.
 */
export function computeSimilarityGroups(nodes: readonly Node[]): Node[][] {
  const parent = new Map<string, string>()
  for (const node of nodes) {
    parent.set(node.id, node.id)
  }

  const find = (id: string): string => {
    let root = id
    while (parent.get(root) !== root) {
      const grandparent = parent.get(parent.get(root) as string) as string
      parent.set(root, grandparent)
      root = grandparent
    }
    return root
  }
  const union = (a: string, b: string) => {
    const rootA = find(a)
    const rootB = find(b)
    if (rootA !== rootB) {
      parent.set(rootA, rootB)
    }
  }

  // Union every pair of nodes that share a source or value-shape key.
  const firstNodeForTag = new Map<string, string>()
  for (const node of nodes) {
    const tags: string[] = []
    if (node.sourceKey) tags.push(`src:${node.sourceKey}`)
    if (node.valuesShapeKey) tags.push(`val:${node.valuesShapeKey}`)
    for (const tag of tags) {
      const first = firstNodeForTag.get(tag)
      if (first === undefined) {
        firstNodeForTag.set(tag, node.id)
      } else {
        union(node.id, first)
      }
    }
  }

  // Collect components, preserving input order within each component.
  const components = new Map<string, Node[]>()
  for (const node of nodes) {
    const root = find(node.id)
    const group = components.get(root)
    if (group) {
      group.push(node)
    } else {
      components.set(root, [node])
    }
  }

  const multiMember: Node[][] = []
  const otherSingletons: Node[] = []
  const eoaSingletons: Node[] = []
  for (const group of components.values()) {
    if (group.length > 1) {
      multiMember.push(group)
      continue
    }
    const only = group[0]
    if (!only) continue
    if (isEoa(only)) {
      eoaSingletons.push(only)
    } else {
      otherSingletons.push(only)
    }
  }

  multiMember.sort((a, b) => b.length - a.length)

  const columns = [...multiMember]
  if (otherSingletons.length > 0) {
    columns.push(otherSingletons)
  }
  if (eoaSingletons.length > 0) {
    columns.push(eoaSingletons)
  }

  // Within each column, put the most-referenced nodes first.
  const referencedBy = countReferencedBy(nodes)
  for (const column of columns) {
    column.sort(
      (a, b) => (referencedBy.get(b.id) ?? 0) - (referencedBy.get(a.id) ?? 0),
    )
  }

  return columns
}

/**
 * Lays out nodes into one column per similarity group, left to right, largest
 * group first. Within a column nodes are stacked top to bottom. Nodes with no
 * similarities land together in the rightmost column.
 */
export function groupSimilarLayout(nodes: readonly Node[]): NodeLocations {
  const columns = computeSimilarityGroups(nodes)
  const locations: NodeLocations = {}

  let x = 0
  for (const column of columns) {
    let y = 0
    let maxWidth = 0
    for (const node of column) {
      locations[node.id] = { x, y }
      y += node.box.height + Y_SPACING
      maxWidth = Math.max(maxWidth, node.box.width)
    }
    x += maxWidth + X_SPACING
  }

  return locations
}
