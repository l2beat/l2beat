import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { formatTimestampToDateWithHour } from './dates'

describe('dates', () => {
  describe(formatTimestampToDateWithHour.name, () => {
    it('12:00', () => {
      const date = UnixTime.fromDate(new Date('2021-04-21T12:00:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '12:00 PM, Apr 21st 2021',
      )
    })

    it('00:00', () => {
      const date = UnixTime.fromDate(new Date('2021-04-21T00:00:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '12:00 AM, Apr 21st 2021',
      )
    })

    it('11:30', () => {
      const date = UnixTime.fromDate(new Date('1968-12-31T11:30:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '11:30 AM, Dec 31st 1968',
      )
    })

    it('5:00', () => {
      const date = UnixTime.fromDate(new Date('2030-01-01T05:00:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '5:00 AM, Jan 01st 2030',
      )
    })

    it('nd', () => {
      const date = UnixTime.fromDate(new Date('2031-05-22T05:00:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '5:00 AM, May 22nd 2031',
      )
    })

    it('rd', () => {
      const date = UnixTime.fromDate(new Date('2031-05-23T05:00:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '5:00 AM, May 23rd 2031',
      )
    })

    it('th', () => {
      const date = UnixTime.fromDate(new Date('2022-08-05T13:00:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '1:00 PM, Aug 05th 2022',
      )
    })
  })
})
