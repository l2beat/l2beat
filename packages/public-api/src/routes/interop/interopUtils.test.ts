import type { InteropConfig } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectMetadata } from './utils/getAverageTransferTime'
import { getInteropChains } from './utils/getInteropChains'
import { getInteropProtocols } from './utils/getInteropProtocols'

describe('interop utils', () => {
  it('gets interop protocols and preserves split durations from config', () => {
    const result = getInteropProtocols(
      [
        transfer({
          id: 'stargate',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcValueUsd: 100,
          dstValueUsd: 120,
          transferCount: 3,
          transfersWithDurationCount: 3,
          totalDurationSum: 360,
          transferTypeStats: {
            bus: { transferCount: 1, totalDurationSum: 60 },
            taxi: { transferCount: 2, totalDurationSum: 300 },
          },
        }),
      ],
      [
        interopProject('stargate', {
          name: 'Stargate',
          slug: 'stargate',
          durationSplit: {
            nonMinting: [
              { label: 'Bus', transferTypes: ['bus'] },
              { label: 'Taxi', transferTypes: ['taxi'] },
            ],
          },
        }),
      ],
    )

    expect(result).toEqual([
      {
        id: 'stargate',
        slug: 'stargate',
        name: 'Stargate',
        totalVolume: 120,
        totalTransferCount: 3,
        avgTransferTime: {
          type: 'split',
          splits: [
            { label: 'Bus', duration: 60 },
            { label: 'Taxi', duration: 150 },
          ],
        },
        chainsBreakdown: [
          {
            id: 'arbitrum',
            name: 'Arbitrum One',
            volume: 120,
            transferCount: 3,
            avgTransferTimeSeconds: 120,
          },
          {
            id: 'ethereum',
            name: 'Ethereum',
            volume: 100,
            transferCount: 3,
            avgTransferTimeSeconds: 120,
          },
        ],
      },
    ])
  })

  it('marks protocol duration as unknown when configured so', () => {
    const result = getInteropProtocols(
      [
        transfer({
          id: 'relay',
          srcChain: 'optimism',
          dstChain: 'base',
          srcValueUsd: 10,
          dstValueUsd: 12,
          transferCount: 1,
          transfersWithDurationCount: 1,
          totalDurationSum: 100,
        }),
      ],
      [
        interopProject('relay', {
          name: 'Relay',
          slug: 'relay',
          transfersTimeMode: 'unknown',
        }),
      ],
    )

    expect(result[0]?.avgTransferTime).toEqual({ type: 'unknown' })
    expect(result[0]?.chainsBreakdown).toEqual([
      {
        id: 'base',
        name: 'Base',
        volume: 12,
        transferCount: 1,
        avgTransferTimeSeconds: null,
      },
      {
        id: 'optimism',
        name: 'OP Mainnet',
        volume: 10,
        transferCount: 1,
        avgTransferTimeSeconds: null,
      },
    ])
  })

  it('gets interop chains with inflows, outflows, and protocol breakdowns', () => {
    const result = getInteropChains(
      [
        transfer({
          id: 'relay',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcValueUsd: 100,
          dstValueUsd: 110,
          transferCount: 2,
          transfersWithDurationCount: 2,
          totalDurationSum: 300,
        }),
        transfer({
          id: 'cctpv2',
          srcChain: 'arbitrum',
          dstChain: 'base',
          srcValueUsd: 50,
          dstValueUsd: 50,
          transferCount: 1,
          transfersWithDurationCount: 1,
          totalDurationSum: 90,
        }),
      ],
      [
        interopProject('relay', { name: 'Relay', slug: 'relay' }),
        interopProject('cctpv2', { name: 'CCTP V2', slug: 'cctpv2' }),
      ],
    )

    expect(result).toEqual([
      {
        id: 'arbitrum',
        name: 'Arbitrum One',
        totalVolume: 160,
        totalTransferCount: 3,
        inflowsUsd: 110,
        outflowsUsd: 50,
        avgTransferTimeSeconds: 130,
        protocolsBreakdown: [
          {
            id: 'relay',
            slug: 'relay',
            name: 'Relay',
            volume: 110,
            transferCount: 2,
          },
          {
            id: 'cctpv2',
            slug: 'cctpv2',
            name: 'CCTP V2',
            volume: 50,
            transferCount: 1,
          },
        ],
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        totalVolume: 100,
        totalTransferCount: 2,
        inflowsUsd: 0,
        outflowsUsd: 100,
        avgTransferTimeSeconds: 150,
        protocolsBreakdown: [
          {
            id: 'relay',
            slug: 'relay',
            name: 'Relay',
            volume: 100,
            transferCount: 2,
          },
        ],
      },
      {
        id: 'base',
        name: 'Base',
        totalVolume: 50,
        totalTransferCount: 1,
        inflowsUsd: 50,
        outflowsUsd: 0,
        avgTransferTimeSeconds: 90,
        protocolsBreakdown: [
          {
            id: 'cctpv2',
            slug: 'cctpv2',
            name: 'CCTP V2',
            volume: 50,
            transferCount: 1,
          },
        ],
      },
    ])
  })

  it('returns empty arrays when there is no data', () => {
    expect(getInteropProtocols([], [])).toEqual([])
    expect(getInteropChains([], [])).toEqual([])
  })

  it('skips subgroup protocol records when getting interop chains', () => {
    const result = getInteropChains(
      [
        transfer({
          id: 'layerzero',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcValueUsd: 100,
          dstValueUsd: 100,
          transferCount: 2,
          transfersWithDurationCount: 2,
          totalDurationSum: 200,
        }),
        transfer({
          id: 'usdt0',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcValueUsd: 100,
          dstValueUsd: 100,
          transferCount: 2,
          transfersWithDurationCount: 2,
          totalDurationSum: 200,
        }),
      ],
      [
        interopProject('layerzero', { name: 'LayerZero', slug: 'layerzero' }),
        interopProject('usdt0', {
          name: 'USDT0',
          slug: 'usdt0',
          subgroupId: 'layerzero',
        }),
      ],
    )

    expect(result).toEqual([
      {
        id: 'arbitrum',
        name: 'Arbitrum One',
        totalVolume: 100,
        totalTransferCount: 2,
        inflowsUsd: 100,
        outflowsUsd: 0,
        avgTransferTimeSeconds: 100,
        protocolsBreakdown: [
          {
            id: 'layerzero',
            slug: 'layerzero',
            name: 'LayerZero',
            volume: 100,
            transferCount: 2,
          },
        ],
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        totalVolume: 100,
        totalTransferCount: 2,
        inflowsUsd: 0,
        outflowsUsd: 100,
        avgTransferTimeSeconds: 100,
        protocolsBreakdown: [
          {
            id: 'layerzero',
            slug: 'layerzero',
            name: 'LayerZero',
            volume: 100,
            transferCount: 2,
          },
        ],
      },
    ])
  })
})

function transfer(
  overrides: Partial<AggregatedInteropTransferRecord>,
): AggregatedInteropTransferRecord {
  return {
    timestamp: UnixTime(1),
    id: 'protocol',
    bridgeType: 'nonMinting',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    transferTypeStats: undefined,
    transferCount: 0,
    transfersWithDurationCount: 0,
    identifiedCount: 0,
    totalDurationSum: 0,
    srcValueUsd: 0,
    dstValueUsd: 0,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    avgValueInFlight: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    countUnder100: 0,
    count100To1K: 0,
    count1KTo10K: 0,
    count10KTo100K: 0,
    countOver100K: 0,
    ...overrides,
  }
}

function interopProject(
  id: string,
  overrides: {
    name: string
    slug: string
    transfersTimeMode?: 'unknown'
    subgroupId?: string
    durationSplit?: {
      nonMinting?: { label: string; transferTypes: string[] }[]
      lockAndMint?: { label: string; transferTypes: string[] }[]
      burnAndMint?: { label: string; transferTypes: string[] }[]
    }
  },
): ProjectMetadata {
  const interopConfig: InteropConfig = {
    name: overrides.name,
    type: 'canonical',
    transfersTimeMode: overrides.transfersTimeMode,
    subgroupId: overrides.subgroupId
      ? ProjectId(overrides.subgroupId)
      : undefined,
    durationSplit: overrides.durationSplit,
    plugins: [{ plugin: 'relay', bridgeType: 'nonMinting' }],
  }

  return {
    id: ProjectId(id),
    name: overrides.name,
    slug: overrides.slug,
    interopConfig,
  }
}
