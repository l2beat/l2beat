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

const CLUSTER_LABEL_MIN_SCALE = 0.25
const CLUSTER_LABEL_FADE_OUT_SCALE = 0.05
const CLUSTER_LABEL_FULL_OPACITY_SCALE = 0.2
const CLUSTER_LABEL_MAX_OPACITY = 0.8
const SEARCH_RESULT_LIMIT = 12

export function relationId(relation: RelationGraphRelation) {
  return [
    relation.tokenFromChain,
    relation.tokenFromAddress,
    relation.tokenToChain,
    relation.tokenToAddress,
    relation.plugin,
    relation.bridgeType,
  ].join(':')
}

export function relationPrimaryKey(relation: RelationGraphRelation) {
  return {
    tokenFromChain: relation.tokenFromChain,
    tokenFromAddress: relation.tokenFromAddress,
    tokenToChain: relation.tokenToChain,
    tokenToAddress: relation.tokenToAddress,
    plugin: relation.plugin,
    bridgeType: relation.bridgeType,
  }
}

export function sourceId(relation: RelationGraphRelation) {
  return tokenId(relation.tokenFromChain, relation.tokenFromAddress)
}

export function targetId(relation: RelationGraphRelation) {
  return tokenId(relation.tokenToChain, relation.tokenToAddress)
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

export function getClusterLabelStyle(scale: number) {
  if (!Number.isFinite(scale) || scale <= 0) {
    throw new Error('Graph scale must be a positive finite number')
  }

  const clampedScale = Math.max(scale, CLUSTER_LABEL_MIN_SCALE)
  return {
    fontSize: 18 / clampedScale,
    strokeWidth: 4 / clampedScale,
    opacity: clusterLabelOpacity(scale),
  }
}

export function getExistingRelationGraphSelection(
  graph: RelationGraph,
  selection: RelationGraphSelection | undefined,
): RelationGraphSelection | undefined {
  if (selection === undefined) return undefined

  const exists =
    selection.type === 'node'
      ? graph.nodes.some((node) => node.id === selection.id)
      : graph.relations.some(
          (relation) => relationId(relation) === selection.id,
        )
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

function clusterLabelOpacity(scale: number) {
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

export function getRelationGraphFocus(
  graph: RelationGraph,
  selection: RelationGraphSelection | undefined,
): RelationGraphFocus | undefined {
  if (selection === undefined) return undefined

  const nodeIds = new Set<string>()
  const relationIds = new Set<string>()

  if (selection.type === 'node') {
    nodeIds.add(selection.id)
    for (const relation of graph.relations) {
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
  if (relation === undefined) {
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
