import type { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { mapInteropChainsToWithIcons } from '~/pages/interop/utils/mapInteropChainsToWithIcons'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import type {
  InteropProtocolsByVolumeParams,
  ProtocolEntry,
  TokenData,
} from './types'
import { buildTokensDetailsMapForRecords } from './utils/buildTokensDetailsMap'
import { getInteropChains } from './utils/getInteropChains'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getProtocolEntries } from './utils/getProtocolEntries'

export async function getInteropProtocolsByVolume(
  params: InteropProtocolsByVolumeParams,
): Promise<ProtocolEntry[]> {
  if (env.MOCK) {
    return getMockInteropProtocolsByVolume(params)
  }

  const { records } = await getLatestAggregatedInteropTransferWithTokens({
    selection: {
      from: params.chains,
      to: params.chains,
    },
    protocolIds: params.protocolIds,
  })

  if (records.length === 0) return []

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })
  const subgroupProjects = new Set(
    interopProjects.filter((p) => p.interopConfig.subgroupId).map((p) => p.id),
  )
  const nonSubgroupRecords = records.filter(
    (record) => !subgroupProjects.has(record.id as ProjectId),
  )
  const tokensDetailsMap =
    await buildTokensDetailsMapForRecords(nonSubgroupRecords)

  return getProtocolEntries(
    nonSubgroupRecords,
    tokensDetailsMap,
    interopProjects,
    undefined,
    undefined,
    { from: params.chains, to: params.chains },
  ).entries
}

function getMockInteropProtocolsByVolume({
  chains,
}: InteropProtocolsByVolumeParams): ProtocolEntry[] {
  const chainIds =
    chains.length > 0 ? chains : getInteropChains().map((chain) => chain.id)
  const mockProtocolTokens: TokenData[] = [
    {
      id: 'eth',
      symbol: 'ETH',
      issuer: 'ethereum',
      iconUrl: '/icons/tokens/ether.png',
      topProtocol: undefined,
      volume: 1_000_000,
      transferCount: 100,
      avgDuration: null,
      avgValue: 10_000,
      minTransferValueUsd: undefined,
      maxTransferValueUsd: undefined,
      netMintedValue: undefined,
      flows: [],
    },
    {
      id: 'usdc',
      symbol: 'USDC',
      issuer: 'circle',
      iconUrl: '/icons/tokens/usdc.png',
      topProtocol: undefined,
      volume: 500_000,
      transferCount: 50,
      avgDuration: null,
      avgValue: 10_000,
      minTransferValueUsd: undefined,
      maxTransferValueUsd: undefined,
      netMintedValue: undefined,
      flows: [],
    },
  ]

  const chainsById = new Map(
    mapInteropChainsToWithIcons(manifest, getInteropChains()).map((chain) => [
      chain.id,
      { id: chain.id, name: chain.name, iconUrl: chain.iconUrl },
    ]),
  )
  const mockRoute = (volume: number): ProtocolEntry['topRoute'] => {
    const [srcId, dstId] = chainIds
    const srcChain = srcId ? chainsById.get(srcId) : undefined
    const dstChain = dstId ? chainsById.get(dstId) : undefined
    return srcChain && dstChain ? { srcChain, dstChain, volume } : undefined
  }

  const mockEntry = (
    overrides: Pick<
      ProtocolEntry,
      'id' | 'slug' | 'name' | 'iconUrl' | 'type' | 'volume' | 'topRoute'
    > &
      Partial<ProtocolEntry>,
  ): ProtocolEntry => ({
    shortName: undefined,
    description: undefined,
    bridgeTypes: ['nonMinting'],
    isAggregate: undefined,
    subgroup: undefined,
    tokens: { items: mockProtocolTokens, remainingCount: 0 },
    chains: { items: [], remainingCount: 0 },
    transferCount: 0,
    averageValue: null,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    averageDuration: null,
    byBridgeType: undefined,
    averageValueInFlight: undefined,
    netMintedValue: undefined,
    snapshotTimestamp: undefined,
    filterable: [],
    ...overrides,
  })

  return [
    mockEntry({
      id: 'layerzero' as ProjectId,
      slug: 'layerzero',
      name: 'LayerZero',
      iconUrl: manifest.getUrl('/icons/layerzero.png'),
      type: 'multichain',
      volume: 5_000_000,
      transferCount: 1200,
      averageValue: 4_166,
      topRoute: mockRoute(2_000_000),
    }),
    mockEntry({
      id: 'across' as ProjectId,
      slug: 'across',
      name: 'Across',
      iconUrl: manifest.getUrl('/icons/across.png'),
      type: 'intent',
      volume: 3_200_000,
      transferCount: 800,
      averageValue: 4_000,
      topRoute: mockRoute(1_500_000),
    }),
    mockEntry({
      id: 'arbitrum' as ProjectId,
      slug: 'arbitrum',
      name: 'Arbitrum Canonical',
      iconUrl: manifest.getUrl('/icons/arbitrum.png'),
      type: 'canonical',
      volume: 1_800_000,
      transferCount: 300,
      averageValue: 6_000,
      topRoute: mockRoute(900_000),
    }),
  ]
}
