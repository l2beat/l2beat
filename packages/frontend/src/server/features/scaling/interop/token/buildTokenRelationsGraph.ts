import type { InteropBridgeType } from '@l2beat/shared-pure'

/**
 * The relation graph of one abstract token, reduced to the two things a reader
 * cares about: which deployments are in a burn-mint relation with each other, and
 * which deployment is backed by which.
 *
 * Two reductions happen here, both of which the raw table cannot express:
 *
 * - `burnAndMint` is symmetric — burning on one side mints on the other, so
 *   neither endpoint is more original than the other. Every set of deployments
 *   connected that way collapses into ONE node. Drawn one-per-deployment they
 *   form a near-complete mesh that hides the structure completely (USDC: 42
 *   nodes and 139 pairs, versus 25 nodes and 24 edges once collapsed).
 * - `lockAndMint` is directional, but NOT in the direction of the A/B columns —
 *   those are lexicographic slots, not a direction. `lockedToken` names the
 *   escrowed endpoint, and that one backs the other.
 */

export interface TokenRelationsDeployment {
  chain: string
  address: string
  symbol: string
}

export interface TokenRelationsRoute {
  tokenAChain: string
  tokenAAddress: string
  tokenBChain: string
  tokenBAddress: string
  plugin: string
  bridgeType: InteropBridgeType
  lockedToken: 'A' | 'B' | null
}

/** A plugin observation behind an edge, kept so callers can name the bridges. */
export interface TokenRelationsEdgeSource {
  plugin: string
  bridgeType: InteropBridgeType
  /** Exact route chains, retained when deployments collapse into one node. */
  chains: string[]
}

export interface TokenRelationsGraphNode {
  /** The lexicographically smallest member key — stable for a given membership. */
  id: string
  /** More than one member means the deployments are in a burn-mint relation. */
  members: TokenRelationsDeployment[]
  /** What puts the members in a burn-mint relation; empty for one deployment. */
  sources: TokenRelationsEdgeSource[]
}

export interface TokenRelationsGraphEdge {
  /** `from` is the backing side. */
  from: string
  to: string
  kind: 'backs'
  sources: TokenRelationsEdgeSource[]
}

export interface TokenRelationsGraphModel {
  nodes: TokenRelationsGraphNode[]
  edges: TokenRelationsGraphEdge[]
  /** Nodes with no relation suitable for the public graph. */
  unconnectedNodeIds: string[]
}

export function deploymentKey(chain: string, address: string): string {
  return `${chain}|${address.toLowerCase()}`
}

export function buildTokenRelationsGraph(
  deployments: TokenRelationsDeployment[],
  routes: TokenRelationsRoute[],
): TokenRelationsGraphModel {
  const byKey = new Map(
    deployments.map((d) => [deploymentKey(d.chain, d.address), d]),
  )
  const relevant = routes.filter(
    (route) =>
      byKey.has(deploymentKey(route.tokenAChain, route.tokenAAddress)) &&
      byKey.has(deploymentKey(route.tokenBChain, route.tokenBAddress)),
  )

  const groups = groupBurnMint([...byKey.keys()], relevant)
  const nodes = buildNodes(groups, byKey, relevant)
  const edges = buildEdges(relevant, groups)
  const connectedNodeIds = new Set(
    edges.flatMap((edge) => [edge.from, edge.to]),
  )

  return {
    nodes,
    edges,
    unconnectedNodeIds: nodes
      .filter(
        (node) => node.sources.length === 0 && !connectedNodeIds.has(node.id),
      )
      .map((node) => node.id),
  }
}

function key(deployment: TokenRelationsDeployment): string {
  return deploymentKey(deployment.chain, deployment.address)
}

/** Union-find over the symmetric relations; every key is at least its own group. */
function groupBurnMint(
  keys: string[],
  routes: TokenRelationsRoute[],
): Map<string, string> {
  const parent = new Map(keys.map((k) => [k, k]))
  const find = (x: string): string => {
    let root = x
    while (parent.get(root) !== root) root = parent.get(root) as string
    // Path compression, so repeated lookups over a large group stay cheap.
    let walk = x
    while (parent.get(walk) !== root) {
      const next = parent.get(walk) as string
      parent.set(walk, root)
      walk = next
    }
    return root
  }

  for (const route of routes) {
    if (route.bridgeType !== 'burnAndMint') continue
    const a = find(deploymentKey(route.tokenAChain, route.tokenAAddress))
    const b = find(deploymentKey(route.tokenBChain, route.tokenBAddress))
    if (a === b) continue
    // Union toward the smaller key so the group id is the smallest member,
    // which keeps ids independent of the order relations arrive in.
    if (a < b) parent.set(b, a)
    else parent.set(a, b)
  }

  return new Map(keys.map((k) => [k, find(k)]))
}

function buildNodes(
  groups: Map<string, string>,
  byKey: Map<string, TokenRelationsDeployment>,
  routes: TokenRelationsRoute[],
): TokenRelationsGraphNode[] {
  const members = new Map<string, TokenRelationsDeployment[]>()
  for (const [memberKey, groupId] of groups) {
    const deployment = byKey.get(memberKey)
    if (!deployment) continue
    members.set(groupId, [...(members.get(groupId) ?? []), deployment])
  }

  // The symmetric relations that pulled a group together are what put its
  // members in a burn-mint relation, so the group keeps them to name the bridge.
  const sources = new Map<string, TokenRelationsEdgeSource[]>()
  for (const route of routes) {
    if (route.bridgeType !== 'burnAndMint') continue
    const groupId = groups.get(
      deploymentKey(route.tokenAChain, route.tokenAAddress),
    )
    if (groupId === undefined) continue
    const existing = sources.get(groupId) ?? []
    addUniqueSource(existing, sourceFromRoute(route))
    sources.set(groupId, existing)
  }

  return [...members]
    .map(([id, group]) => ({
      id,
      members: group.toSorted((a, b) => key(a).localeCompare(key(b))),
      sources: (sources.get(id) ?? []).toSorted(
        (a, b) =>
          a.plugin.localeCompare(b.plugin) ||
          a.bridgeType.localeCompare(b.bridgeType),
      ),
    }))
    .toSorted((a, b) => a.id.localeCompare(b.id))
}

function buildEdges(
  routes: TokenRelationsRoute[],
  groups: Map<string, string>,
): TokenRelationsGraphEdge[] {
  const directed = new Map<string, TokenRelationsGraphEdge>()

  for (const route of routes) {
    if (route.bridgeType !== 'lockAndMint') continue
    const a = groups.get(deploymentKey(route.tokenAChain, route.tokenAAddress))
    const b = groups.get(deploymentKey(route.tokenBChain, route.tokenBAddress))
    if (a === undefined || b === undefined || a === b) continue
    const source = sourceFromRoute(route)

    // A public risk graph can only make a useful lock-and-mint claim when the
    // evidence identifies the backing endpoint. Keep incomplete or conflicting
    // observations in TokenDB for investigation, but omit them from this view.
    if (route.lockedToken === null) continue

    const from = route.lockedToken === 'A' ? a : b
    const to = route.lockedToken === 'A' ? b : a
    addSource(directed, `${from}->${to}`, {
      from,
      to,
      kind: 'backs',
      sources: [],
    })
    addSourceTo(directed, `${from}->${to}`, source)
  }

  // Contradictory evidence: each side looks like it backs the other. Nothing
  // here can rank them, so neither claim belongs in the public risk graph.
  for (const edge of [...directed.values()]) {
    const opposite = `${edge.to}->${edge.from}`
    if (!directed.has(opposite)) continue
    directed.delete(`${edge.from}->${edge.to}`)
    directed.delete(opposite)
  }

  return [...directed.values()].toSorted(
    (a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to),
  )
}

function addSource(
  map: Map<string, TokenRelationsGraphEdge>,
  mapKey: string,
  edge: TokenRelationsGraphEdge,
): void {
  if (!map.has(mapKey)) map.set(mapKey, edge)
}

function addSourceTo(
  map: Map<string, TokenRelationsGraphEdge>,
  mapKey: string,
  source: TokenRelationsEdgeSource,
): void {
  const edge = map.get(mapKey)
  if (!edge) return
  addUniqueSource(edge.sources, source)
}

function sourceFromRoute(route: TokenRelationsRoute): TokenRelationsEdgeSource {
  return {
    plugin: route.plugin,
    bridgeType: route.bridgeType,
    chains: [...new Set([route.tokenAChain, route.tokenBChain])].toSorted(),
  }
}

function addUniqueSource(
  sources: TokenRelationsEdgeSource[],
  source: TokenRelationsEdgeSource,
): void {
  const existing = sources.find(
    (candidate) =>
      candidate.plugin === source.plugin &&
      candidate.bridgeType === source.bridgeType,
  )
  if (!existing) {
    sources.push(source)
    return
  }
  existing.chains = [
    ...new Set([...existing.chains, ...source.chains]),
  ].toSorted()
}
