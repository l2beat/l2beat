import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { formatTimestampToDateWithHour } from './dates'

describe('dates', () => {
  describe(formatTimestampToDateWithHour.name, () => {
    it('12:00', () => {
      const date = UnixTime.fromDate(new Date('2021-04-21T12:00:00Z'))
      expect(formatTimestampToDateWithHour(date.toNumber())).toEqual(
        '12:00 PM, Apr 21st 2021',
      )
    })

    it('00:00', () => {
      const date = UnixTime.fromDate(new Date('2021-04-21T00:00:00Z'))
      expect(formatTimestampToDateWithHour(date.toNumber())).toEqual(
        '12:00 AM, Apr 21st 2021',
      )
    })
  })
})
