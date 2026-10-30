import type { Node } from '../panel-nodes/store/State'

export function edgeKey(from: string, to: string): string {
  return `${from}>${to}`
}

// Every field link in the graph, members of closed groups included.
export function linksOf(nodes: readonly Node[]): Set<string> {
  const links = new Set<string>()
  const stack = [...nodes]
  for (let node = stack.pop(); node !== undefined; node = stack.pop()) {
    for (const field of node.fields) {
      links.add(edgeKey(node.id, field.target))
    }
    stack.push(...node.subnodes)
  }
  return links
}

// A path reads holder first, and control sits on the controlled contract: a
// proxy's $admin points at its admin, a timelock's proposers at who proposes.
// So each hop is the next contract's field pointing back, and only when there
// is no such field, the forward one.
export function resolvePathEdges(
  paths: readonly (readonly string[])[],
  links: ReadonlySet<string>,
): Set<string> {
  const edges = new Set<string>()
  for (const path of paths) {
    for (const [i, from] of path.entries()) {
      const to = path[i + 1]
      if (to === undefined) {
        continue
      }
      if (links.has(edgeKey(to, from))) {
        edges.add(edgeKey(to, from))
      } else if (links.has(edgeKey(from, to))) {
        edges.add(edgeKey(from, to))
      }
    }
  }
  return edges
}

// In the full graph a contract inside a closed group is drawn as the group,
// so the group carries its highlight and the rows leaving it.
export function toDrawn(
  ids: ReadonlySet<string>,
  edges: ReadonlySet<string>,
  drawnBy: ReadonlyMap<string, { id: string }>,
): { nodes: Set<string>; edges: Set<string> } {
  const drawn = (id: string) => drawnBy.get(id)?.id ?? id
  const drawnEdges = new Set(edges)
  for (const edge of edges) {
    const separator = edge.indexOf('>')
    const from = edge.slice(0, separator)
    const to = edge.slice(separator + 1)
    drawnEdges.add(edgeKey(drawn(from), to))
  }
  return { nodes: new Set([...ids].map(drawn)), edges: drawnEdges }
}
