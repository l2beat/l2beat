import { AssetId, ChainId, ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { REPORTS_MOCK as MOCK } from '../../test/mockTotalSupplyReports'
import { createSuppliedFormulaReports } from './createTotalSupplyFormulaReports'

describe(createSuppliedFormulaReports.name, () => {
  it('valid data', () => {
    const result = createSuppliedFormulaReports(
      MOCK.PRICES,
      MOCK.TOTAL_SUPPLIES,
      MOCK.TOKENS,
      ProjectId.ARBITRUM,
      ChainId.ARBITRUM,
    )

    expect(result).toEqual([
      {
        timestamp: MOCK.NOW,
        projectId: ProjectId.ARBITRUM,
        asset: AssetId.USDC,
        chainId: ChainId.ARBITRUM,
        reportType: 'EBV',
        amount: 10n ** 9n,
        usdValue: 100_000n,
        ethValue: 1_000_000n,
      },
    ])
  })

  it('chainId mismatch in total supplies', () => {
    expect(() =>
      createSuppliedFormulaReports(
        MOCK.PRICES,
        [{ ...MOCK.TOTAL_SUPPLIES[0], chainId: ChainId.ETHEREUM }],
        MOCK.TOKENS,
        ProjectId.ARBITRUM,
        ChainId.ARBITRUM,
      ),
    ).toThrow('ChainIds do not match')
  })
})
