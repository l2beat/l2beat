import { AssetId, ProjectId } from '@l2beat/common'
import { expect } from 'earljs'

import { aggregateReports } from '../../../src/core/reports/aggregateReports'
import { NOW, PROJECTS } from './projects'

describe(aggregateReports.name, () => {
  const REPORTS = [
    {
      timestamp: NOW,
      projectId: ProjectId('arbitrum'),
      asset: AssetId.DAI,
      balance: 5_000n * 10n ** 18n,
      balanceUsd: 5_000_00n,
      balanceEth: 5_000000n,
    },
    {
      timestamp: NOW,
      projectId: ProjectId('arbitrum'),
      asset: AssetId.ETH,
      balance: 30n * 10n ** 18n,
      balanceUsd: 30_000_00n,
      balanceEth: 30_000000n,
    },
    {
      timestamp: NOW,
      projectId: ProjectId('optimism'),
      asset: AssetId.ETH,
      balance: 20n * 10n ** 18n,
      balanceUsd: 20_000_00n,
      balanceEth: 20_000000n,
    },
  ]

  it('correctly aggregates many reports', () => {
    const result = aggregateReports(REPORTS, PROJECTS, NOW)
    expect(result).toEqual([
      {
        timestamp: NOW,
        projectId: ProjectId('arbitrum'),
        tvlUsd: 35_000_00n,
        tvlEth: 35_000000n,
      },
      {
        timestamp: NOW,
        projectId: ProjectId('optimism'),
        tvlUsd: 20_000_00n,
        tvlEth: 20_000000n,
      },
      {
        timestamp: NOW,
        projectId: ProjectId.ALL,
        tvlUsd: 55_000_00n,
        tvlEth: 55_000000n,
      },
    ])
  })

  it('works with empty reports', () => {
    const result = aggregateReports([], PROJECTS, NOW)
    expect(result).toEqual([
      {
        timestamp: NOW,
        projectId: ProjectId('arbitrum'),
        tvlUsd: 0n,
        tvlEth: 0n,
      },
      {
        timestamp: NOW,
        projectId: ProjectId('optimism'),
        tvlUsd: 0n,
        tvlEth: 0n,
      },
      {
        timestamp: NOW,
        projectId: ProjectId.ALL,
        tvlUsd: 0n,
        tvlEth: 0n,
      },
    ])
  })
})
