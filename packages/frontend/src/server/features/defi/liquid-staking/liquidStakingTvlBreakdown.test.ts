import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { LiquidStakingTvlPoint } from './getLiquidStakingCharts'
import {
  getLiquidStakingTvlSummary,
  getYearChange,
  type TvlBreakdown,
  toBreakdown,
} from './liquidStakingTvlBreakdown'

const point = (
  timestamp: number,
  projects: Record<string, number | null>,
  ethStaked: number | null,
  ethSupply: number | null = 200,
): LiquidStakingTvlPoint => ({
  timestamp,
  projects,
  ethStaked,
  ethSupply,
  ethPrice: 2,
})

describe(toBreakdown.name, () => {
  it('splits the supply into the protocols, Others and the ETH not staked', () => {
    expect(
      toBreakdown(point(1, { lido: 15, rocketpool: 10 }, 50), [
        'lido',
        'rocketpool',
      ]),
    ).toEqual({
      timestamp: 1,
      projects: { lido: 15, rocketpool: 10 },
      liquid: 25,
      others: 25,
      staked: 50,
      notStaked: 150,
      supply: 200,
      ethPrice: 2,
    })
  })

  it('has no liquid total or Others when a protocol is missing, rather than give Others its ETH', () => {
    const breakdown = toBreakdown(point(1, { lido: 15 }, 50), [
      'lido',
      'rocketpool',
    ])
    expect(breakdown.projects).toEqual({ lido: 15, rocketpool: null })
    expect(breakdown.liquid).toEqual(null)
    expect(breakdown.others).toEqual(null)
    expect(breakdown.notStaked).toEqual(150)
  })

  it('leaves out a part that would be below zero, since its inputs disagree', () => {
    const breakdown = toBreakdown(point(1, { lido: 60 }, 50, 40), ['lido'])
    expect(breakdown.others).toEqual(null)
    expect(breakdown.notStaked).toEqual(null)
  })
})

describe(getLiquidStakingTvlSummary.name, () => {
  it('takes the latest day with the stake and every protocol', () => {
    const summary = getLiquidStakingTvlSummary(
      [
        point(1, { lido: 8, rocketpool: 2 }, 40, null),
        point(2, { lido: 10, rocketpool: null }, 50),
        point(3, { lido: 10, rocketpool: 2 }, null),
      ],
      ['lido', 'rocketpool'],
    )
    expect(summary?.latest.timestamp).toEqual(1)
    expect(summary?.latest.others).toEqual(30)
  })

  it('has nothing without such a day', () => {
    expect(
      getLiquidStakingTvlSummary([point(1, { lido: 8 }, null)], ['lido']),
    ).toEqual(undefined)
  })
})

describe(getYearChange.name, () => {
  const day = (n: number) => n * UnixTime.DAY
  const staked = (b: TvlBreakdown) => b.staked
  const breakdown = (n: number, ethStaked: number | null) =>
    toBreakdown(point(day(n), {}, ethStaked), [])

  it('compares the latest value with the first within the year', () => {
    expect(
      getYearChange(
        [
          breakdown(0, 30),
          breakdown(2, null),
          breakdown(3, 40),
          breakdown(367, 50),
          breakdown(368, null),
        ],
        staked,
      ),
    ).toEqual({ value: 0.25, eth: 10, since: day(3), until: day(367) })
  })

  it('has no change from a single day', () => {
    expect(getYearChange([breakdown(1, 40)], staked)).toEqual(undefined)
  })
})
