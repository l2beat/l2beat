import { AssetId, ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { convertBalance, createReport, getBigIntPrice } from './createReport'

describe(createReport.name, () => {
  it('price: 3.20 $ || balance: 22.123456', async () => {
    const timestamp = UnixTime.now()
    const result = createReport(
      {
        priceUsd: 3.2,
        timestamp,
        assetId: AssetId.ETH,
      },
      {
        projectId: ProjectId('arbitrum'),
        assetId: AssetId.ETH,
        balance: 22123456n,
        decimals: 6,
      },
      1000,
    )

    expect(result).toEqual({
      timestamp,
      projectId: ProjectId('arbitrum'),
      asset: AssetId.ETH,
      balance: 22123456n,
      balanceUsd: 7079n,
      balanceEth: 70795n,
    })
  })

  it('price: 3.20 $ || balance: 22.123456789123456789', async () => {
    const timestamp = UnixTime.now()
    const result = createReport(
      {
        priceUsd: 3.2,
        timestamp,
        assetId: AssetId.ETH,
      },
      {
        projectId: ProjectId('arbitrum'),
        assetId: AssetId.ETH,
        balance: 22123456789123456789n,
        decimals: 18,
      },
      1000,
    )

    expect(result).toEqual({
      timestamp,
      projectId: ProjectId('arbitrum'),
      asset: AssetId.ETH,
      balance: 22123456789123456789n,
      balanceUsd: 7079n,
      balanceEth: 70795n,
    })
  })
})

describe(convertBalance.name, () => {
  const runs = [
    {
      priceUsd: 1,
      decimals: 0,
      balance: 1n,
      ethPrice: 1,
      balanceUsd: 100n,
      balanceEth: 1000000n,
    },
    {
      priceUsd: 2,
      decimals: 3,
      balance: 2000n,
      ethPrice: 1500,
      balanceUsd: 400n,
      balanceEth: 2666n,
    },
    {
      priceUsd: 3.5,
      decimals: 18,
      balance: 12345n * 10n ** 18n,
      ethPrice: 2334,
      balanceUsd: 4320750n,
      balanceEth: 18512210n,
    },
  ]

  for (const run of runs) {
    it(`convertBalance(${run.priceUsd}, ${run.decimals}, ${run.balance}, ${run.ethPrice})`, () => {
      expect(
        convertBalance(run.priceUsd, run.decimals, run.balance, run.ethPrice),
      ).toEqual({
        balanceUsd: run.balanceUsd,
        balanceEth: run.balanceEth,
      })
    })
  }
})

describe(getBigIntPrice.name, () => {
  it('$1.23 at 18 decimals', () => {
    const result = getBigIntPrice(1.23, 18)
    expect(result).toEqual(1230000000000000000n)
  })

  it('$1.23 at 6 decimals', () => {
    const result = getBigIntPrice(1.23, 6)
    expect(result).toEqual(1230000000000000000000000000000n)
  })

  it('$1.23 at 2 decimals', () => {
    const result = getBigIntPrice(1.23, 2)
    expect(result).toEqual(12300000000000000000000000000000000n)
  })

  it('$6789 at 18 decimals', () => {
    const result = getBigIntPrice(6789, 18)
    expect(result).toEqual(6789000000000000000000n)
  })

  it('$6789 at 6 decimals', () => {
    const result = getBigIntPrice(6789, 6)
    expect(result).toEqual(6789000000000000000000000000000000n)
  })

  it('$6789 at 2 decimals', () => {
    const result = getBigIntPrice(6789, 2)
    expect(result).toEqual(67890000000000000000000000000000000000n)
  })

  it('$0.00057 at 18 decimals', () => {
    const result = getBigIntPrice(0.00057, 18)
    expect(result).toEqual(570000000000000n)
  })

  it('$0.00057 at 6 decimals', () => {
    const result = getBigIntPrice(0.00057, 6)
    expect(result).toEqual(570000000000000000000000000n)
  })

  it('$0.00057 at 2 decimals', () => {
    const result = getBigIntPrice(0.00057, 2)
    expect(result).toEqual(5700000000000000000000000000000n)
  })
})
