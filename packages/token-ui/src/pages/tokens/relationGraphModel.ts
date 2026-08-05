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

const CLUSTER_LABEL_FADE_OUT_SCALE = 0.05
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
  const counts = new Map<string, number>()
  for (const node of nodes) {
    if (!node.isDeployed || node.symbol === null) continue
    counts.set(node.symbol, (counts.get(node.symbol) ?? 0) + 1)
  }

  return [...counts]
    .sort(
      ([symbolA, countA], [symbolB, countB]) =>
        countB - countA || symbolA.localeCompare(symbolB),
    )
    .at(0)?.[0]
}

/**
 * Cluster labels take over when the graph is zoomed out too far for node
 * labels: invisible when zoomed in past 1x, fully visible in the overview
 * range, and fading away again at extreme zoom-out where even clusters are
 * specks.
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
  if (scale <= 0.6) return CLUSTER_LABEL_MAX_OPACITY
  if (scale >= 1) return 0
  return CLUSTER_LABEL_MAX_OPACITY * ((1 - scale) / 0.4)
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
