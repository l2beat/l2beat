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
  const byId = new Map(leaves.map((node) => [node.id, node]))
  const referenced = new Set(
    leaves.flatMap((n) => n.fields.map((f) => f.target)),
  )
  const roots = new Set(
    leaves
      .filter((node) => node.isInitial || !referenced.has(node.id))
      .map((node) => node.id),
  )
  const parent = cheapestParents(byId, [...roots])
  // A contract this tab's graph lacks is reported missing by the view.
  const present = targetIds.filter((id) => byId.has(id))
  const targets = new Set(present)
  const unhide = new Map<string, Set<string>>()
  const via = new Set<string>()
  for (const target of present) {
    const isDetached = !roots.has(target) && !parent.has(target)
    const chain = isDetached
      ? cheapestCycle(byId, target)
      : chainOf(parent, target)
    for (const link of chain) {
      if (link.hidden) {
        const fields = unhide.get(link.source) ?? new Set()
        fields.add(link.field)
        unhide.set(link.source, fields)
      }
      if (!roots.has(link.source) && !targets.has(link.source)) {
        via.add(link.source)
      }
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

function chainOf(parent: ReadonlyMap<string, Link>, id: string): Link[] {
  const chain: Link[] = []
  for (let link = parent.get(id); link; link = parent.get(link.source)) {
    chain.push(link)
  }
  return chain
}

// A contract no root reaches stays visible only on a cycle of visible
// references, so this finds the way back to it with the fewest hidden links.
function cheapestCycle(byId: ReadonlyMap<string, Node>, target: string) {
  const parent = cheapestParents(byId, [target])
  let best: Link[] = []
  let bestHiddenCount = Number.POSITIVE_INFINITY
  for (const id of [target, ...parent.keys()]) {
    const node = byId.get(id) as Node
    const hiddenFields = new Set(node.hiddenFields)
    for (const field of node.fields) {
      if (field.target !== target) continue
      const hidden = hiddenFields.has(field.name)
      const chain = [
        { source: id, field: field.name, hidden },
        ...chainOf(parent, id),
      ]
      const hiddenCount = chain.filter((link) => link.hidden).length
      if (hiddenCount < bestHiddenCount) {
        best = chain
        bestHiddenCount = hiddenCount
      }
    }
  }
  return best
}

// Breadth first by the number of hidden links: everything reachable without
// one comes first, then with one, and so on, so each contract's parent lies
// on a chain with the fewest hidden links.
function cheapestParents(
  byId: ReadonlyMap<string, Node>,
  startIds: readonly string[],
): Map<string, Link> {
  const parent = new Map<string, Link>()
  const reached = new Set(startIds)
  let frontier = [...startIds]
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
