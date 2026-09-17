import { expect } from 'earl'
import { readStakeDistribution } from './readStakeDistribution'

describe(readStakeDistribution.name, () => {
  const valid = {
    stakeToken: 'ETH',
    dateType: 'snapshot',
    date: '2026-08-05',
    totalStake: 1_000,
  }

  // Acceptance of valid files is covered implicitly: every committed
  // stake-distribution.json is parsed when the project configs load.
  it('rejects a snapshot date that is not YYYY-MM-DD', () => {
    expect(() =>
      readStakeDistribution({
        ...valid,
        date: '2026-08-06T08:48:58.389Z',
      }),
    ).toThrow()
    expect(() =>
      readStakeDistribution({ ...valid, date: '2026-13-45' }),
    ).toThrow()
  })

  it('rejects rolled-over calendar dates', () => {
    expect(() =>
      readStakeDistribution({ ...valid, date: '2026-02-31' }),
    ).toThrow()
  })

  it('rejects non-positive totals and counts', () => {
    expect(() => readStakeDistribution({ ...valid, totalStake: -1 })).toThrow()
    expect(() =>
      readStakeDistribution({ ...valid, validatorCount: 0.5 }),
    ).toThrow()
    expect(() =>
      readStakeDistribution({
        ...valid,
        entities: [{ name: 'A', stake: -5 }],
      }),
    ).toThrow()
  })

  it('rejects a fetched date that does not parse as a timestamp', () => {
    expect(() =>
      readStakeDistribution({
        ...valid,
        dateType: 'fetched',
        date: 'not a date',
      }),
    ).toThrow()
  })

  it('requires validatorCount only when asked', () => {
    expect(readStakeDistribution(valid).validatorCount).toEqual(undefined)
    expect(() =>
      readStakeDistribution(valid, { requireValidatorCount: true }),
    ).toThrow()
    expect(
      readStakeDistribution(
        { ...valid, validatorCount: 3 },
        { requireValidatorCount: true },
      ).validatorCount,
    ).toEqual(3)
  })
})
