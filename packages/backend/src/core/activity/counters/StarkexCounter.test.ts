import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { getStarkexLastDay } from './StarkexCounter'

describe(getStarkexLastDay.name, () => {
  it('returns 2 days ago when called early in the morning', () => {
    const now = UnixTime.fromDate(new Date('2021-09-07T03:00:00Z'))

    expect(getStarkexLastDay(now)).toEqual(
      UnixTime.fromDate(new Date('2021-09-05T00:00:00Z')).toDays(),
    )
  })

  it('returns 1 day ago when called not in the eary morning', () => {
    const now = UnixTime.fromDate(new Date('2021-09-07T05:00:00Z'))

    expect(getStarkexLastDay(now)).toEqual(
      UnixTime.fromDate(new Date('2021-09-06T00:00:00Z')).toDays(),
    )
  })
})
