import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { formatChangePeriod } from './liquidStakingTvlFormat'

describe(formatChangePeriod.name, () => {
  const change = (days: number) => ({
    value: 0,
    eth: 0,
    since: 0,
    until: days * UnixTime.DAY,
  })

  it('gives a period shorter than about a year in days', () => {
    expect(formatChangePeriod(change(29))).toEqual('29d')
  })

  it('gives a longer one in years to a tenth', () => {
    expect(formatChangePeriod(change(363))).toEqual('1y')
    expect(formatChangePeriod(change(1_059))).toEqual('2.9y')
  })
})
