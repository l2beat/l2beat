import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  formatTimestamp,
  formatTimestampToDateWithHour,
  getNextDateForDayOfWeek,
} from './dates'

describe('dates', () => {
  describe(formatTimestampToDateWithHour.name, () => {
    it('12:00', () => {
      const date = UnixTime.fromDate(new Date('2021-04-21T12:00:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '12:00 PM UTC, Apr 21st 2021',
      )
    })

    it('00:00', () => {
      const date = UnixTime.fromDate(new Date('2021-04-21T00:00:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '12:00 AM UTC, Apr 21st 2021',
      )
    })

    it('11:30', () => {
      const date = UnixTime.fromDate(new Date('1968-12-31T11:30:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '11:30 AM UTC, Dec 31st 1968',
      )
    })

    it('5:00', () => {
      const date = UnixTime.fromDate(new Date('2030-01-01T05:00:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '5:00 AM UTC, Jan 01st 2030',
      )
    })

    it('nd', () => {
      const date = UnixTime.fromDate(new Date('2031-05-22T05:00:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '5:00 AM UTC, May 22nd 2031',
      )
    })

    it('rd', () => {
      const date = UnixTime.fromDate(new Date('2031-05-23T05:00:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '5:00 AM UTC, May 23rd 2031',
      )
    })

    it('th', () => {
      const date = UnixTime.fromDate(new Date('2022-08-05T13:00:00Z'))
      expect(formatTimestampToDateWithHour(date)).toEqual(
        '1:00 PM UTC, Aug 05th 2022',
      )
    })
  })

  describe(formatTimestamp.name, () => {
    describe('without options', () => {
      it('returns date with short month name and without time', () => {
        const date1 = UnixTime.fromDate(new Date('2021-04-21T12:00:00Z'))
        expect(formatTimestamp(date1)).toEqual('2021 Apr 21')
        const date2 = UnixTime.fromDate(new Date('1968-12-31T11:30:00Z'))
        expect(formatTimestamp(date2)).toEqual('1968 Dec 31')
        const date3 = UnixTime.fromDate(new Date('2030-01-01T05:00:00Z'))
        expect(formatTimestamp(date3)).toEqual('2030 Jan 01')
      })
    })

    describe('with options', () => {
      describe('mode', () => {
        describe('date', () => {
          it('returns date with short month name and without time', () => {
            const date1 = UnixTime.fromDate(new Date('2021-04-21T12:00:00Z'))
            expect(formatTimestamp(date1, { mode: 'date' })).toEqual(
              '2021 Apr 21',
            )
            const date2 = UnixTime.fromDate(new Date('1968-12-31T11:30:00Z'))
            expect(formatTimestamp(date2, { mode: 'date' })).toEqual(
              '1968 Dec 31',
            )
            const date3 = UnixTime.fromDate(new Date('2030-01-01T05:00:00Z'))
            expect(formatTimestamp(date3, { mode: 'date' })).toEqual(
              '2030 Jan 01',
            )
          })
        })

        describe('datetime', () => {
          it('returns date with short month name and time', () => {
            const date1 = UnixTime.fromDate(new Date('2021-04-21T12:00:00Z'))
            expect(formatTimestamp(date1, { mode: 'datetime' })).toEqual(
              '2021 Apr 21, 12:00 UTC',
            )
            const date2 = UnixTime.fromDate(new Date('1968-12-31T11:30:00Z'))
            expect(formatTimestamp(date2, { mode: 'datetime' })).toEqual(
              '1968 Dec 31, 11:30 UTC',
            )
            const date3 = UnixTime.fromDate(new Date('2030-01-01T05:00:00Z'))
            expect(formatTimestamp(date3, { mode: 'datetime' })).toEqual(
              '2030 Jan 01, 05:00 UTC',
            )
          })
        })

        describe('time', () => {
          it('returns time', () => {
            const date1 = UnixTime.fromDate(new Date('2021-04-21T12:00:00Z'))
            expect(formatTimestamp(date1, { mode: 'time' })).toEqual(
              '12:00 UTC',
            )
            const date2 = UnixTime.fromDate(new Date('1968-12-31T11:30:00Z'))
            expect(formatTimestamp(date2, { mode: 'time' })).toEqual(
              '11:30 UTC',
            )
            const date3 = UnixTime.fromDate(new Date('2030-01-01T05:00:00Z'))
            expect(formatTimestamp(date3, { mode: 'time' })).toEqual(
              '05:00 UTC',
            )
          })
        })
      })

      describe('longMonthName', () => {
        it('returns date with long month name and without time', () => {
          const date1 = UnixTime.fromDate(new Date('2021-04-21T12:00:00Z'))
          expect(formatTimestamp(date1, { longMonthName: true })).toEqual(
            '2021 April 21',
          )
          const date2 = UnixTime.fromDate(new Date('1968-12-31T11:30:00Z'))
          expect(formatTimestamp(date2, { longMonthName: true })).toEqual(
            '1968 December 31',
          )
          const date3 = UnixTime.fromDate(new Date('2030-01-01T05:00:00Z'))
          expect(formatTimestamp(date3, { longMonthName: true })).toEqual(
            '2030 January 01',
          )
        })
      })
    })
  })

  describe(getNextDateForDayOfWeek.name, () => {
    it('returns next date for given day of the week', () => {
      const date = new Date('2021-04-21T12:00:00Z')
      const nextThursday = getNextDateForDayOfWeek(4, date)
      expect(nextThursday.toISOString()).toEqual('2021-04-22T00:00:00.000Z')
    })
  })
})
