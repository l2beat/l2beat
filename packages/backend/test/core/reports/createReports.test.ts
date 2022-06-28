import { AssetId, ProjectId } from '@l2beat/common'
import { expect } from 'earljs'

import { createReports } from '../../../src/core/reports/createReports'
import { BALANCES, NOW, PRICES, PROJECTS } from './fakes'

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
