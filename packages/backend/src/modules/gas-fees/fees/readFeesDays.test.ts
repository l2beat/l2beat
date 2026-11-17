import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { GasFeesChain } from './chains'
import { type BlocksRow, type FeesRow, joinFeesDays } from './readFeesDays'

describe(joinFeesDays.name, () => {
  const day = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))
  const zksync: GasFeesChain = {
    id: 'zksync2',
    dune: 'zksync',
    requiredFrom: day,
  }
  const chains: GasFeesChain[] = [
    zksync,
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

  describe("a hole in Dune's data", () => {
    // 100 blocks a day from block 0 on 1 Oct, with a later day to show each has finished
    const stored = (october: BlocksRow[], chain = zksync) =>
      joinFeesDays(
        [chain],
        day,
        UnixTime(day + 2 * UnixTime.DAY),
        ['01', '02', '03', '04'].map((d) => fees('zksync', `2026-10-${d}`)),
        october,
      ).map((d) => d.records.length)
    const whole = ['01', '02', '03', '04'].map((d) =>
      blocks('zksync', `2026-10-${d}`),
    )
    const withDay = (date: string, overrides: Partial<BlocksRow>) =>
      whole.map((row) => (row.day === date ? { ...row, ...overrides } : row))

    it('stores days that join their neighbours on both sides', () => {
      expect(stored(whole)).toEqual([1, 1, 1])
    })

    it('refuses a day whose fee rows come from fewer blocks than had transactions', () => {
      expect(stored(withDay('2026-10-02', { blocks_with_txs: 95 }))).toEqual([
        1, 0, 1,
      ])
    })

    it('refuses a day with a block missing inside it', () => {
      expect(stored(withDay('2026-10-02', { blocks: 99 }))).toEqual([1, 0, 1])
    })

    it('refuses both days around a hole that crosses midnight', () => {
      // 2 Oct ends at 189 and 3 Oct starts at 210
      const gap = withDay('2026-10-02', { blocks: 90, last_block: 189 }).map(
        (row) =>
          row.day === '2026-10-03'
            ? { ...row, blocks: 90, first_block: 210 }
            : row,
      )

      expect(stored(gap)).toEqual([1, 0, 0])
    })

    it('refuses both days around a day Dune has no blocks of', () => {
      // 1 Oct has blocks 0 to 49, 2 Oct none, 3 Oct 250 to 299
      const gap = whole
        .filter((row) => row.day !== '2026-10-02')
        .map((row) =>
          row.day === '2026-10-01'
            ? { ...row, blocks: 50, last_block: 49 }
            : row.day === '2026-10-03'
              ? { ...row, blocks: 50, first_block: 250 }
              : row,
        )

      expect(stored(gap)).toEqual([0, 0, 0])
    })

    it('stores the days around a halt, when the chain made no blocks', () => {
      // No blocks on 2 Oct, and 3 Oct carries on from 1 Oct
      const halt = whole
        .filter((row) => row.day !== '2026-10-02')
        .map((row) =>
          row.day === '2026-10-03'
            ? { ...row, first_block: 100, last_block: 199 }
            : row.day === '2026-10-04'
              ? { ...row, first_block: 200, last_block: 299 }
              : row,
        )

      expect(stored(halt)).toEqual([1, 0, 1])
    })

    it('refuses a day of a chain read from transactions when a block has none', () => {
      expect(stored(whole, { ...zksync, gasFromTransactions: true })).toEqual([
        0, 0, 0,
      ])
    })
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
