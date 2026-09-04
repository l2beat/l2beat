import type { ProjectIconListItem } from '~/components/ProjectIconList'
import type {
  InteropTokenRelationsDeployment,
  InteropTokenRelationsEdge,
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'

export function edgeKey(edge: { from: string; to: string }): string {
  return `${edge.from}->${edge.to}`
}

export function isCluster(node: InteropTokenRelationsNode): boolean {
  return node.deployments.length > 1
}

export function describeNode(node: InteropTokenRelationsNode): string {
  const first = node.deployments[0]
  if (!first) return node.id
  return isCluster(node)
    ? `${first.symbol} · ${node.deployments.length} deployments`
    : `${first.symbol} on ${first.chain.name}`
}

/** Single deployments with no relation at all; a cluster is related by definition. */
export function getUnconnectedIds(
  graph: InteropTokenRelationsGraph,
): Set<string> {
  const related = new Set(graph.edges.flatMap((edge) => [edge.from, edge.to]))
  return new Set(
    graph.nodes
      .filter((node) => !isCluster(node) && !related.has(node.id))
      .map((node) => node.id),
  )
}

/** Every backer upstream plus what the node directly backs: the chain worth highlighting. */
export function getActiveBacking(
  edges: InteropTokenRelationsEdge[],
  activeId: string,
): { nodeIds: Set<string>; edgeKeys: Set<string> } {
  const nodeIds = new Set([activeId])
  const edgeKeys = new Set<string>()
  const queue = [activeId]
  for (const current of queue) {
    for (const edge of edges) {
      if (edge.to !== current) continue
      edgeKeys.add(edgeKey(edge))
      if (!nodeIds.has(edge.from)) {
        nodeIds.add(edge.from)
        queue.push(edge.from)
      }
    }
  }
  for (const edge of edges) {
    if (edge.from !== activeId) continue
    edgeKeys.add(edgeKey(edge))
    nodeIds.add(edge.to)
  }
  return { nodeIds, edgeKeys }
}

export interface RelationsPath {
  nodes: InteropTokenRelationsNode[]
  edges: InteropTokenRelationsEdge[]
  /** False when cut short by the depth limit or a cycle. */
  complete: boolean
}

const MAX_PATH_DEPTH = 10
const MAX_PATHS = 16

/**
 * Paths from the node to its sources (`backing`, source first) or to the
 * deployments it backs (`backed`, node first). Complete and longer paths come first.
 */
export function getRelationsPaths(
  graph: InteropTokenRelationsGraph,
  nodeId: string,
  direction: 'backing' | 'backed',
): RelationsPath[] {
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]))
  const start = nodesById.get(nodeId)
  if (!start) return []
  const [at, next] =
    direction === 'backing'
      ? (['to', 'from'] as const)
      : (['from', 'to'] as const)

  const walk = (
    current: InteropTokenRelationsNode,
    visited: Set<string>,
    depth: number,
  ): RelationsPath[] => {
    const outgoing = graph.edges
      .filter((edge) => edge[at] === current.id && nodesById.has(edge[next]))
      .toSorted(
        (a, b) =>
          (nodesById.get(b[next])?.volume ?? -1) -
          (nodesById.get(a[next])?.volume ?? -1),
      )
    if (outgoing.length === 0)
      return [{ nodes: [current], edges: [], complete: true }]
    if (depth >= MAX_PATH_DEPTH)
      return [{ nodes: [current], edges: [], complete: false }]

    const paths: RelationsPath[] = []
    for (const edge of outgoing) {
      const node = nodesById.get(edge[next]) as InteropTokenRelationsNode
      if (visited.has(node.id)) continue
      for (const tail of walk(
        node,
        new Set([...visited, node.id]),
        depth + 1,
      )) {
        paths.push(
          direction === 'backing'
            ? {
                nodes: [...tail.nodes, current],
                edges: [...tail.edges, edge],
                complete: tail.complete,
              }
            : {
                nodes: [current, ...tail.nodes],
                edges: [edge, ...tail.edges],
                complete: tail.complete,
              },
        )
        if (paths.length >= MAX_PATHS) return paths
      }
    }
    return paths.length > 0
      ? paths
      : [{ nodes: [current], edges: [], complete: false }]
  }

  return walk(start, new Set([start.id]), 0)
    .filter((path) => path.edges.length > 0)
    .toSorted(
      (a, b) =>
        Number(b.complete) - Number(a.complete) ||
        b.nodes.length - a.nodes.length,
    )
}

export interface SameChainComparison {
  chain: InteropTokenRelationsDeployment['chain']
  /** Every deployment of the token on the chain, busiest first. */
  ranked: {
    node: InteropTokenRelationsNode
    deployment: InteropTokenRelationsDeployment
    selected: boolean
  }[]
  /** 1-based position of the node's deployment; undefined without volume data. */
  rank: number | undefined
}

/** How the node's deployments rank against the token's other deployments on the same chains. */
export function getSameChainComparisons(
  graph: InteropTokenRelationsGraph,
  node: InteropTokenRelationsNode,
): SameChainComparison[] {
  const all = graph.nodes.flatMap((candidate) =>
    candidate.deployments.map((deployment) => ({
      node: candidate,
      deployment,
      selected: candidate.id === node.id,
    })),
  )
  return node.deployments
    .flatMap((own) => {
      const ranked = all
        .filter((item) => item.deployment.chain.id === own.chain.id)
        .toSorted(
          (a, b) => (b.deployment.volume ?? -1) - (a.deployment.volume ?? -1),
        )
      if (ranked.length <= 1) return []
      const index = ranked.findIndex(
        (item) => item.selected && item.deployment.address === own.address,
      )
      return [
        {
          chain: own.chain,
          ranked,
          rank: own.volume === null ? undefined : index + 1,
          volume: own.volume ?? -1,
        },
      ]
    })
    .toSorted((a, b) => b.volume - a.volume)
    .map(({ volume: _, ...comparison }) => comparison)
}

export interface BackedGroups {
  /** Every directly backed node with the bridges minting it, busiest first. */
  direct: { node: InteropTokenRelationsNode; bridges: ProjectIconListItem[] }[]
  /** Paths reaching further than one hop. */
  nested: RelationsPath[]
}

export function groupBackedPaths(paths: RelationsPath[]): BackedGroups {
  const direct = new Map<string, BackedGroups['direct'][number]>()
  const nested: RelationsPath[] = []
  for (const path of paths) {
    const target = path.nodes[1]
    if (!target) continue
    if (path.nodes.length > 2) nested.push(path)
    if (!direct.has(target.id)) {
      direct.set(target.id, {
        node: target,
        bridges: path.edges[0]?.bridges ?? [],
      })
    }
  }
  return { direct: [...direct.values()], nested }
}
