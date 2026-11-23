import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getLiquidStakingTvlSummary,
  getYearChange,
  isComplete,
  type TvlBreakdown,
  toBreakdown,
} from './liquidStakingTvlBreakdown'

const day = (
  timestamp: number,
  projects: Record<string, number | null>,
  staked: number | null,
  supply: number | null = 200,
) => toBreakdown({ timestamp, projects, staked, supply, ethPrice: 2 })

describe(toBreakdown.name, () => {
  it('splits the supply into the protocols, Others and the ETH not staked', () => {
    expect(day(1, { lido: 15, rocketpool: 10 }, 50)).toEqual({
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
    const breakdown = day(1, { lido: 15, rocketpool: null }, 50)
    expect(breakdown.liquid).toEqual(null)
    expect(breakdown.others).toEqual(null)
    expect(breakdown.notStaked).toEqual(150)
    expect(isComplete(breakdown)).toEqual(false)
  })

  it('leaves out a part that would be below zero, since its inputs disagree', () => {
    const breakdown = day(1, { lido: 60 }, 50, 40)
    expect(breakdown.others).toEqual(null)
    expect(breakdown.notStaked).toEqual(null)
    expect(isComplete(breakdown)).toEqual(false)
  })
})

describe(getLiquidStakingTvlSummary.name, () => {
  it('takes the latest complete day', () => {
    const summary = getLiquidStakingTvlSummary([
      day(1, { lido: 8, rocketpool: 2 }, 40, null),
      day(2, { lido: 10, rocketpool: null }, 50),
      day(3, { lido: 10, rocketpool: 2 }, null),
    ])
    expect(summary?.latest.timestamp).toEqual(1)
    expect(summary?.latest.others).toEqual(30)
  })

  it('ends the yearly changes on the same day, not on a later partial one', () => {
    const summary = getLiquidStakingTvlSummary([
      day(0, { lido: 8 }, 40, 100),
      day(UnixTime.DAY, { lido: 8 }, 50, 110),
      day(2 * UnixTime.DAY, { lido: null }, 60, 120),
    ])
    expect(summary?.stakeChange?.until).toEqual(UnixTime.DAY)
    expect(summary?.supplyChange?.eth).toEqual(10)
  })

  it('has no supply change when the latest day has no supply', () => {
    const summary = getLiquidStakingTvlSummary([
      day(0, { lido: 8 }, 40, 100),
      day(UnixTime.DAY, { lido: 8 }, 50, null),
    ])
    expect(summary?.stakeChange).not.toEqual(undefined)
    expect(summary?.supplyChange).toEqual(undefined)
  })

  it('has nothing without a complete day', () => {
    expect(getLiquidStakingTvlSummary([day(1, { lido: 8 }, null)])).toEqual(
      undefined,
    )
  })
})

describe(getYearChange.name, () => {
  const n = (days: number) => days * UnixTime.DAY
  const staked = (b: TvlBreakdown) => b.staked
  const withStake = (days: number, value: number | null) =>
    day(n(days), {}, value)

  it('compares the latest value with the first within the year', () => {
    expect(
      getYearChange(
        [
          withStake(0, 30),
          withStake(2, null),
          withStake(3, 40),
          withStake(367, 50),
          withStake(368, null),
        ],
        staked,
      ),
    ).toEqual({ value: 0.25, eth: 10, since: n(3), until: n(367) })
  })

  it('has no change from a single day', () => {
    expect(getYearChange([withStake(1, 40)], staked)).toEqual(undefined)
  })
})
