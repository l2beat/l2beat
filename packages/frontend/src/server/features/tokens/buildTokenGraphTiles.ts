import type { AbstractTokenSummary, TokenRelationRoute } from '@l2beat/database'
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import { groupBy } from '~/utils/groupBy'
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
  linkableTokenIds: ReadonlySet<string>
  chainInfo: ReadonlyMap<string, TokenGraphTileChainInfo>
  resolveProjects: InteropProjectResolver
}

export function buildTokenGraphTiles({
  tokens,
  deployments,
  routes,
  volumeByTokenId,
  linkableTokenIds,
  chainInfo,
  resolveProjects,
}: BuildTokenGraphTilesInput): TokenGraphTile[] {
  const deploymentsByToken = groupBy(
    deployments.filter((d) => d.abstractTokenId !== null),
    (d) => d.abstractTokenId as string,
  )
  // Both endpoints must belong to the token, so bucketing by A loses nothing.
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
      href: linkableTokenIds.has(token.id)
        ? getInteropTokenUrl(token)
        : undefined,
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
      (b.volume ?? -1) - (a.volume ?? -1) ||
      a.symbol.localeCompare(b.symbol) ||
      a.id.localeCompare(b.id),
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
