import type {
  AbstractTokenSummary,
  DeployedTokenAssignment,
  TokenRelationRoute,
} from '@l2beat/database'
import { getUnconnectedIds } from '~/components/projects/sections/interop/onchain-deployments/relations-graph/graphSelectors'
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import { endpointKey } from '../layer2s/interop/token/buildTokenRelationsGraph'
import type { InteropTokenRelationsGraph } from '../layer2s/interop/token/getInteropTokenRelationsGraph'
import { deploymentKey } from '../layer2s/interop/utils/deploymentKey'

export interface TokenGraphTileChain {
  id: string
  iconUrl: string | undefined
}

export interface TokenGraphTileNode {
  id: string
  /** More than one means the deployments are in a burn-and-mint relation. */
  chains: TokenGraphTileChain[]
  /** The full graph node's volume: null off the active chains. */
  volume: number | null
}

export interface TokenGraphTileEdge {
  backer: string
  backed: string
}

export interface TokenGraphTile {
  id: string
  symbol: string
  issuer: string | null
  iconUrl: string
  /** Undefined when the interop token page would not resolve the token. */
  href: string | undefined
  volume: number | null
  /** Over related deployments only, like the graph shows them by default. */
  deploymentsCount: number
  chainsCount: number
  bridgesCount: number
  graph: {
    nodes: TokenGraphTileNode[]
    edges: TokenGraphTileEdge[]
  }
}

interface TokenRelationInputs {
  deployedTokens: DeployedTokenAssignment[]
  /** Every relation touching one of the deployed tokens. */
  routes: TokenRelationRoute[]
}

/** Each token's deployments, ignored ones aside, and the relations touching them. */
export function groupRelationInputsByToken(
  assignments: DeployedTokenAssignment[],
  routes: TokenRelationRoute[],
): Map<string, TokenRelationInputs> {
  const deployedTokens = assignments.filter(
    (token) => !token.ignored && token.abstractTokenId !== null,
  )
  const tokenOf = new Map(
    deployedTokens.map((token) => [
      deploymentKey(token),
      token.abstractTokenId,
    ]),
  )

  const routesByToken = new Map<string, TokenRelationRoute[]>()
  for (const route of routes) {
    const tokenIds = new Set(
      (['A', 'B'] as const).map((slot) =>
        tokenOf.get(endpointKey(route, slot)),
      ),
    )
    for (const tokenId of tokenIds) {
      if (!tokenId) continue
      const tokenRoutes = routesByToken.get(tokenId) ?? []
      tokenRoutes.push(route)
      routesByToken.set(tokenId, tokenRoutes)
    }
  }

  const inputs = new Map<string, TokenRelationInputs>()
  for (const token of deployedTokens) {
    const tokenId = token.abstractTokenId
    if (!tokenId) continue
    const entry = inputs.get(tokenId) ?? {
      deployedTokens: [],
      routes: routesByToken.get(tokenId) ?? [],
    }
    entry.deployedTokens.push(token)
    inputs.set(tokenId, entry)
  }
  return inputs
}

/** Hides unconnected deployments like the full view; undefined if none remain. */
export function toTokenGraphTile(
  token: AbstractTokenSummary,
  graph: InteropTokenRelationsGraph,
  { volume, linkable }: { volume: number | null; linkable: boolean },
): TokenGraphTile | undefined {
  const unconnected = getUnconnectedIds(graph)
  const nodes = graph.nodes.filter((node) => !unconnected.has(node.id))
  if (nodes.length === 0) return undefined

  const deployments = nodes.flatMap((node) => node.deployments)
  const bridgeIds = [...nodes, ...graph.edges].flatMap((item) =>
    item.bridges.map((bridge) => bridge.id),
  )

  return {
    id: token.id,
    symbol: token.symbol,
    issuer: token.issuer,
    iconUrl: token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
    href: linkable ? getInteropTokenUrl(token) : undefined,
    volume,
    deploymentsCount: deployments.length,
    chainsCount: new Set(deployments.map((deployment) => deployment.chain.id))
      .size,
    bridgesCount: new Set(bridgeIds).size,
    graph: {
      nodes: nodes.map((node) => ({
        id: node.id,
        volume: node.volume,
        chains: node.deployments
          .map((deployment) => deployment.chain)
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .map((chain) => ({ id: chain.id, iconUrl: chain.iconUrl })),
      })),
      edges: graph.edges.map((edge) => ({
        backer: edge.backer,
        backed: edge.backed,
      })),
    },
  }
}

export function compareTokenGraphTiles(
  a: TokenGraphTile,
  b: TokenGraphTile,
): number {
  return (
    (b.volume ?? -1) - (a.volume ?? -1) ||
    a.symbol.localeCompare(b.symbol) ||
    a.id.localeCompare(b.id)
  )
}
