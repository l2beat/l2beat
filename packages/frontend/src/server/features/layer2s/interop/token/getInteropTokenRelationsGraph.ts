import type { Project } from '@l2beat/config'
import type { InteropTransferDeployedTokenPairStats } from '@l2beat/database'
import { MANUAL_RELATION_PLUGIN, unique } from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { manifest } from '~/utils/Manifest'
import {
  createInteropProjectResolver,
  type InteropProjectResolver,
} from '../utils/createInteropProjectResolver'
import { deploymentTransferKey, transferTokenKey } from '../utils/deploymentKey'
import { INTEROP_CHAIN_DETAILS } from '../utils/interopChainDetails'
import {
  buildTokenRelationsGraph,
  type TokenRelationsGraphNode,
  type TokenRelationsGraphSource,
} from './buildTokenRelationsGraph'
import type { InteropTokenOnchainDeployment } from './getInteropTokenOnchainDeployments'
import type { InteropTokenRelations } from './getInteropTokenRelations'

export interface InteropTokenStats {
  volume: number | null
  transferCount: number | null
  avgDuration: number | null
}

export interface InteropTokenDeploymentView extends InteropTokenStats {
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
  deployments: InteropTokenDeploymentView[]
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

export function getInteropTokenRelationsGraph(
  tokenId: string,
  deployments: InteropTokenOnchainDeployment[],
  relations: InteropTokenRelations,
  projectsWithChains: Project<'chainConfig'>[],
  interopProjects: Project<'interopConfig'>[],
): InteropTokenRelationsGraph {
  const graph = buildTokenRelationsGraph(deployments, relations.routes)
  const resolveProjects = createInteropProjectResolver(interopProjects)

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

  const pairs = relations.pairStats ?? []
  const nodeStats = getNodeStats(graph.nodes, pairs)
  const deploymentStats = aggregateStats(pairs, transferTokenKey)

  function getStats(
    stats: InteropTokenStats | undefined,
    isSupported: boolean,
  ): InteropTokenStats {
    if (!relations.pairStats || !isSupported) {
      return { volume: null, transferCount: null, avgDuration: null }
    }
    return stats ?? { volume: 0, transferCount: 0, avgDuration: null }
  }

  const toDeployment = (
    deployment: InteropTokenOnchainDeployment,
  ): InteropTokenDeploymentView => {
    const chain = getChainDisplayInfo(deployment.chain, projectsWithChains)
    const key = deploymentTransferKey(deployment)
    return {
      chain: {
        id: deployment.chain,
        name: chain?.name ?? deployment.chain,
        iconUrl: chain?.iconUrl,
      },
      address: deployment.address,
      symbol: deployment.symbol,
      explorerUrl:
        chain?.explorerUrl && deployment.address.startsWith('0x')
          ? `${chain.explorerUrl}/address/${deployment.address}`
          : undefined,
      minters: resolveMinters(deployment, tokenId, resolveProjects),
      isSupported: deployment.isSupported,
      ...getStats(
        key ? deploymentStats.get(key) : undefined,
        deployment.isSupported,
      ),
    }
  }

  return {
    nodes: graph.nodes.map((node) => ({
      id: node.id,
      ...getStats(
        nodeStats.get(node.id),
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
      return resolveProjects({
        plugin,
        bridgeType,
        srcChain: deployment.chain,
        dstChain: relatedChain,
        srcAbstractTokenId: abstractTokenId,
      })
    },
  )

  return toInteropProjectIconListItems(projects)
}

function toInteropProjectIconListItems(
  projects: Project<'interopConfig'>[],
): ProjectIconListItem[] {
  return unique(projects, (project) => project.id)
    .map((project) => ({
      id: project.id,
      name: project.interopConfig.name ?? project.name,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      href: `/interop/protocols/${project.slug}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getChainDisplayInfo(
  chainId: string,
  projects: Project<'chainConfig'>[],
) {
  const chain = INTEROP_CHAIN_DETAILS.get(chainId)
  if (chain) return chain

  const project = projects.find(
    (project) => project.chainConfig.name === chainId,
  )
  return (
    project && {
      name: project.name,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      explorerUrl: project.chainConfig.explorerUrl,
    }
  )
}

/** Stats per node; a transfer counts once even when both ends are in the node. */
export function getNodeStats<T extends { chain: string; address: string }>(
  nodes: TokenRelationsGraphNode<T>[],
  pairStats: InteropTransferDeployedTokenPairStats[],
): Map<string, InteropTokenStats> {
  const nodeOf = new Map(
    nodes.flatMap((node) =>
      node.members.flatMap((member) => {
        const key = deploymentTransferKey(member)
        return key ? [[key, node.id] as const] : []
      }),
    ),
  )
  return aggregateStats(pairStats, (side) => nodeOf.get(transferTokenKey(side)))
}

/** Count a transfer once per group, even when both endpoints belong to it. */
function aggregateStats(
  rows: InteropTransferDeployedTokenPairStats[],
  groupOf: (side: { chain: string; address: string }) => string | undefined,
): Map<string, InteropTokenStats> {
  const sums = new Map<
    string,
    {
      volume: number
      transferCount: number
      transfersWithDurationCount: number
      totalDurationSum: number
    }
  >()
  for (const row of rows) {
    const groups = new Set([
      row.src && groupOf(row.src),
      row.dst && groupOf(row.dst),
    ])
    for (const group of groups) {
      if (group === undefined) continue
      const sum = sums.get(group) ?? {
        volume: 0,
        transferCount: 0,
        transfersWithDurationCount: 0,
        totalDurationSum: 0,
      }
      sum.volume += row.volume
      sum.transferCount += row.transferCount
      sum.transfersWithDurationCount += row.transfersWithDurationCount
      sum.totalDurationSum += row.totalDurationSum
      sums.set(group, sum)
    }
  }
  return new Map(
    [...sums].map(([group, sum]) => [
      group,
      {
        volume: sum.volume,
        transferCount: sum.transferCount,
        avgDuration:
          sum.transfersWithDurationCount > 0
            ? Math.floor(sum.totalDurationSum / sum.transfersWithDurationCount)
            : null,
      },
    ]),
  )
}
