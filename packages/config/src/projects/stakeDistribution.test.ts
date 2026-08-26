import { expect } from 'earl'
import { ProjectStakeDistributionSchema } from '../types'

describe('stake distribution schema', () => {
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
      ProjectStakeDistributionSchema.parse({
        ...valid,
        date: '2026-08-06T08:48:58.389Z',
      }),
    ).toThrow()
    expect(() =>
      ProjectStakeDistributionSchema.parse({ ...valid, date: '2026-13-45' }),
    ).toThrow()
  })

  it('rejects a fetched date that does not parse as a timestamp', () => {
    expect(() =>
      ProjectStakeDistributionSchema.parse({
        ...valid,
        dateType: 'fetched',
        date: 'not a date',
      }),
    ).toThrow()
  })
})
