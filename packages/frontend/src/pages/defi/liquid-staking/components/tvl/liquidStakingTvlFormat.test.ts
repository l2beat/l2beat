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

  it('reads a year, or a day short of one, as 1y', () => {
    expect(formatChangePeriod(change(365))).toEqual('1y')
    expect(formatChangePeriod(change(364))).toEqual('1y')
  })

  it('gives a shorter history in days', () => {
    expect(formatChangePeriod(change(90))).toEqual('90d')
  })
})
