import type { RouterOutputs } from '@l2beat/token-backend'

export type RelationGraph = RouterOutputs['deployedTokens']['getRelationsGraph']
export type RelationGraphNode = RelationGraph['nodes'][number]
export type RelationGraphRelation = RelationGraph['relations'][number]

export type RelationGraphSelection =
  | { type: 'node'; id: string }
  | { type: 'relation'; id: string }

export interface RelationGraphFocus {
  nodeIds: Set<string>
  relationIds: Set<string>
}

export const RELATION_COLORS = {
  burnAndMint: '#3b82f6',
  lockAndMint: '#ec4899',
  conflict: '#ef4444',
  muted: '#6b7280',
} as const

export const NODE_COLORS = {
  deployed: '#22c55e',
  missing: '#f97316',
} as const

/** Zoomed out to this scale or further, cluster labels are gone entirely. */
const CLUSTER_LABEL_FADE_OUT_SCALE = 0.15
/**
 * At this scale and closer, cluster labels are fully shown; between the two
 * scales they fade linearly. Raise both to make labels vanish sooner when
 * zooming out.
 */
const CLUSTER_LABEL_FULL_OPACITY_SCALE = 0.2
const CLUSTER_LABEL_MAX_OPACITY = 0.8
const SEARCH_RESULT_LIMIT = 5
const NODE_VISUAL_MAX_SCALE = 1.2

export function relationId(relation: RelationGraphRelation) {
  return [
    relation.tokenAChain,
    relation.tokenAAddress,
    relation.tokenBChain,
    relation.tokenBAddress,
    relation.plugin,
    relation.bridgeType,
  ].join(':')
}

export function relationPrimaryKey(relation: RelationGraphRelation) {
  return {
    tokenAChain: relation.tokenAChain,
    tokenAAddress: relation.tokenAAddress,
    tokenBChain: relation.tokenBChain,
    tokenBAddress: relation.tokenBAddress,
    plugin: relation.plugin,
    bridgeType: relation.bridgeType,
  }
}

/**
 * Where a drawn connection starts. The A/B slots are lexicographic, not a
 * direction, so for a directional relation the start is the locked token —
 * never the slot order.
 */
export function sourceId(relation: RelationGraphRelation) {
  return relation.lockedToken === 'B' ? idB(relation) : idA(relation)
}

export function targetId(relation: RelationGraphRelation) {
  return relation.lockedToken === 'B' ? idA(relation) : idB(relation)
}

function idA(relation: RelationGraphRelation) {
  return tokenId(relation.tokenAChain, relation.tokenAAddress)
}

function idB(relation: RelationGraphRelation) {
  return tokenId(relation.tokenBChain, relation.tokenBAddress)
}

export function tokenId(chain: string, address: string) {
  return `${chain}:${address.toLowerCase()}`
}

export function relationColor(relation: RelationGraphRelation) {
  switch (relation.bridgeType) {
    case 'burnAndMint':
      return RELATION_COLORS.burnAndMint
    case 'lockAndMint':
      return RELATION_COLORS.lockAndMint
    default:
      throw new Error(
        `Unexpected bridge type in relations graph: ${relation.bridgeType}`,
      )
  }
}

export function relationTypeLabel(relation: RelationGraphRelation) {
  switch (relation.bridgeType) {
    case 'burnAndMint':
      return 'Burn & Mint'
    case 'lockAndMint':
      return 'Lock & Mint'
    default:
      throw new Error(
        `Unexpected bridge type in relations graph: ${relation.bridgeType}`,
      )
  }
}

/**
 * An arrow is drawn only when the relation has a direction to show: a
 * lock-and-mint pair whose locked endpoint is identified. A burn-and-mint pair
 * is symmetric, and an unidentified locked endpoint would mean guessing.
 */
export function relationIsDirectional(relation: RelationGraphRelation) {
  switch (relation.bridgeType) {
    case 'burnAndMint':
      return false
    case 'lockAndMint':
      return relation.lockedToken !== null
    default:
      throw new Error(
        `Unexpected bridge type in relations graph: ${relation.bridgeType}`,
      )
  }
}

/** What the connection as a whole says about the two tokens. */
export function relationDirectionLabel(relation: RelationGraphRelation) {
  if (relationIsDirectional(relation)) return 'Locked → Minted'
  if (relation.bridgeType === 'burnAndMint') {
    return 'Both sides burn and mint'
  }
  return 'Locked endpoint not identified'
}

/** What one endpoint of the connection is to the other. */
export function relationRoleLabel(
  relation: RelationGraphRelation,
  nodeId: string,
) {
  // A burn-and-mint pair is symmetric — both endpoints are minted — so each
  // side's role reads Minted; the relation type label carries the symmetry.
  if (relation.bridgeType === 'burnAndMint') return 'Minted'
  if (relation.lockedToken === null) return 'Unknown role'
  return sourceId(relation) === nodeId ? 'Locked' : 'Minted'
}

export function nodeColor(node: RelationGraphNode) {
  return node.isDeployed ? NODE_COLORS.deployed : NODE_COLORS.missing
}

export function nodeLabel(node: RelationGraphNode) {
  return node.symbol ?? shortAddress(node.address)
}

export function mostCommonDeployedSymbol(nodes: RelationGraphNode[]) {
  return mostCommon(
    nodes
      .filter((node) => node.isDeployed)
      .map((node) => node.symbol)
      .filter((symbol) => symbol !== null),
  )
}

/**
 * The abstract token a cluster represents, decided by the same "most common
 * wins" rule as the cluster's symbol label. A cluster ultimately defines an
 * abstract token, so in practice almost all assigned members agree; the rare
 * dissenting assignment is outvoted.
 */
export function mostCommonAbstractTokenId(nodes: RelationGraphNode[]) {
  return mostCommon(
    nodes.map((node) => node.abstractTokenId).filter((id) => id !== null),
  )
}

/**
 * The nodes without relations sitting on chains that no relation touches.
 * The distinct chains among relation endpoints stand in for the list of
 * chains interop transfers support — relations are observed from interop
 * transfers, so a chain with any relation is a supported one — which keeps
 * this code free of any dependency on interop configuration. A token on any
 * other chain can never gain a relation in the current state, and the
 * `supported` display mode drops these nodes to show how much of the
 * without-relations volume they account for.
 */
export function getNodeIdsOutsideRelationChains(
  graph: RelationGraph,
): Set<string> {
  const relationChains = new Set(
    graph.relations.flatMap((relation) => [
      relation.tokenAChain,
      relation.tokenBChain,
    ]),
  )
  return new Set(
    graph.nodes
      .filter((node) => !node.hasRelations && !relationChains.has(node.chain))
      .map((node) => node.id),
  )
}

/**
 * Which tokens without relations (deployed tokens assigned to an abstract
 * token but observed in no relation) the graph displays: `hide` them all
 * (the graph as it was before they existed), show only the ones on
 * `supported` chains (chains some relation touches — the rest can never
 * gain a relation), or show `all` of them.
 */
export type TokensWithoutRelationsDisplayMode = 'hide' | 'supported' | 'all'

/**
 * Drops the without-relations nodes the display mode hides. This runs on the
 * graph payload, before the scene is built — unlike relation deletion, which
 * hides at draw time — so changing the mode re-runs the layout and the
 * clusters settle without the hidden nodes distorting their shape. Relations
 * need no filtering: a node without relations has none.
 */
export function filterTokensWithoutRelations(
  graph: RelationGraph,
  mode: TokensWithoutRelationsDisplayMode,
): RelationGraph {
  if (mode === 'all') return graph
  if (mode === 'hide') {
    return { ...graph, nodes: graph.nodes.filter((node) => node.hasRelations) }
  }
  const outsideIds = getNodeIdsOutsideRelationChains(graph)
  return {
    ...graph,
    nodes: graph.nodes.filter((node) => !outsideIds.has(node.id)),
  }
}

function mostCommon(values: string[]) {
  const counts = new Map<string, number>()
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return [...counts]
    .sort(
      ([valueA, countA], [valueB, countB]) =>
        countB - countA || valueA.localeCompare(valueB),
    )
    .at(0)?.[0]
}

/**
 * Cluster labels hang above their cluster, so they never cover nodes and can
 * stay visible at any zoom-in level. They only fade away at extreme zoom-out,
 * where clusters shrink to specks and neighboring labels would pile up into
 * unreadable overlap.
 */
export function getClusterLabelOpacity(scale: number) {
  assertGraphScale(scale)
  if (scale <= CLUSTER_LABEL_FADE_OUT_SCALE) return 0
  if (scale < CLUSTER_LABEL_FULL_OPACITY_SCALE) {
    const fadeRange =
      CLUSTER_LABEL_FULL_OPACITY_SCALE - CLUSTER_LABEL_FADE_OUT_SCALE
    return (
      CLUSTER_LABEL_MAX_OPACITY *
      ((scale - CLUSTER_LABEL_FADE_OUT_SCALE) / fadeRange)
    )
  }
  return CLUSTER_LABEL_MAX_OPACITY
}

export function getNodeVisualScale(scale: number) {
  assertGraphScale(scale)
  return Math.min(1, NODE_VISUAL_MAX_SCALE / scale)
}

export function getExistingRelationGraphSelection(
  graph: RelationGraph,
  selection: RelationGraphSelection | undefined,
  deletedRelationIds?: ReadonlySet<string>,
): RelationGraphSelection | undefined {
  if (selection === undefined) return undefined

  if (selection.type === 'node') {
    return graph.nodes.some((node) => node.id === selection.id)
      ? selection
      : undefined
  }
  const exists =
    !deletedRelationIds?.has(selection.id) &&
    graph.relations.some((relation) => relationId(relation) === selection.id)
  return exists ? selection : undefined
}

export function searchRelationGraphNodes(
  nodes: RelationGraphNode[],
  query: string,
): RelationGraphNode[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (normalizedQuery.length < 2) return []

  const terms = normalizedQuery.split(/\s+/)
  return nodes
    .filter((node) => {
      if (!node.isDeployed) return false
      const searchable = [node.symbol ?? '', node.chain, node.address, node.id]
        .join(' ')
        .toLowerCase()
      return terms.every((term) => searchable.includes(term))
    })
    .sort(
      (a, b) =>
        searchMatchRank(a, normalizedQuery) -
          searchMatchRank(b, normalizedQuery) ||
        nodeLabel(a).localeCompare(nodeLabel(b)) ||
        a.chain.localeCompare(b.chain) ||
        a.address.localeCompare(b.address),
    )
    .slice(0, SEARCH_RESULT_LIMIT)
}

function searchMatchRank(node: RelationGraphNode, query: string) {
  const symbol = node.symbol?.toLowerCase()
  const address = node.address.toLowerCase()
  if (address === query || node.id.toLowerCase() === query) return 0
  if (symbol === query) return 1
  if (symbol?.startsWith(query)) return 2
  if (address.startsWith(query)) return 3
  return 4
}

function assertGraphScale(scale: number) {
  if (!Number.isFinite(scale) || scale <= 0) {
    throw new Error('Graph scale must be a positive finite number')
  }
}

export function getRelationGraphFocus(
  graph: RelationGraph,
  selection: RelationGraphSelection | undefined,
  deletedRelationIds?: ReadonlySet<string>,
): RelationGraphFocus | undefined {
  if (selection === undefined) return undefined

  const nodeIds = new Set<string>()
  const relationIds = new Set<string>()

  if (selection.type === 'node') {
    nodeIds.add(selection.id)
    for (const relation of graph.relations) {
      if (deletedRelationIds?.has(relationId(relation))) continue
      const source = sourceId(relation)
      const target = targetId(relation)
      if (source !== selection.id && target !== selection.id) continue

      nodeIds.add(source)
      nodeIds.add(target)
      relationIds.add(relationId(relation))
    }
    return { nodeIds, relationIds }
  }

  const relation = graph.relations.find(
    (relation) => relationId(relation) === selection.id,
  )
  if (relation === undefined || deletedRelationIds?.has(selection.id)) {
    throw new Error(`Selected relation ${selection.id} is not in graph`)
  }
  nodeIds.add(sourceId(relation))
  nodeIds.add(targetId(relation))
  relationIds.add(selection.id)
  return { nodeIds, relationIds }
}

export function shortAddress(address: string) {
  if (address.length <= 14) return address
  return `${address.slice(0, 8)}…${address.slice(-4)}`
}

export function unorderedPairKey(a: string, b: string) {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}
