import type { InteropConfig } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectMetadata } from './getAverageTransferTime'
import { getInteropProtocols } from './getInteropProtocols'

describe('getInteropProtocols', () => {
  it('preserves split durations from config', () => {
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
        subgroupId: null,
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

  it('includes subgroup protocol records as separate entries', () => {
    const result = getInteropProtocols(
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
        id: 'layerzero',
        slug: 'layerzero',
        name: 'LayerZero',
        subgroupId: null,
        totalVolume: 100,
        totalTransferCount: 2,
        avgTransferTime: {
          type: 'single',
          duration: 100,
        },
        chainsBreakdown: [
          {
            id: 'arbitrum',
            name: 'Arbitrum One',
            volume: 100,
            transferCount: 2,
            avgTransferTimeSeconds: 100,
          },
          {
            id: 'ethereum',
            name: 'Ethereum',
            volume: 100,
            transferCount: 2,
            avgTransferTimeSeconds: 100,
          },
        ],
      },
      {
        id: 'usdt0',
        slug: 'usdt0',
        name: 'USDT0',
        subgroupId: 'layerzero',
        totalVolume: 100,
        totalTransferCount: 2,
        avgTransferTime: {
          type: 'single',
          duration: 100,
        },
        chainsBreakdown: [
          {
            id: 'arbitrum',
            name: 'Arbitrum One',
            volume: 100,
            transferCount: 2,
            avgTransferTimeSeconds: 100,
          },
          {
            id: 'ethereum',
            name: 'Ethereum',
            volume: 100,
            transferCount: 2,
            avgTransferTimeSeconds: 100,
          },
        ],
      },
    ])
  })

  it('returns an empty array when there is no data', () => {
    expect(getInteropProtocols([], [])).toEqual([])
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
