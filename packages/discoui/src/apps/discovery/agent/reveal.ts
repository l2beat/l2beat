import type { Node } from '../panel-nodes/store/State'
import {
  getGraphProjection,
  mapGraphItems,
} from '../panel-nodes/store/utils/graphProjection'

interface Link {
  source: string
  field: string
  hidden: boolean
}

// Makes each target visible by unhiding the fewest references the
// researcher hid: a contract is visible while a chain of visible references
// reaches it from an initial contract, so this finds, for every target, the
// chain with the fewest hidden links and unhides only those. `via` are the
// contracts on the chains, besides the targets and the roots.
export function revealItems(
  nodes: readonly Node[],
  targetIds: readonly string[],
): { nodes: Node[]; via: string[] } {
  const leaves = getGraphProjection(nodes).leafNodes
  const parent = cheapestParents(leaves)
  const targets = new Set(targetIds)
  const unhide = new Map<string, Set<string>>()
  const via = new Set<string>()
  for (const target of targetIds) {
    for (let at = target, link = parent.get(at); link; link = parent.get(at)) {
      if (link.hidden) {
        const fields = unhide.get(link.source) ?? new Set()
        fields.add(link.field)
        unhide.set(link.source, fields)
      }
      at = link.source
      if (parent.has(at) && !targets.has(at)) via.add(at)
    }
  }
  const revealed = mapGraphItems(nodes, (node) => {
    const fields = unhide.get(node.id)
    if (fields === undefined) return node
    return {
      ...node,
      hiddenFields: node.hiddenFields.filter((name) => !fields.has(name)),
    }
  })
  return { nodes: revealed, via: [...via] }
}

// Breadth first by the number of hidden links: everything reachable without
// one comes first, then with one, and so on, so each contract's parent lies
// on a chain with the fewest hidden links.
function cheapestParents(leaves: readonly Node[]): Map<string, Link> {
  const byId = new Map(leaves.map((node) => [node.id, node]))
  const referenced = new Set(
    leaves.flatMap((n) => n.fields.map((f) => f.target)),
  )
  const parent = new Map<string, Link>()
  const reached = new Set<string>()
  let frontier = leaves
    .filter((node) => node.isInitial || !referenced.has(node.id))
    .map((node) => node.id)
  for (const id of frontier) reached.add(id)
  while (frontier.length > 0) {
    const nextLevel = new Map<string, Link>()
    // Array iteration visits what the loop appends, so this level grows
    // through visible links before any hidden one is taken.
    for (const id of frontier) {
      const node = byId.get(id) as Node
      const hiddenFields = new Set(node.hiddenFields)
      for (const field of node.fields) {
        if (reached.has(field.target) || !byId.has(field.target)) continue
        const link = {
          source: id,
          field: field.name,
          hidden: hiddenFields.has(field.name),
        }
        if (link.hidden) {
          if (!nextLevel.has(field.target)) nextLevel.set(field.target, link)
          continue
        }
        reached.add(field.target)
        parent.set(field.target, link)
        frontier.push(field.target)
      }
    }
    frontier = []
    for (const [target, link] of nextLevel) {
      if (reached.has(target)) continue
      reached.add(target)
      parent.set(target, link)
      frontier.push(target)
    }
  }
  return parent
}
