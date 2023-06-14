import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getStarkexLastDay } from './StarkexCounter'

describe(getStarkexLastDay.name, () => {
  it('returns current day', () => {
    const now = UnixTime.fromDate(new Date('2021-09-07T03:00:00Z'))

    expect(getStarkexLastDay(now)).toEqual(
      UnixTime.fromDate(new Date('2021-09-07T00:00:00Z')).toDays(),
    )
  })
})
