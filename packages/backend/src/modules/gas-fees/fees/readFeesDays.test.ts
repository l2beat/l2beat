import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { GasFeesChain } from './chains'
import { type BlocksRow, type FeesRow, joinFeesDays } from './readFeesDays'

describe(joinFeesDays.name, () => {
  const day = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))
  const chains: GasFeesChain[] = [
    { id: 'zksync2', dune: 'zksync', requiredFrom: day },
    {
      id: 'new',
      dune: 'new',
      requiredFrom: UnixTime(day + UnixTime.DAY),
    },
  ]

  it('joins the fee and block rows of a chain and day', () => {
    const days = joinFeesDays(
      chains,
      day,
      day,
      [fees('zksync', '2026-10-01'), fees('zksync', '2026-10-02')],
      [blocks('zksync', '2026-10-01'), blocks('zksync', '2026-10-02')],
    )

    expect(days).toEqual([
      {
        day,
        records: [
          {
            timestamp: day,
            chain: 'zksync2',
            txCount: 10,
            totalFeeNative: 1,
            totalFeeUsd: 4000,
            l1FeeNative: 0.1,
            blobFeeNative: 0,
            baseFeeNative: 0.5,
            gasUsed: 1e9,
            medianFeeUsd: null,
          },
        ],
        missing: [],
      },
    ])
  })

  it("takes a chain's day as whole only once both queries have a later day of it", () => {
    const days = joinFeesDays(
      chains,
      day,
      UnixTime(day + UnixTime.DAY),
      [
        fees('zksync', '2026-10-01'),
        fees('zksync', '2026-10-02'),
        fees('zksync', '2026-10-03'),
      ],
      [blocks('zksync', '2026-10-01'), blocks('zksync', '2026-10-02')],
    )

    expect(days.map((d) => d.records.length)).toEqual([1, 0])
    expect(days.map((d) => d.missing)).toEqual([[], ['zksync2', 'new']])
  })
})

function fees(blockchain: string, day: string): FeesRow {
  return {
    blockchain,
    day,
    tx_count: 10,
    total_fee: 1,
    total_fee_usd: 4000,
    l1_fee: 0.1,
    blob_fee: 0,
    median_fee_usd: null,
  }
}

function blocks(blockchain: string, day: string): BlocksRow {
  return { blockchain, day, base_fee: 0.5, gas_used: 1e9 }
}
