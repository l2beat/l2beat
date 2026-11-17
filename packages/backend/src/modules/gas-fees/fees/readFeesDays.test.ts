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

  it('refuses a day with a hole, though a later day is there', () => {
    const whole = (day1: BlocksRow) =>
      joinFeesDays(
        chains,
        day,
        day,
        [fees('zksync', '2026-10-01'), fees('zksync', '2026-10-02')],
        [day1, blocks('zksync', '2026-10-02')],
      )[0]?.records.length

    expect(whole(blocks('zksync', '2026-10-01'))).toEqual(1)
    // Fee rows from fewer blocks than had transactions
    expect(
      whole(blocks('zksync', '2026-10-01', { blocks_with_txs: 95 })),
    ).toEqual(0)
    // A block missing within the day
    expect(whole(blocks('zksync', '2026-10-01', { blocks: 99 }))).toEqual(0)
    // Blocks missing before the next day's first
    expect(
      whole(blocks('zksync', '2026-10-01', { blocks: 98, last_block: 97 })),
    ).toEqual(0)
    // Read from transactions, so only the fee rows' coverage is checked
    expect(
      whole(
        blocks('zksync', '2026-10-01', {
          blocks: null,
          first_block: null,
          last_block: null,
        }),
      ),
    ).toEqual(1)
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
    fee_blocks: 90,
  }
}

/** 100 blocks a day from block 0 on 2026-10-01, 90 of them with transactions */
function blocks(
  blockchain: string,
  day: string,
  overrides: Partial<BlocksRow> = {},
): BlocksRow {
  const first = (Number(day.slice(-2)) - 1) * 100
  return {
    blockchain,
    day,
    base_fee: 0.5,
    gas_used: 1e9,
    blocks_with_txs: 90,
    blocks: 100,
    first_block: first,
    last_block: first + 99,
    ...overrides,
  }
}
