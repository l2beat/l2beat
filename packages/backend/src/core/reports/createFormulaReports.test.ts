import { AssetId, ChainId, ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { CirculatingSupplyRecord } from '../../peripherals/database/CirculatingSupplyRepository'
import { fakeToken } from '../../test/mockReports'
import { REPORTS_MOCK as MOCK } from '../../test/mockTotalSupplyReports'
import { createFormulaReports, transformBalances } from './createFormulaReports'

describe(createFormulaReports.name, () => {
  it('valid data', () => {
    const result = createFormulaReports(
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

  it('')

  it('chainId mismatch in total supplies', () => {
    expect(() =>
      createFormulaReports(
        MOCK.PRICES,
        [{ ...MOCK.TOTAL_SUPPLIES[0], chainId: ChainId.ETHEREUM }],
        MOCK.TOKENS,
        ProjectId.ARBITRUM,
        ChainId.ARBITRUM,
      ),
    ).toThrow('ChainIds do not match')
  })
})

describe(transformBalances.name, () => {
  it('multiplies circulating supply by 10 ** decimals', () => {
    const C_SUPPLY = 1000
    const DECIMALS = 6

    const records: CirculatingSupplyRecord[] = [
      {
        assetId: AssetId.USDC,
        circulatingSupply: C_SUPPLY,
        chainId: ChainId.ARBITRUM,
        timestamp: MOCK.NOW,
      },
    ]

    const tokens = [
      {
        ...fakeToken({ id: AssetId.USDC, decimals: DECIMALS }),
      },
    ]

    const result = transformBalances(
      ProjectId.ARBITRUM,
      records,
      tokens,
      ChainId.ARBITRUM,
    )

    expect(result).toEqual([
      {
        projectId: ProjectId.ARBITRUM,
        chainId: ChainId.ARBITRUM,
        balance: BigInt(C_SUPPLY * 10 ** DECIMALS),
        assetId: AssetId.USDC,
        type: 'CBV', //irrelevant
        decimals: DECIMALS,
      },
    ])
  })
})
