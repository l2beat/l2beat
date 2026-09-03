import type { ProjectIconListItem } from '~/components/ProjectIconList'
import {
  aggregatePairStats,
  deploymentPairKey,
  type InteropTokenStats,
  NO_STATS,
  pairSideKey,
  pickStats,
} from '../utils/aggregatePairStats'
import type { createInteropProjectResolver } from '../utils/createInteropProjectResolver'
import { toInteropProjectIconListItems } from '../utils/toInteropProjectIconListItem'
import {
  buildTokenRelationsGraph,
  type TokenRelationsGraphSource,
} from './buildTokenRelationsGraph'
import {
  type ChainDisplayInfoMap,
  getExplorerAddressUrl,
} from './getChainDisplayInfo'
import type { InteropTokenOnchainDeployment } from './getInteropTokenOnchainDeployments'
import type { InteropTokenRelations } from './getInteropTokenRelations'

export interface InteropTokenRelationsDeployment extends InteropTokenStats {
  chain: { name: string; iconUrl: string | undefined }
  address: string
  symbol: string
  explorerUrl: string | undefined
}

export interface InteropTokenRelationsNode extends InteropTokenStats {
  id: string
  /** More than one means the deployments are in a burn-and-mint relation. */
  deployments: InteropTokenRelationsDeployment[]
  bridges: ProjectIconListItem[]
}

export interface InteropTokenRelationsEdge {
  /** `from` backs `to`. */
  from: string
  to: string
  bridges: ProjectIconListItem[]
}

export interface InteropTokenRelationsGraph {
  nodes: InteropTokenRelationsNode[]
  edges: InteropTokenRelationsEdge[]
}

/** Something to draw: an edge, or a cluster of deployments. */
export function hasTokenRelations(graph: InteropTokenRelationsGraph): boolean {
  return (
    graph.edges.length > 0 ||
    graph.nodes.some((node) => node.deployments.length > 1)
  )
}

export function getInteropTokenRelationsGraph(
  tokenId: string,
  deployments: InteropTokenOnchainDeployment[],
  relations: InteropTokenRelations,
  chainInfo: ChainDisplayInfoMap,
  resolveProjects: ReturnType<typeof createInteropProjectResolver>,
): InteropTokenRelationsGraph {
  const graph = buildTokenRelationsGraph(deployments, relations.routes)

  const resolveBridges = (sources: TokenRelationsGraphSource[]) =>
    toInteropProjectIconListItems(
      sources.flatMap((source) =>
        resolveProjects({
          plugin: source.plugin,
          bridgeType: source.bridgeType,
          srcChain: source.chains[0],
          dstChain: source.chains[1],
          srcAbstractTokenId: tokenId,
          dstAbstractTokenId: tokenId,
        }),
      ),
    )

  const nodeOf = new Map<string, string>()
  for (const node of graph.nodes) {
    for (const member of node.members) {
      const key = deploymentPairKey(member)
      if (key) nodeOf.set(key, node.id)
    }
  }
  const nodeStats =
    relations.pairStats &&
    aggregatePairStats(relations.pairStats, (side) =>
      nodeOf.get(pairSideKey(side)),
    )
  const deploymentStats =
    relations.pairStats && aggregatePairStats(relations.pairStats, pairSideKey)

  return {
    nodes: graph.nodes.map((node) => ({
      id: node.id,
      ...(node.members.some((member) => member.isSupported)
        ? pickStats(nodeStats, node.id)
        : NO_STATS),
      bridges: resolveBridges(node.sources),
      deployments: node.members
        .map((deployment) => {
          const chain = chainInfo.get(deployment.chain)
          return {
            chain: {
              name: chain?.name ?? deployment.chain,
              iconUrl: chain?.iconUrl,
            },
            address: deployment.address,
            symbol: deployment.symbol,
            explorerUrl: getExplorerAddressUrl(chain, deployment.address),
            ...(deployment.isSupported
              ? pickStats(deploymentStats, deploymentPairKey(deployment))
              : NO_STATS),
          }
        })
        .sort((a, b) => (b.volume ?? -1) - (a.volume ?? -1)),
    })),
    edges: graph.edges.map((edge) => ({
      from: edge.from,
      to: edge.to,
      bridges: resolveBridges(edge.sources),
    })),
  }
}
