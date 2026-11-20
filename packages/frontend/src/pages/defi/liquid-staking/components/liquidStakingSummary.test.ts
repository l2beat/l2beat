import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  formatChangePeriod,
  getLiquidStakingSummary,
  getStakeChange,
  getSupplyChange,
} from './liquidStakingSummary'

describe(getLiquidStakingSummary.name, () => {
  const point = (
    timestamp: number,
    ethStaked: number | null,
    projects: Record<string, number | null>,
  ) => ({ timestamp, ethStaked, ethPrice: 1, projects })

  it('reads the latest stake and its shares in ETH', () => {
    const summary = getLiquidStakingSummary(
      [
        point(100, 40, { lido: 8, rocketpool: 2 }),
        point(200, 50, { lido: 15, rocketpool: 10 }),
      ],
      ['lido', 'rocketpool'],
      200,
    )

    expect(summary).toEqual({
      timestamp: 200,
      ethStaked: 50,
      ethPrice: 1,
      ethSupply: 200,
      supplyShare: 0.25,
      liquid: { eth: 25, share: 0.5 },
      others: { eth: 25, share: 0.5 },
      byProject: [
        { id: 'lido', eth: 15, share: 0.3 },
        { id: 'rocketpool', eth: 10, share: 0.2 },
      ],
      largest: { id: 'lido', eth: 15, share: 0.3 },
      supplySplit: {
        liquid: { eth: 25, share: 0.125 },
        others: { eth: 25, share: 0.125 },
        unstaked: { eth: 150, share: 0.75 },
      },
    })
  })

  it('splits the supply on the same day as the shares, so the parts add up', () => {
    const summary = getLiquidStakingSummary(
      [
        point(100, 40, { lido: 8, rocketpool: 2 }),
        point(200, 50, { lido: 10, rocketpool: null }),
      ],
      ['lido', 'rocketpool'],
      200,
    )

    expect(summary?.supplyShare).toEqual(0.25)
    expect(summary?.supplySplit).toEqual({
      liquid: { eth: 10, share: 0.05 },
      others: { eth: 30, share: 0.15 },
      unstaked: { eth: 160, share: 0.8 },
    })
  })

  it('takes shares from the latest day with every protocol, and leaves the supply share out without a supply', () => {
    const summary = getLiquidStakingSummary(
      [
        point(100, 40, { lido: 8, rocketpool: 2 }),
        point(200, 50, { lido: 10, rocketpool: null }),
      ],
      ['lido', 'rocketpool'],
      undefined,
    )

    expect(summary?.liquid).toEqual({ eth: 10, share: 0.25 })
    expect(summary?.largest).toEqual({ id: 'lido', eth: 8, share: 0.2 })
    expect(summary?.supplyShare).toEqual(undefined)
  })

  it('has nothing without a stake', () => {
    expect(
      getLiquidStakingSummary([point(100, null, { lido: 8 })], ['lido'], 100),
    ).toEqual(undefined)
  })
})

describe(getSupplyChange.name, () => {
  const day = (n: number) => n * UnixTime.DAY

  it('compares the latest supply with the first day within the year', () => {
    const history = [
      { timestamp: day(0), value: 90 },
      { timestamp: day(1), value: 100 },
      { timestamp: day(366), value: 125 },
    ]

    expect(getSupplyChange(history)).toEqual({
      value: 0.25,
      eth: 25,
      since: day(1),
      until: day(366),
    })
  })

  it('has no change from a single day', () => {
    expect(getSupplyChange([{ timestamp: day(1), value: 100 }])).toEqual(
      undefined,
    )
  })
})

describe(getStakeChange.name, () => {
  const day = (n: number) => n * UnixTime.DAY
  const point = (n: number, ethStaked: number | null) => ({
    timestamp: day(n),
    ethStaked,
    ethPrice: 1,
    projects: {},
  })

  it('compares the latest stake with the first within the year', () => {
    expect(
      getStakeChange([
        point(0, 30),
        point(2, null),
        point(3, 40),
        point(367, 50),
        point(368, null),
      ]),
    ).toEqual({ value: 0.25, eth: 10, since: day(3), until: day(367) })
  })

  it('has no change from a single day', () => {
    expect(getStakeChange([point(1, 40)])).toEqual(undefined)
  })
})

describe(formatChangePeriod.name, () => {
  const change = (days: number) => ({
    value: 0,
    eth: 0,
    since: 0,
    until: days * UnixTime.DAY,
  })

  it('reads a year, or a day short of one, as 1y', () => {
    expect(formatChangePeriod(change(365))).toEqual('1y')
    expect(formatChangePeriod(change(364))).toEqual('1y')
  })

  it('gives a shorter history in days', () => {
    expect(formatChangePeriod(change(90))).toEqual('90d')
  })
})
