import { AssetId, ChainId, ValueType } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { REPORTS_MOCK as MOCK } from '../../test/mockTotalSupplyReports'
import { createEBVReports } from './createEBVReports'

describe(createEBVReports.name, () => {
  it('valid data', () => {
    const result = createEBVReports(
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
        amount: 900n * 10n ** 6n,
        usdValue: 900_00n,
        ethValue: 900_000n,
      },
    ])
  })

  it('fails if premint is bigger than total supply', () => {
    expect(() =>
      createEBVReports(
        MOCK.PRICES,
        [{ ...MOCK.BALANCES[0], balance: 10000n * 10n ** 6n }],
        MOCK.TOTAL_SUPPLIES,
        MOCK.TOKENS,
        MOCK.PROJECT,
        ChainId.ARBITRUM,
      ),
    ).toThrow('Total supply has to be bigger than premint balance')
  })

  it('chainId mismatch in balances', () => {
    expect(() =>
      createEBVReports(
        MOCK.PRICES,
        [{ ...MOCK.BALANCES[0], chainId: ChainId.ETHEREUM }],
        MOCK.TOTAL_SUPPLIES,
        MOCK.TOKENS,
        MOCK.PROJECT,
        ChainId.ARBITRUM,
      ),
    ).toThrow('ChainIds do not match')
  })

  it('chainId mismatch in total supplies', () => {
    expect(() =>
      createEBVReports(
        MOCK.PRICES,
        MOCK.BALANCES,
        [{ ...MOCK.TOTAL_SUPPLIES[0], chainId: ChainId.ETHEREUM }],
        MOCK.TOKENS,
        MOCK.PROJECT,
        ChainId.ARBITRUM,
      ),
    ).toThrow('ChainIds do not match')
  })
})
