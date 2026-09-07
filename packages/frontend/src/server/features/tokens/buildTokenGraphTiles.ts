import type { AbstractTokenSummary, TokenRelationRoute } from '@l2beat/database'
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import {
  buildTokenRelationsGraph,
  type TokenRelationsGraphSource,
} from '../layer2s/interop/token/buildTokenRelationsGraph'
import type { InteropProjectResolver } from '../layer2s/interop/utils/createInteropProjectResolver'
import { deploymentKey } from '../layer2s/interop/utils/deploymentKey'

export interface TokenGraphTileChain {
  id: string
  iconUrl: string | undefined
}

export interface TokenGraphTileNode {
  id: string
  /** More than one means the deployments are in a burn-and-mint relation. */
  chains: TokenGraphTileChain[]
}

export interface TokenGraphTileEdge {
  /** `from` backs `to`. */
  from: string
  to: string
}

/**
 * One card on the tokens page: enough to draw a small picture of how a token
 * exists across chains, and nothing more. Addresses, explorer links and
 * activity per deployment belong to the full graph, fetched when a card opens.
 */
export interface TokenGraphTile {
  id: string
  symbol: string
  issuer: string | null
  iconUrl: string
  href: string | undefined
  /** Past 24h crosschain volume; null when the token was not active. */
  volume: number | null
  /** Counted over the related deployments only, like the graph shows them. */
  deploymentsCount: number
  chainsCount: number
  /** Distinct interop projects identified behind the relations. */
  bridgesCount: number
  graph: {
    nodes: TokenGraphTileNode[]
    edges: TokenGraphTileEdge[]
  }
}

export interface TokenGraphTileDeployment {
  chain: string
  address: string
  abstractTokenId: string | null
}

export interface TokenGraphTileChainInfo {
  name: string
  iconUrl: string | undefined
}

export interface BuildTokenGraphTilesInput {
  tokens: AbstractTokenSummary[]
  deployments: TokenGraphTileDeployment[]
  routes: TokenRelationRoute[]
  volumeByTokenId: ReadonlyMap<string, number>
  chainInfo: ReadonlyMap<string, TokenGraphTileChainInfo>
  resolveProjects: InteropProjectResolver
}

/**
 * Tokens with at least one relation to draw, busiest first. Deployments with
 * no relation at all are left out of the tiles, mirroring the graph's default
 * of hiding them.
 */
export function buildTokenGraphTiles({
  tokens,
  deployments,
  routes,
  volumeByTokenId,
  chainInfo,
  resolveProjects,
}: BuildTokenGraphTilesInput): TokenGraphTile[] {
  const deploymentsByToken = groupBy(
    deployments.filter((d) => d.abstractTokenId !== null),
    (d) => d.abstractTokenId as string,
  )
  // A relation is relevant to a token only when both endpoints are its
  // deployments, so bucketing by the token owning endpoint A loses nothing.
  const tokenOfDeployment = new Map(
    deployments.flatMap((d) =>
      d.abstractTokenId ? [[deploymentKey(d), d.abstractTokenId]] : [],
    ),
  )
  const routesByToken = groupBy(routes, (route) =>
    tokenOfDeployment.get(
      deploymentKey({
        chain: route.tokenAChain,
        address: route.tokenAAddress,
      }),
    ),
  )
  const chainName = (chainId: string) => chainInfo.get(chainId)?.name ?? chainId

  const tiles: TokenGraphTile[] = []
  for (const token of tokens) {
    const graph = buildTokenRelationsGraph(
      deploymentsByToken.get(token.id) ?? [],
      routesByToken.get(token.id) ?? [],
    )
    const related = new Set(graph.edges.flatMap((edge) => [edge.from, edge.to]))
    const nodes = graph.nodes.filter(
      (node) => node.members.length > 1 || related.has(node.id),
    )
    if (nodes.length === 0) continue

    const members = nodes.flatMap((node) => node.members)
    const sources = [
      ...nodes.flatMap((node) => node.sources),
      ...graph.edges.flatMap((edge) => edge.sources),
    ]

    tiles.push({
      id: token.id,
      symbol: token.symbol,
      issuer: token.issuer,
      iconUrl: token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
      href: getInteropTokenUrl(token),
      volume: volumeByTokenId.get(token.id) ?? null,
      deploymentsCount: members.length,
      chainsCount: new Set(members.map((member) => member.chain)).size,
      bridgesCount: countBridges(sources, token.id, resolveProjects),
      graph: {
        nodes: nodes.map((node) => ({
          id: node.id,
          chains: node.members
            .map((member) => member.chain)
            .toSorted((a, b) => chainName(a).localeCompare(chainName(b)))
            .map((chain) => ({
              id: chain,
              iconUrl: chainInfo.get(chain)?.iconUrl,
            })),
        })),
        edges: graph.edges.map((edge) => ({ from: edge.from, to: edge.to })),
      },
    })
  }

  return tiles.toSorted(
    (a, b) =>
      (b.volume ?? -1) - (a.volume ?? -1) || a.symbol.localeCompare(b.symbol),
  )
}

function countBridges(
  sources: TokenRelationsGraphSource[],
  tokenId: string,
  resolveProjects: InteropProjectResolver,
): number {
  const projectIds = new Set<string>()
  for (const source of sources) {
    for (const project of resolveProjects({
      plugin: source.plugin,
      bridgeType: source.bridgeType,
      srcChain: source.chains[0],
      dstChain: source.chains[1],
      srcAbstractTokenId: tokenId,
      dstAbstractTokenId: tokenId,
    })) {
      projectIds.add(project.id)
    }
  }
  return projectIds.size
}

function groupBy<T, K>(items: T[], keyOf: (item: T) => K | undefined) {
  const groups = new Map<K, T[]>()
  for (const item of items) {
    const key = keyOf(item)
    if (key === undefined) continue
    const group = groups.get(key)
    if (group) group.push(item)
    else groups.set(key, [item])
  }
  return groups
}
