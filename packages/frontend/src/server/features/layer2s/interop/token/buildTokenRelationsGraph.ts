import type { TokenRelationRoute } from '@l2beat/database'
import { MANUAL_RELATION_PLUGIN } from '@l2beat/shared-pure'

type GraphBridgeType = 'burnAndMint' | 'lockAndMint'

export interface TokenRelationsGraphSource {
  plugin: string
  bridgeType: GraphBridgeType
  chains: [string, string]
}

export interface TokenRelationsGraphNode<T> {
  id: string
  members: T[]
  sources: TokenRelationsGraphSource[]
}

export interface TokenRelationsGraphEdge {
  /** `from` backs `to`. */
  from: string
  to: string
  sources: TokenRelationsGraphSource[]
}

export interface TokenRelationsGraph<T> {
  nodes: TokenRelationsGraphNode<T>[]
  edges: TokenRelationsGraphEdge[]
}

interface Endpoint {
  chain: string
  address: string
}

type GraphRoute = TokenRelationRoute & { bridgeType: GraphBridgeType }

export function deploymentKey(token: Endpoint): string {
  return `${token.chain}|${token.address.toLowerCase()}`
}

/**
 * Burn-and-mint relations are symmetric, so the deployments they connect
 * collapse into one node. Lock-and-mint relations become edges from the
 * locked side; those without a known locked side, and pairs claiming both
 * directions, are omitted.
 */
export function buildTokenRelationsGraph<T extends Endpoint>(
  deployments: T[],
  routes: TokenRelationRoute[],
): TokenRelationsGraph<T> {
  const byKey = new Map(deployments.map((d) => [deploymentKey(d), d]))
  const relevant = routes.filter(
    (route): route is GraphRoute =>
      route.plugin !== MANUAL_RELATION_PLUGIN &&
      (route.bridgeType === 'burnAndMint' ||
        route.bridgeType === 'lockAndMint') &&
      byKey.has(endpointKey(route, 'A')) &&
      byKey.has(endpointKey(route, 'B')),
  )
  const groupOf = groupBurnAndMint([...byKey.keys()], relevant)

  const nodes = new Map<string, TokenRelationsGraphNode<T>>()
  for (const [key, groupId] of groupOf) {
    const node = nodes.get(groupId) ?? { id: groupId, members: [], sources: [] }
    node.members.push(byKey.get(key) as T)
    nodes.set(groupId, node)
  }

  const edges = new Map<string, TokenRelationsGraphEdge>()
  for (const route of relevant) {
    if (route.bridgeType === 'burnAndMint') {
      const node = nodes.get(groupOf.get(endpointKey(route, 'A')) as string)
      if (node) addSource(node.sources, route)
      continue
    }
    if (route.lockedToken === null) continue
    const from = groupOf.get(endpointKey(route, route.lockedToken)) as string
    const to = groupOf.get(
      endpointKey(route, route.lockedToken === 'A' ? 'B' : 'A'),
    ) as string
    if (from === to) continue
    const edge = edges.get(`${from}->${to}`) ?? { from, to, sources: [] }
    addSource(edge.sources, route)
    edges.set(`${from}->${to}`, edge)
  }
  for (const edge of [...edges.values()]) {
    if (edges.has(`${edge.to}->${edge.from}`)) {
      edges.delete(`${edge.from}->${edge.to}`)
      edges.delete(`${edge.to}->${edge.from}`)
    }
  }

  return {
    nodes: [...nodes.values()]
      .map((node) => ({
        ...node,
        members: node.members.toSorted((a, b) =>
          deploymentKey(a).localeCompare(deploymentKey(b)),
        ),
      }))
      .toSorted((a, b) => a.id.localeCompare(b.id)),
    edges: [...edges.values()].toSorted(
      (a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to),
    ),
  }
}

function endpointKey(route: TokenRelationRoute, slot: 'A' | 'B'): string {
  return deploymentKey({
    chain: route[`token${slot}Chain`],
    address: route[`token${slot}Address`],
  })
}

/** Union-find keyed so that a group's id is its smallest member key. */
function groupBurnAndMint(
  keys: string[],
  routes: GraphRoute[],
): Map<string, string> {
  const parent = new Map(keys.map((key) => [key, key]))
  const find = (key: string): string => {
    let root = key
    while (parent.get(root) !== root) root = parent.get(root) as string
    parent.set(key, root)
    return root
  }
  for (const route of routes) {
    if (route.bridgeType !== 'burnAndMint') continue
    const a = find(endpointKey(route, 'A'))
    const b = find(endpointKey(route, 'B'))
    if (a < b) parent.set(b, a)
    else if (b < a) parent.set(a, b)
  }
  return new Map(keys.map((key) => [key, find(key)]))
}

function addSource(sources: TokenRelationsGraphSource[], route: GraphRoute) {
  const chains: [string, string] = [route.tokenAChain, route.tokenBChain]
  const exists = sources.some(
    (source) =>
      source.plugin === route.plugin &&
      source.bridgeType === route.bridgeType &&
      source.chains[0] === chains[0] &&
      source.chains[1] === chains[1],
  )
  if (!exists) {
    sources.push({ plugin: route.plugin, bridgeType: route.bridgeType, chains })
  }
}
