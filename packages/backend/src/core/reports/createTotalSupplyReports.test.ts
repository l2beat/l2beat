import { createTotalSupplyReports } from './createTotalSupplyReports'

import { REPORTS_MOCK as MOCK } from '../../test/mockTotalSupplyReports'
import { AssetId, ChainId, ValueType } from '@l2beat/shared-pure'
import { expect } from 'earl'

describe(createTotalSupplyReports.name, () => {
  it('first test', () => {
    const result = createTotalSupplyReports(
      MOCK.PRICES,
      MOCK.BALANCES,
      MOCK.TOTAL_SUPPLIES,
      MOCK.TOKENS,
      MOCK.PROJECT,
      ChainId.ARBITRUM,
    )

    expect(result).toEqual([
      {
        timestamp: MOCK.NOW,
        projectId: MOCK.PROJECT.projectId,
        asset: AssetId.USDC,
        chainId: ChainId.ARBITRUM,
        type: ValueType.EBV,
        amount: 1_000n * 10n ** 6n,
        usdValue: 1_000_00n,
        ethValue: 1_000_000n,
      },
    ])
  })
})
