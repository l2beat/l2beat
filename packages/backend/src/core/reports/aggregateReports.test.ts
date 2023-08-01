import {
  AssetId,
  ChainId,
  ProjectId,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { AggregatedReportRecord } from '../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'
import { aggregateReports } from './aggregateReports'
import { ReportProject } from './ReportProject'

describe(aggregateReports.name, () => {
  const NOW = UnixTime.now().toStartOf('hour')
  const ETH_PRICE_IN_DAI = 1_000n

  const ARBITRUM = ProjectId('arbitrum')
  const OPTIMISM = ProjectId('optimism')
  const POLYGON = ProjectId('polygon')
  const AVALANCHE = ProjectId('avalanche')

  it('correctly aggregates many reports', () => {
    const result = aggregateReports(
      [
        report(ARBITRUM, 'eth', 30n, ValueType.NMV),
        report(OPTIMISM, 'eth', 20n, ValueType.NMV),
        report(ARBITRUM, 'dai', 5_000n, ValueType.EBV),
        report(POLYGON, 'dai', 1_000n, ValueType.EBV),
        report(AVALANCHE, 'eth', 40n, ValueType.CBV),
      ],
      [
        project(ARBITRUM, 'layer2'),
        project(OPTIMISM, 'layer2'),
        project(POLYGON, 'bridge'),
        project(AVALANCHE, 'bridge'),
      ],
      NOW,
    )

    expect(result).toEqual([
      // Arbitrum
      record(ARBITRUM, 0n, ValueType.CBV),
      record(ARBITRUM, 5_000n, ValueType.EBV),
      record(ARBITRUM, 30_000n, ValueType.NMV),
      record(ARBITRUM, 35_000n, ValueType.TVL),

      // Optimism
      record(OPTIMISM, 0n, ValueType.CBV),
      record(OPTIMISM, 0n, ValueType.EBV),
      record(OPTIMISM, 20_000n, ValueType.NMV),
      record(OPTIMISM, 20_000n, ValueType.TVL),

      // Polygon
      record(POLYGON, 0n, ValueType.CBV),
      record(POLYGON, 1_000n, ValueType.EBV),
      record(POLYGON, 0n, ValueType.NMV),
      record(POLYGON, 1_000n, ValueType.TVL),

      // Avalanche
      record(AVALANCHE, 40_000n, ValueType.CBV),
      record(AVALANCHE, 0n, ValueType.EBV),
      record(AVALANCHE, 0n, ValueType.NMV),
      record(AVALANCHE, 40_000n, ValueType.TVL),

      // Summary of all projects
      record(ProjectId.ALL, 40_000n, ValueType.CBV),
      record(ProjectId.ALL, 6_000n, ValueType.EBV),
      record(ProjectId.ALL, 50_000n, ValueType.NMV),
      record(ProjectId.ALL, 96_000n, ValueType.TVL),

      // Only bridges summary
      record(ProjectId.BRIDGES, 40_000n, ValueType.CBV),
      record(ProjectId.BRIDGES, 1_000n, ValueType.EBV),
      record(ProjectId.BRIDGES, 0n, ValueType.NMV),
      record(ProjectId.BRIDGES, 41_000n, ValueType.TVL),

      // Only L2s summary
      record(ProjectId.LAYER2S, 0n, ValueType.CBV),
      record(ProjectId.LAYER2S, 5_000n, ValueType.EBV),
      record(ProjectId.LAYER2S, 50_000n, ValueType.NMV),
      record(ProjectId.LAYER2S, 55_000n, ValueType.TVL),
    ])
  })

  it('works with empty reports', () => {
    const result = aggregateReports(
      [],
      [
        project(ARBITRUM, 'layer2'),
        project(OPTIMISM, 'layer2'),
        project(POLYGON, 'bridge'),
        project(AVALANCHE, 'bridge'),
      ],
      NOW,
    )

    expect(result).toEqual([
      // Arbitrum
      record(ARBITRUM, 0n, ValueType.CBV),
      record(ARBITRUM, 0n, ValueType.EBV),
      record(ARBITRUM, 0n, ValueType.NMV),
      record(ARBITRUM, 0n, ValueType.TVL),

      // Optimism
      record(OPTIMISM, 0n, ValueType.CBV),
      record(OPTIMISM, 0n, ValueType.EBV),
      record(OPTIMISM, 0n, ValueType.NMV),
      record(OPTIMISM, 0n, ValueType.TVL),

      // Polygon
      record(POLYGON, 0n, ValueType.CBV),
      record(POLYGON, 0n, ValueType.EBV),
      record(POLYGON, 0n, ValueType.NMV),
      record(POLYGON, 0n, ValueType.TVL),

      // Avalanche
      record(AVALANCHE, 0n, ValueType.CBV),
      record(AVALANCHE, 0n, ValueType.EBV),
      record(AVALANCHE, 0n, ValueType.NMV),
      record(AVALANCHE, 0n, ValueType.TVL),

      // Summary of all projects
      record(ProjectId.ALL, 0n, ValueType.CBV),
      record(ProjectId.ALL, 0n, ValueType.EBV),
      record(ProjectId.ALL, 0n, ValueType.NMV),
      record(ProjectId.ALL, 0n, ValueType.TVL),

      // Only bridges summary
      record(ProjectId.BRIDGES, 0n, ValueType.CBV),
      record(ProjectId.BRIDGES, 0n, ValueType.EBV),
      record(ProjectId.BRIDGES, 0n, ValueType.NMV),
      record(ProjectId.BRIDGES, 0n, ValueType.TVL),

      // Only L2s summary
      record(ProjectId.LAYER2S, 0n, ValueType.CBV),
      record(ProjectId.LAYER2S, 0n, ValueType.EBV),
      record(ProjectId.LAYER2S, 0n, ValueType.NMV),
      record(ProjectId.LAYER2S, 0n, ValueType.TVL),
    ])
  })

  function report(
    projectId: ProjectId,
    asset: 'eth' | 'dai',
    balance: bigint,
    type: ValueType = ValueType.CBV,
  ): ReportRecord {
    return {
      timestamp: NOW,
      projectId,
      type,
      asset: asset === 'eth' ? AssetId.ETH : AssetId.DAI,
      chainId: ChainId.ETHEREUM,
      amount: balance * 10n ** 18n,
      usdValue: (asset === 'eth' ? balance * ETH_PRICE_IN_DAI : balance) * 100n,
      ethValue:
        (asset === 'eth' ? balance : balance / ETH_PRICE_IN_DAI) * 1000000n,
    }
  }

  function project(
    projectId: ProjectId,
    type: ReportProject['type'],
  ): ReportProject {
    return { projectId, type, escrows: [] }
  }

  function record(
    projectId: ProjectId,
    usdValue: bigint,
    valueType: ValueType,
  ): AggregatedReportRecord {
    return {
      projectId,
      timestamp: NOW,
      valueType,
      usdValue: usdValue * 100n,
      ethValue: usdValue * 1000n,
    }
  }
})
