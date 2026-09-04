import { MANUAL_RELATION_PLUGIN } from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { getLogger } from '~/server/utils/logger'
import type { InteropProjectResolver } from '../utils/createInteropProjectResolver'
import {
  createStatsLookup,
  type InteropTokenStats,
} from '../utils/createStatsLookup'
import { deploymentTransferKey, transferTokenKey } from '../utils/deploymentKey'
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

const logger = getLogger().for('getInteropTokenRelationsGraph')

export interface InteropTokenRelationsDeployment extends InteropTokenStats {
  chain: { id: string; name: string; iconUrl: string | undefined }
  address: string
  symbol: string
  explorerUrl: string | undefined
  minters: ProjectIconListItem[]
  isSupported: boolean
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
  resolveProjects: InteropProjectResolver,
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

  const nodeOf = new Map(
    graph.nodes.flatMap((node) =>
      node.members.flatMap((member) => {
        const key = deploymentTransferKey(member)
        return key ? [[key, node.id] as const] : []
      }),
    ),
  )
  const nodeStats = createStatsLookup(relations.pairStats, (side) =>
    nodeOf.get(transferTokenKey(side)),
  )
  const deploymentStats = createStatsLookup(
    relations.pairStats,
    transferTokenKey,
  )

  const toDeployment = (
    deployment: InteropTokenOnchainDeployment,
  ): InteropTokenRelationsDeployment => {
    const chain = chainInfo.get(deployment.chain)
    return {
      chain: {
        id: deployment.chain,
        name: chain?.name ?? deployment.chain,
        iconUrl: chain?.iconUrl,
      },
      address: deployment.address,
      symbol: deployment.symbol,
      explorerUrl: getExplorerAddressUrl(chain, deployment.address),
      minters: resolveMinters(deployment, tokenId, resolveProjects),
      isSupported: deployment.isSupported,
      ...deploymentStats(
        deploymentTransferKey(deployment),
        deployment.isSupported,
      ),
    }
  }

  return {
    nodes: graph.nodes.map((node) => ({
      id: node.id,
      ...nodeStats(
        node.id,
        node.members.some((member) => member.isSupported),
      ),
      bridges: resolveBridges(node.sources),
      deployments: node.members
        .map(toDeployment)
        .sort((a, b) => (b.volume ?? -1) - (a.volume ?? -1)),
    })),
    edges: graph.edges.map((edge) => ({
      from: edge.from,
      to: edge.to,
      bridges: resolveBridges(edge.sources),
    })),
  }
}

function resolveMinters(
  deployment: InteropTokenOnchainDeployment,
  abstractTokenId: string,
  resolveProjects: InteropProjectResolver,
): ProjectIconListItem[] {
  const projects = deployment.mintingPlugins.flatMap(
    ({ plugin, bridgeType, relatedChain }) => {
      // A manually added relation names no interop plugin, so it can never
      // resolve to an interop project. Skipped deliberately — not warned
      // about — until the public site decides how to present manual bridges.
      if (plugin === MANUAL_RELATION_PLUGIN) {
        return []
      }
      // Sides are arbitrary — the matcher is symmetric. A relation records
      // only the minted endpoint's abstract token, hence no dstAbstractTokenId.
      const matched = resolveProjects({
        plugin,
        bridgeType,
        srcChain: deployment.chain,
        dstChain: relatedChain,
        srcAbstractTokenId: abstractTokenId,
      })

      if (matched.length === 0) {
        logger.warn('Could not resolve minting plugin to an interop project', {
          plugin,
          bridgeType,
          chain: deployment.chain,
          relatedChain,
          address: deployment.address,
          abstractTokenId,
        })
      }

      return matched
    },
  )

  return toInteropProjectIconListItems(projects)
}
