import { AssetId, EthereumAddress, ProjectId, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { createReports } from '../../../src/core/reports/createReports'
import { BalanceRecord } from '../../../src/peripherals/database/BalanceRepository'
import { PriceRecord } from '../../../src/peripherals/database/PriceRepository'

describe(createReports.name, () => {
  it('correctly aggregates many calculated balances', () => {
    const NOW = UnixTime.now().toStartOf('hour')
    const ARBITRUM_BRIDGE_ONE = EthereumAddress.random()
    const ARBITRUM_BRIDGE_TWO = EthereumAddress.random()
    const OPTIMISM_BRIDGE = EthereumAddress.random()

    const prices: PriceRecord[] = [
      { priceUsd: 1, assetId: AssetId.DAI, timestamp: NOW },
      { priceUsd: 1000, assetId: AssetId.ETH, timestamp: NOW },
    ]

    const balances: BalanceRecord[] = [
      {
        timestamp: NOW,
        assetId: AssetId.DAI,
        holderAddress: ARBITRUM_BRIDGE_ONE,
        balance: 2_000n * 10n ** 18n,
      },
      {
        timestamp: NOW,
        assetId: AssetId.DAI,
        holderAddress: ARBITRUM_BRIDGE_TWO,
        balance: 3_000n * 10n ** 18n,
      },
      {
        timestamp: NOW,
        assetId: AssetId.ETH,
        holderAddress: ARBITRUM_BRIDGE_TWO,
        balance: 30n * 10n ** 18n,
      },
      {
        timestamp: NOW,
        assetId: AssetId.ETH,
        holderAddress: OPTIMISM_BRIDGE,
        balance: 20n * 10n ** 18n,
      },
    ]

    const projectDetailsById = new Map([
      [
        ProjectId('arbitrum'),
        {
          bridges: [ARBITRUM_BRIDGE_ONE, ARBITRUM_BRIDGE_TWO],
          assetIds: [AssetId.DAI, AssetId.ETH],
        },
      ],
      [
        ProjectId('optimism'),
        {
          bridges: [OPTIMISM_BRIDGE],
          assetIds: [AssetId.ETH],
        },
      ],
    ])

    const decimalsByAssetId = new Map<AssetId, number>([
      [AssetId.ETH, 18],
      [AssetId.DAI, 18],
    ])

    const result = createReports(
      prices,
      balances,
      projectDetailsById,
      decimalsByAssetId,
    )

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
