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
      },
    ])
  })

  it("takes a chain's day as whole only once its blocks run into a later day's", () => {
    const days = joinFeesDays(
      chains,
      day,
      UnixTime(day + UnixTime.DAY),
      [fees('zksync', '2026-10-01'), fees('zksync', '2026-10-02')],
      [blocks('zksync', '2026-10-01'), blocks('zksync', '2026-10-02')],
    )

    expect(days.map((d) => d.records.length)).toEqual([1, 0])
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

    it('refuses a day whose fee rows used less gas than its blocks', () => {
      expect(stored(withDay('2026-10-02', { gas_used: 1e9 + 21_000 }))).toEqual(
        [1, 0, 1],
      )
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

    it('stores a day the chain made no blocks on as one without transactions', () => {
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
      const days = joinFeesDays(
        [zksync],
        day,
        UnixTime(day + 2 * UnixTime.DAY),
        ['01', '03', '04'].map((d) => fees('zksync', `2026-10-${d}`)),
        halt,
      )

      expect(days.map((d) => d.records.length)).toEqual([1, 1, 1])
      expect(days[1]?.records[0]).toEqual({
        timestamp: UnixTime(day + UnixTime.DAY),
        chain: 'zksync2',
        txCount: 0,
        totalFeeNative: 0,
        totalFeeUsd: 0,
        l1FeeNative: 0,
        blobFeeNative: 0,
        baseFeeNative: 0,
        gasUsed: 0,
        medianFeeUsd: null,
      })
    })

    it('checks the first day of a read against the day before it', () => {
      // 30 Sep ends at -11, so ten blocks are missing before 1 Oct
      const before = blocks('zksync', '2026-09-30', {
        first_block: -110,
        last_block: -11,
      })

      expect(stored([before, ...whole])).toEqual([0, 1, 1])
    })

    it('stores the last day of a read before a halt, from the day the chain resumes on', () => {
      // No blocks on 2 Oct; 3 Oct, beyond the days read, carries on from 1 Oct
      const resumed = blocks('zksync', '2026-10-03', {
        first_block: 100,
        last_block: 199,
      })
      const days = joinFeesDays(
        [zksync],
        day,
        day,
        [fees('zksync', '2026-10-01')],
        [blocks('zksync', '2026-10-01'), resumed],
      )

      expect(days.map((d) => d.records.length)).toEqual([1])
    })

    it('refuses the earliest day read unless it starts the chain', () => {
      // 1 Oct starts at block 50 with no earlier day to follow
      const cut = withDay('2026-10-01', { blocks: 50, first_block: 50 })

      expect(stored(cut)).toEqual([0, 1, 1])
    })

    it('refuses a day of a chain read from transactions when a block has none', () => {
      const fromTransactions = { ...zksync, gasFromTransactions: true as const }
      const all = whole.map((row) => ({ ...row, tx_blocks: 100 }))
      const short = all.map((row) =>
        row.day === '2026-10-02' ? { ...row, tx_blocks: 99 } : row,
      )

      expect(stored(all, fromTransactions)).toEqual([1, 1, 1])
      expect(stored(short, fromTransactions)).toEqual([1, 0, 1])
    })
  })
})

describe('joinFeesDays on what Dune had', () => {
  const stored = (
    chains: GasFeesChain[],
    from: string,
    to: string,
    feeRows: FeesRow[],
    blockRows: BlocksRow[],
  ) =>
    joinFeesDays(chains, date(from), date(to), feeRows, blockRows).map((d) =>
      d.records.map((r) => r.chain),
    )

  it('Taiko, June 2026: a halt from the 22nd to the 30th, and fee rows missing on the 22nd', () => {
    // Block counts, ranges and gas as read from Dune in November 2026
    const taiko: GasFeesChain = {
      id: 'taiko',
      dune: 'taiko',
      requiredFrom: date('2024-06-01'),
    }
    const blockRows = (
      [
        ['2026-06-18', 34_469, 7_975_057, 8_009_525, 4_589_427_921],
        ['2026-06-19', 33_187, 8_009_526, 8_042_712, 4_357_157_516],
        ['2026-06-20', 33_446, 8_042_713, 8_076_158, 4_386_826_736],
        ['2026-06-21', 29_954, 8_076_159, 8_106_112, 3_907_623_841],
        ['2026-06-22', 3_896, 8_106_113, 8_110_008, 480_112_545],
        // No blocks until the 30th, which carries on from the 22nd
        ['2026-06-30', 33_140, 8_110_009, 8_143_148, 5_008_752_320],
        ['2026-07-01', 43_151, 8_143_149, 8_186_299, null],
        ['2026-07-02', 43_140, 8_186_300, 8_229_439, null],
      ] as const
    ).map(([day, count, first, last, gas]) =>
      blocks('taiko', day, {
        blocks: count,
        first_block: first,
        last_block: last,
        gas_used: gas,
      }),
    )
    const feeRows = (
      [
        ['2026-06-20', 4_386_826_736],
        ['2026-06-21', 3_907_623_841],
        // gas.fees has 2,842 of the day's 4,549 transactions
        ['2026-06-22', 302_778_838],
        ['2026-06-30', 5_008_752_320],
      ] as const
    ).map(([day, gas]) => ({ ...fees('taiko', day), gas_used: gas }))

    expect(
      stored([taiko], '2026-06-20', '2026-06-30', feeRows, blockRows),
    ).toEqual([
      ['taiko'],
      ['taiko'],
      // The 22nd is short of fee rows
      [],
      // No blocks from the 23rd to the 29th: days without transactions
      ...Array.from({ length: 7 }, () => ['taiko']),
      // The day it resumed joins the 22nd across the halt
      ['taiko'],
    ])
  })

  it('Abstract, loaded a day late: its newest day waits while the other chains are stored', () => {
    // The shape Dune had at 03:00 on 17 Nov 2026: Abstract's blocks ended around noon on the 16th
    const chains: GasFeesChain[] = ['ethereum', 'abstract'].map((id) => ({
      id,
      dune: id,
      requiredFrom: date('2025-01-27'),
    }))
    const day = (chain: string, day: string, first: number, count: number) => ({
      fee: fees(chain, day),
      block: blocks(chain, day, {
        blocks: count,
        first_block: first,
        last_block: first + count - 1,
      }),
    })
    const rows = [
      day('ethereum', '2026-11-15', 0, 7_200),
      day('ethereum', '2026-11-16', 7_200, 7_200),
      day('ethereum', '2026-11-17', 14_400, 900),
      day('abstract', '2026-11-15', 0, 43_000),
      day('abstract', '2026-11-16', 43_000, 21_000),
    ]

    expect(
      stored(
        chains,
        '2026-11-15',
        '2026-11-16',
        rows.map((r) => r.fee),
        rows.map((r) => r.block),
      ),
    ).toEqual([['ethereum', 'abstract'], ['ethereum']])
  })
})

function date(day: string): UnixTime {
  return UnixTime.fromDate(new Date(`${day}T00:00:00Z`))
}

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
    gas_used: 1e9,
  }
}

/** 100 blocks a day from block 0 on 2026-10-01 */
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
    tx_blocks: null,
    blocks: 100,
    first_block: first,
    last_block: first + 99,
    ...overrides,
  }
}
