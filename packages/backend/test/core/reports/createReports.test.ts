import { AssetId, ProjectId } from '@l2beat/types'
import { expect } from 'earljs'

import {
  aggregateBalancesPerProject,
  createReports,
} from '../../../src/core/reports/createReports'
import { BALANCES, NOW, PRICES, PROJECTS } from './projects'

describe(createReports.name, () => {
  it('correctly aggregates many calculated balances', () => {
    const result = createReports(PRICES, BALANCES, PROJECTS)
    expect(result).toEqual([
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
    ])
  })
})

describe(aggregateBalancesPerProject.name, () => {
  it('skips balances before bridge sinceTimestamp', () => {
    const result = aggregateBalancesPerProject(PROJECTS, [
      {
        holderAddress: PROJECTS[0].bridges[0].address,
        timestamp: PROJECTS[0].bridges[0].sinceTimestamp.add(-1, 'days'),
        assetId: AssetId.DAI,
        balance: 100n * 10n ** 18n,
      },
      {
        holderAddress: PROJECTS[0].bridges[0].address,
        timestamp: PROJECTS[0].bridges[0].tokens[0].sinceTimestamp.add(
          1,
          'days',
        ),
        assetId: AssetId.DAI,
        balance: 200n * 10n ** 18n,
      },
    ])
    expect(result).toEqual([
      {
        assetId: AssetId.DAI,
        balance: 200n * 10n ** 18n,
        decimals: 18,
        projectId: ProjectId('arbitrum'),
      },
      {
        assetId: AssetId.ETH,
        balance: 0n,
        decimals: 18,
        projectId: ProjectId('arbitrum'),
      },
      {
        assetId: AssetId.ETH,
        balance: 0n,
        decimals: 18,
        projectId: ProjectId('optimism'),
      },
    ])
  })
  it('discards balances before asset sinceTimestamp', () => {
    const result = aggregateBalancesPerProject(PROJECTS, [
      {
        holderAddress: PROJECTS[0].bridges[0].address,
        timestamp: PROJECTS[0].bridges[0].tokens[0].sinceTimestamp.add(
          -1,
          'days',
        ),
        assetId: AssetId.DAI,
        balance: 100n * 10n ** 18n,
      },
      {
        holderAddress: PROJECTS[0].bridges[0].address,
        timestamp: PROJECTS[0].bridges[0].tokens[0].sinceTimestamp.add(
          1,
          'days',
        ),
        assetId: AssetId.DAI,
        balance: 200n * 10n ** 18n,
      },
    ])
    expect(result).toEqual([
      {
        assetId: AssetId.DAI,
        balance: 200n * 10n ** 18n,
        decimals: 18,
        projectId: ProjectId('arbitrum'),
      },
      {
        assetId: AssetId.ETH,
        balance: 0n,
        decimals: 18,
        projectId: ProjectId('arbitrum'),
      },
      {
        assetId: AssetId.ETH,
        balance: 0n,
        decimals: 18,
        projectId: ProjectId('optimism'),
      },
    ])
  })
})
