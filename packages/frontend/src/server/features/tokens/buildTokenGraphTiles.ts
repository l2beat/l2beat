import type { AbstractTokenRecord, DeployedTokenRecord } from '@l2beat/database'
import {
  buildTokenRelationsGraph,
  type TokenRelationsRoute,
} from '../scaling/interop/token/buildTokenRelationsGraph'
import { getAbstractTokenSlug } from '../scaling/interop/token/getAbstractTokenSlug'

/**
 * One card on /tokens: enough to draw a small picture of how a token exists
 * across chains, and nothing more.
 *
 * The catalogue is 6,000 tokens, so the whole grid travels in one payload —
 * addresses, explorer links and chain display names are all deliberately left
 * out. They belong to the full diagram, which is fetched per token when a card
 * is opened.
 */
export interface TokenGraphTileNode {
  id: string
  /** Chain ids of the node's deployments; more than one is a burn-mint group. */
  chains: string[]
}

export interface TokenGraphTileGraph {
  nodes: TokenGraphTileNode[]
  edges: { from: string; to: string; kind: 'backs' | 'related' }[]
  unconnectedNodeIds: string[]
}

export interface TokenGraphTile {
  id: string
  symbol: string
  slug: string
  issuer: string | null
  iconUrl: string | null
  deployments: number
  chains: number
  /** Last 24h volume across the snapshot; null when the token was not active. */
  volume: number | null
  /**
   * Whether the token has any observed relation at all. Not the same as having
   * edges: a token whose only relations are burn-and-mint collapses into a
   * single node with nothing drawn between anything, and that is still a
   * relation worth showing.
   */
  hasRelations: boolean
  graph: TokenGraphTileGraph
}

export interface BuildTokenGraphTilesInput {
  abstractTokens: Pick<
    AbstractTokenRecord,
    'id' | 'symbol' | 'issuer' | 'iconUrl'
  >[]
  deployedTokens: Pick<
    DeployedTokenRecord,
    'chain' | 'address' | 'symbol' | 'abstractTokenId'
  >[]
  routes: TokenRelationsRoute[]
  /** Summed 24h volume per abstract token id. */
  volumeByTokenId: Map<string, number>
}

export function buildTokenGraphTiles({
  abstractTokens,
  deployedTokens,
  routes,
  volumeByTokenId,
}: BuildTokenGraphTilesInput): TokenGraphTile[] {
  const deploymentsByToken = new Map<string, typeof deployedTokens>()
  for (const deployment of deployedTokens) {
    if (!deployment.abstractTokenId) continue
    const existing = deploymentsByToken.get(deployment.abstractTokenId)
    if (existing) existing.push(deployment)
    else deploymentsByToken.set(deployment.abstractTokenId, [deployment])
  }

  // Relations are keyed by endpoint, so bucket them by the token owning the
  // endpoint once rather than scanning all 3,000 for each of 6,000 tokens.
  const tokenOfDeployment = new Map<string, string>()
  for (const deployment of deployedTokens) {
    if (!deployment.abstractTokenId) continue
    tokenOfDeployment.set(
      endpointKey(deployment.chain, deployment.address),
      deployment.abstractTokenId,
    )
  }
  const routesByToken = new Map<string, TokenRelationsRoute[]>()
  for (const route of routes) {
    const tokenId = tokenOfDeployment.get(
      endpointKey(route.tokenAChain, route.tokenAAddress),
    )
    if (tokenId === undefined) continue
    const existing = routesByToken.get(tokenId)
    if (existing) existing.push(route)
    else routesByToken.set(tokenId, [route])
  }

  const tiles: TokenGraphTile[] = []
  for (const token of abstractTokens) {
    const deployments = deploymentsByToken.get(token.id)
    if (!deployments || deployments.length === 0) continue

    const tokenRoutes = routesByToken.get(token.id) ?? []
    const model = buildTokenRelationsGraph(deployments, tokenRoutes)

    const chainIds = new Set(deployments.map((d) => d.chain))

    tiles.push({
      id: token.id,
      symbol: token.symbol,
      slug: getAbstractTokenSlug(token),
      issuer: token.issuer,
      iconUrl: token.iconUrl,
      deployments: deployments.length,
      chains: chainIds.size,
      volume: volumeByTokenId.get(token.id) ?? null,
      hasRelations:
        model.edges.length > 0 ||
        model.nodes.some((node) => node.members.length > 1),
      graph: {
        nodes: model.nodes.map((node) => ({
          id: node.id,
          chains: node.members.map((member) => member.chain),
        })),
        edges: model.edges.map((edge) => ({
          from: edge.from,
          to: edge.to,
          kind: edge.kind,
        })),
        unconnectedNodeIds: model.unconnectedNodeIds,
      },
    })
  }

  return tiles.toSorted(
    (a, b) =>
      (b.volume ?? -1) - (a.volume ?? -1) || a.symbol.localeCompare(b.symbol),
  )
}

function endpointKey(chain: string, address: string): string {
  return `${chain}|${address.toLowerCase()}`
}
