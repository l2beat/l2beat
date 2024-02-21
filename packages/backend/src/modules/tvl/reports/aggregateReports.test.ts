import {
  AggregatedReportType,
  AssetId,
  ChainId,
  ProjectId,
  ReportType,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { AggregatedReportRecord } from '../repositories/AggregatedReportRepository'
import { ReportRecord } from '../repositories/ReportRepository'
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
        report(ARBITRUM, 'eth', 30n, 'NMV'),
        report(OPTIMISM, 'eth', 20n, 'NMV'),
        report(ARBITRUM, 'dai', 5_000n, 'EBV'),
        report(POLYGON, 'dai', 1_000n, 'EBV'),
        report(AVALANCHE, 'eth', 40n, 'CBV'),
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
      record(ARBITRUM, 0n, 'CBV'),
      record(ARBITRUM, 5_000n, 'EBV'),
      record(ARBITRUM, 30_000n, 'NMV'),
      record(ARBITRUM, 35_000n, 'TVL'),

      // Optimism
      record(OPTIMISM, 0n, 'CBV'),
      record(OPTIMISM, 0n, 'EBV'),
      record(OPTIMISM, 20_000n, 'NMV'),
      record(OPTIMISM, 20_000n, 'TVL'),

      // Polygon
      record(POLYGON, 0n, 'CBV'),
      record(POLYGON, 1_000n, 'EBV'),
      record(POLYGON, 0n, 'NMV'),
      record(POLYGON, 1_000n, 'TVL'),

      // Avalanche
      record(AVALANCHE, 40_000n, 'CBV'),
      record(AVALANCHE, 0n, 'EBV'),
      record(AVALANCHE, 0n, 'NMV'),
      record(AVALANCHE, 40_000n, 'TVL'),
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
      record(ARBITRUM, 0n, 'CBV'),
      record(ARBITRUM, 0n, 'EBV'),
      record(ARBITRUM, 0n, 'NMV'),
      record(ARBITRUM, 0n, 'TVL'),

      // Optimism
      record(OPTIMISM, 0n, 'CBV'),
      record(OPTIMISM, 0n, 'EBV'),
      record(OPTIMISM, 0n, 'NMV'),
      record(OPTIMISM, 0n, 'TVL'),

      // Polygon
      record(POLYGON, 0n, 'CBV'),
      record(POLYGON, 0n, 'EBV'),
      record(POLYGON, 0n, 'NMV'),
      record(POLYGON, 0n, 'TVL'),

      // Avalanche
      record(AVALANCHE, 0n, 'CBV'),
      record(AVALANCHE, 0n, 'EBV'),
      record(AVALANCHE, 0n, 'NMV'),
      record(AVALANCHE, 0n, 'TVL'),
    ])
  })

  function report(
    projectId: ProjectId,
    asset: 'eth' | 'dai',
    balance: bigint,
    reportType: ReportType = 'CBV',
  ): ReportRecord {
    return {
      timestamp: NOW,
      projectId,
      reportType,
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
    isUpcoming = false,
    isLayer3 = false,
  ): ReportProject {
    return { projectId, type, escrows: [], isUpcoming, isLayer3 }
  }

  function record(
    projectId: ProjectId,
    usdValue: bigint,
    reportType: AggregatedReportType,
  ): AggregatedReportRecord {
    return {
      projectId,
      timestamp: NOW,
      reportType,
      usdValue: usdValue * 100n,
      ethValue: usdValue * 1000n,
    }
  }
})
