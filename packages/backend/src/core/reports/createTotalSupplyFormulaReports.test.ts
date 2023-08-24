import { AssetId, ChainId, ProjectId, ValueType } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { REPORTS_MOCK as MOCK } from '../../test/mockTotalSupplyReports'
import { createTotalSupplyFormulaReports } from './createTotalSupplyFormulaReports'

describe(createTotalSupplyFormulaReports.name, () => {
  it('valid data', () => {
    const result = createTotalSupplyFormulaReports(
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
        type: ValueType.EBV,
        amount: 900n * 10n ** 6n,
        usdValue: 900_00n,
        ethValue: 900_000n,
      },
    ])
  })

  it('fails if premint is bigger than total supply', () => {
    expect(() =>
      createTotalSupplyFormulaReports(
        MOCK.PRICES,
        MOCK.TOTAL_SUPPLIES,
        MOCK.TOKENS,
        ProjectId.ARBITRUM,
        ChainId.ARBITRUM,
      ),
    ).toThrow('Total supply has to be bigger than premint balance')
  })

  it('chainId mismatch in balances', () => {
    expect(() =>
      createTotalSupplyFormulaReports(
        MOCK.PRICES,
        MOCK.TOTAL_SUPPLIES,
        MOCK.TOKENS,
        ProjectId.ARBITRUM,
        ChainId.ARBITRUM,
      ),
    ).toThrow('ChainIds do not match')
  })

  it('chainId mismatch in total supplies', () => {
    expect(() =>
      createTotalSupplyFormulaReports(
        MOCK.PRICES,
        [{ ...MOCK.TOTAL_SUPPLIES[0], chainId: ChainId.ETHEREUM }],
        MOCK.TOKENS,
        ProjectId.ARBITRUM,
        ChainId.ARBITRUM,
      ),
    ).toThrow('ChainIds do not match')
  })
})
