import { AssetId, ChainId, ProjectId, ValueType } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { BALANCES, NOW, PRICES, PROJECTS } from '../../test/projects'
import { aggregateBalancesPerProject, createReports } from './createReports'

describe(createReports.name, () => {
  it('correctly aggregates many calculated balances', () => {
    const result = createReports(PRICES, BALANCES, PROJECTS)
    expect(result).toEqual([
      {
        timestamp: NOW,
        projectId: ProjectId('arbitrum'),
        asset: AssetId.DAI,
        type: ValueType.CBV,
        amount: 5_000n * 10n ** 18n,
        usdValue: 5_000_00n,
        ethValue: 5_000000n,
      },
      {
        timestamp: NOW,
        projectId: ProjectId('arbitrum'),
        asset: AssetId.ETH,
        type: ValueType.CBV,
        amount: 30n * 10n ** 18n,
        usdValue: 30_000_00n,
        ethValue: 30_000000n,
      },
      {
        timestamp: NOW,
        projectId: ProjectId('optimism'),
        asset: AssetId.ETH,
        type: ValueType.CBV,
        amount: 20n * 10n ** 18n,
        usdValue: 20_000_00n,
        ethValue: 20_000000n,
      },
    ])
  })
})

describe(aggregateBalancesPerProject.name, () => {
  it('skips balances before escrow sinceTimestamp', () => {
    const result = aggregateBalancesPerProject(PROJECTS, [
      {
        holderAddress: PROJECTS[0].escrows[0].address,
        timestamp: PROJECTS[0].escrows[0].sinceTimestamp.add(-1, 'days'),
        assetId: AssetId.DAI,
        balance: 100n * 10n ** 18n,
        chainId: ChainId.ETHEREUM,
      },
      {
        holderAddress: PROJECTS[0].escrows[0].address,
        timestamp: PROJECTS[0].escrows[0].tokens[0].sinceTimestamp.add(
          1,
          'days',
        ),
        assetId: AssetId.DAI,
        balance: 200n * 10n ** 18n,
        chainId: ChainId.ETHEREUM,
      },
    ])
    expect(result).toEqual([
      {
        assetId: AssetId.DAI,
        type: ValueType.CBV,
        balance: 200n * 10n ** 18n,
        decimals: 18,
        projectId: ProjectId('arbitrum'),
      },
      {
        assetId: AssetId.ETH,
        type: ValueType.CBV,
        balance: 0n,
        decimals: 18,
        projectId: ProjectId('arbitrum'),
      },
      {
        assetId: AssetId.ETH,
        type: ValueType.CBV,
        balance: 0n,
        decimals: 18,
        projectId: ProjectId('optimism'),
      },
    ])
  })
  it('discards balances before asset sinceTimestamp', () => {
    const result = aggregateBalancesPerProject(PROJECTS, [
      {
        holderAddress: PROJECTS[0].escrows[0].address,
        timestamp: PROJECTS[0].escrows[0].tokens[0].sinceTimestamp.add(
          -1,
          'days',
        ),
        assetId: AssetId.DAI,
        balance: 100n * 10n ** 18n,
        chainId: ChainId.ETHEREUM,
      },
      {
        holderAddress: PROJECTS[0].escrows[0].address,
        timestamp: PROJECTS[0].escrows[0].tokens[0].sinceTimestamp.add(
          1,
          'days',
        ),
        assetId: AssetId.DAI,
        balance: 200n * 10n ** 18n,
        chainId: ChainId.ETHEREUM,
      },
    ])
    expect(result).toEqual([
      {
        assetId: AssetId.DAI,
        type: ValueType.CBV,
        balance: 200n * 10n ** 18n,
        decimals: 18,
        projectId: ProjectId('arbitrum'),
      },
      {
        assetId: AssetId.ETH,
        type: ValueType.CBV,
        balance: 0n,
        decimals: 18,
        projectId: ProjectId('arbitrum'),
      },
      {
        assetId: AssetId.ETH,
        type: ValueType.CBV,
        balance: 0n,
        decimals: 18,
        projectId: ProjectId('optimism'),
      },
    ])
  })
})
