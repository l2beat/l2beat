import type { Project } from '@l2beat/config'
import { Address32, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getTokenDb } from '~/server/tokenDb'
import { manifest } from '~/utils/Manifest'
import {
  createMintingBridgeResolver,
  interopDisplayName,
} from '../utils/createMintingBridgeResolver'
import { getAggregatedInteropSnapshotTimestamp } from '../utils/getAggregatedInteropTimestamp'
import {
  buildTokenRelationsGraph,
  type TokenRelationsEdgeSource,
  type TokenRelationsGraphEdge,
  type TokenRelationsGraphNode,
} from './buildTokenRelationsGraph'
import type { ChainDisplayInfoMap } from './getChainDisplayInfo'
import type { InteropTokenOnchainDeployment } from './getInteropTokenOnchainDeployments'

export interface InteropTokenRelationsDeployment {
  chain: string
  chainName: string
  iconUrl: string | undefined
  address: string
  symbol: string
  explorerUrl: string | undefined
  /** Past 24h crosschain volume; null when the snapshot has no data. */
  volume: number | null
  /** Past 24h crosschain transfer count; null when the snapshot has no data. */
  transferCount: number | null
  /** Average crosschain transfer time in seconds; null when unavailable. */
  avgDuration: number | null
}

export interface InteropTokenRelationsNode {
  id: string
  /** More than one means the deployments are in a burn-mint relation. */
  deployments: InteropTokenRelationsDeployment[]
  /** The bridges putting those deployments in a burn-mint relation. */
  bridges: UsedInProjectWithIcon[]
  /** Past 24h crosschain volume, counting each transfer touching this node once. */
  volume: number | null
  /** Past 24h crosschain transfers, deduplicated within this node. */
  transferCount: number | null
  /** Average time across the node's unique transfers with a duration. */
  avgDuration: number | null
}

interface NodeActivity {
  transferCount: number
  transfersWithDurationCount: number
  totalDurationSum: number
  volume: number
}

export interface InteropTokenRelationsEdge {
  /** `from` is the backing side. */
  from: string
  to: string
  kind: 'backs'
  bridges: UsedInProjectWithIcon[]
}

export interface InteropTokenRelationsGraph {
  nodes: InteropTokenRelationsNode[]
  edges: InteropTokenRelationsEdge[]
  unconnectedNodeIds: string[]
}

export async function getInteropTokenRelationsGraph(
  tokenId: string,
  deployments: InteropTokenOnchainDeployment[],
  chainInfo: ChainDisplayInfoMap,
  interopProjects: Project<'interopConfig'>[],
): Promise<InteropTokenRelationsGraph> {
  if (env.MOCK) {
    return MOCK_INTEROP_TOKEN_RELATIONS_GRAPH
  }
  const supportedDeployments = deployments.filter(
    (deployment) => deployment.isSupported,
  )
  if (supportedDeployments.length === 0) {
    return { nodes: [], edges: [], unconnectedNodeIds: [] }
  }

  const [routes, snapshotTimestamp] = await Promise.all([
    getTokenDb().tokenRelation.getRoutesBetween(
      supportedDeployments.map((d) => ({
        chain: d.chain,
        address: d.address,
      })),
    ),
    getAggregatedInteropSnapshotTimestamp(),
  ])
  const model = buildTokenRelationsGraph(supportedDeployments, routes)

  const nodeActivityById = snapshotTimestamp
    ? new Map(
        (
          await getDb().interopTransfer.getUniqueTokenGroupStats(
            model.nodes.map((node) => ({
              id: node.id,
              abstractTokenId: tokenId,
              tokens: node.members.flatMap((member) => {
                const tokenAddress = Address32.fromOrUndefined(member.address)
                return tokenAddress
                  ? [{ chain: member.chain, tokenAddress }]
                  : []
              }),
            })),
            {
              from: snapshotTimestamp - UnixTime.DAY,
              to: snapshotTimestamp,
            },
          )
        ).map((activity) => [activity.id, activity]),
      )
    : undefined

  const deploymentByKey = new Map(
    supportedDeployments.map((deployment) => [
      `${deployment.chain}|${deployment.address.toLowerCase()}`,
      deployment,
    ]),
  )
  const resolveBridges = createMintingBridgeResolver(interopProjects)
  const nodes = model.nodes.map((node) =>
    toNode(
      node,
      chainInfo,
      tokenId,
      resolveBridges,
      deploymentByKey,
      nodeActivityById,
    ),
  )

  return {
    nodes,
    edges: model.edges.map((edge) => toEdge(edge, tokenId, resolveBridges)),
    unconnectedNodeIds: model.unconnectedNodeIds,
  }
}

function toNode(
  node: TokenRelationsGraphNode,
  chainInfo: ChainDisplayInfoMap,
  tokenId: string,
  resolveBridges: ReturnType<typeof createMintingBridgeResolver>,
  deploymentByKey: Map<string, InteropTokenOnchainDeployment>,
  nodeActivityById: Map<string, NodeActivity> | undefined,
): InteropTokenRelationsNode {
  const activity = nodeActivityById?.get(node.id)

  const deployments = node.members
    .map((member) => {
      const chain = chainInfo.get(member.chain)
      const activity = deploymentByKey.get(
        `${member.chain}|${member.address.toLowerCase()}`,
      )
      return {
        chain: member.chain,
        chainName: chain?.name ?? member.chain,
        iconUrl: chain?.iconUrl,
        address: member.address,
        symbol: member.symbol,
        explorerUrl:
          chain?.explorerUrl && member.address.startsWith('0x')
            ? `${chain.explorerUrl}/address/${member.address}`
            : undefined,
        volume: activity?.volume ?? null,
        transferCount: activity?.transferCount ?? null,
        avgDuration: activity?.avgDuration ?? null,
      }
    })
    .toSorted(
      (a, b) =>
        (b.volume ?? -1) - (a.volume ?? -1) ||
        a.chainName.localeCompare(b.chainName) ||
        a.address.localeCompare(b.address),
    )

  return {
    id: node.id,
    volume: nodeActivityById ? (activity?.volume ?? 0) : null,
    transferCount: nodeActivityById ? (activity?.transferCount ?? 0) : null,
    avgDuration:
      activity && activity.transfersWithDurationCount > 0
        ? Math.round(
            activity.totalDurationSum / activity.transfersWithDurationCount,
          )
        : null,
    bridges: resolveSources(node.sources, tokenId, resolveBridges),
    deployments,
  }
}

function toEdge(
  edge: TokenRelationsGraphEdge,
  tokenId: string,
  resolveBridges: ReturnType<typeof createMintingBridgeResolver>,
): InteropTokenRelationsEdge {
  return {
    from: edge.from,
    to: edge.to,
    kind: edge.kind,
    bridges: resolveSources(edge.sources, tokenId, resolveBridges),
  }
}

/**
 * The bridging projects behind a set of plugin observations. A project can
 * qualify its plugin by chain, so only the exact chains retained from each raw
 * route are candidates after several deployments collapse into one node.
 */
function resolveSources(
  sources: TokenRelationsEdgeSource[],
  tokenId: string,
  resolveBridges: ReturnType<typeof createMintingBridgeResolver>,
): UsedInProjectWithIcon[] {
  const byId = new Map<string, UsedInProjectWithIcon>()
  for (const source of sources) {
    for (const chain of source.chains) {
      for (const project of resolveBridges({
        plugin: source.plugin,
        bridgeType: source.bridgeType,
        chain,
        abstractTokenId: tokenId,
      })) {
        if (byId.has(project.id)) continue
        byId.set(project.id, {
          id: project.id,
          name: interopDisplayName(project),
          slug: project.slug,
          icon: manifest.getUrl(`/icons/${project.slug}.png`),
          url: `/interop/protocols/${project.slug}`,
        })
      }
    }
  }
  return [...byId.values()].toSorted((a, b) => a.name.localeCompare(b.name))
}

const MOCK_INTEROP_TOKEN_RELATIONS_GRAPH: InteropTokenRelationsGraph = {
  nodes: [
    {
      id: 'arbitrum|0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      volume: 6_990_000,
      transferCount: 528,
      avgDuration: 23,
      bridges: [
        {
          id: ProjectId('cctpv2'),
          name: 'CCTP v2',
          slug: 'cctpv2',
          icon: '/icons/cctpv2.png',
          url: '/interop/protocols/cctpv2',
        },
      ],
      deployments: [
        {
          chain: 'ethereum',
          chainName: 'Ethereum',
          iconUrl: '/icons/ethereum.png',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          symbol: 'USDC',
          explorerUrl: undefined,
          volume: 4_820_000,
          transferCount: 403,
          avgDuration: 24,
        },
        {
          chain: 'arbitrum',
          chainName: 'Arbitrum One',
          iconUrl: '/icons/arbitrum.png',
          address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
          symbol: 'USDC',
          explorerUrl: undefined,
          volume: 2_170_000,
          transferCount: 125,
          avgDuration: 19,
        },
      ],
    },
    {
      id: 'base|0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      volume: 392_430,
      transferCount: 0,
      avgDuration: null,
      bridges: [],
      deployments: [
        {
          chain: 'base',
          chainName: 'Base',
          iconUrl: '/icons/base.png',
          address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
          symbol: 'USDbC',
          explorerUrl: undefined,
          volume: 392_430,
          transferCount: 0,
          avgDuration: null,
        },
      ],
    },
    {
      id: 'polygonpos|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      volume: null,
      transferCount: null,
      avgDuration: null,
      bridges: [],
      deployments: [
        {
          chain: 'polygonpos',
          chainName: 'Polygon PoS',
          iconUrl: '/icons/polygonpos.png',
          address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
          symbol: 'USDC.e',
          explorerUrl: undefined,
          volume: null,
          transferCount: null,
          avgDuration: null,
        },
      ],
    },
    {
      id: 'zksync2|0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4',
      volume: 51_800,
      transferCount: 14,
      avgDuration: 55,
      bridges: [],
      deployments: [
        {
          chain: 'zksync2',
          chainName: 'ZKsync Era',
          iconUrl: '/icons/zksync-era.png',
          address: '0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4',
          symbol: 'USDC.e',
          explorerUrl: undefined,
          volume: 51_800,
          transferCount: 14,
          avgDuration: 55,
        },
      ],
    },
  ],
  edges: [
    {
      from: 'arbitrum|0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      to: 'base|0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      kind: 'backs',
      bridges: [
        {
          id: ProjectId('base'),
          name: 'Base Canonical',
          slug: 'base',
          icon: '/icons/base.png',
          url: '/interop/protocols/base',
        },
      ],
    },
    {
      from: 'arbitrum|0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      to: 'polygonpos|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      kind: 'backs',
      bridges: [
        {
          id: ProjectId('polygonpos'),
          name: 'Polygon PoS Canonical',
          slug: 'polygonpos',
          icon: '/icons/polygonpos.png',
          url: '/interop/protocols/polygonpos',
        },
      ],
    },
  ],
  unconnectedNodeIds: ['zksync2|0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4'],
}
