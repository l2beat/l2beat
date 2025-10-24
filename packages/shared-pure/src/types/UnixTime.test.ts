import { expect } from 'earl'

import { UnixTime } from './UnixTime.js'

describe(UnixTime.name, () => {
  it('represents time as seconds since Jan 01 1970', () => {
    const date = new Date('2021-09-07T00:00:00Z')
    const time = UnixTime.fromDate(date)
    const seconds = Math.floor(date.getTime() / 1000)

    expect(time).toEqual(seconds)
  })

  it('cannot be constructed from milliseconds', () => {
    expect(() => UnixTime(Date.now())).toThrow(
      TypeError,
      'timestamp too large!',
    )
  })

  it('cannot be constructed from non-integers', () => {
    expect(() => UnixTime(6.9)).toThrow(
      TypeError,
      'timestamp must be an integer',
    )
  })

  it('cannot be constructed from non-integers', () => {
    expect(() => UnixTime(6.9)).toThrow(
      TypeError,
      'timestamp must be an integer',
    )
  })

  describe('maths', () => {
    it('can add days', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const later = time + 3 * UnixTime.DAY
      expect(UnixTime.toDate(later)).toEqual(new Date('2021-09-10T00:00:00Z'))
    })

    it('can add hours', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const later = time + 5 * UnixTime.HOUR
      expect(UnixTime.toDate(later)).toEqual(new Date('2021-09-07T05:00:00Z'))
    })

    it('can add minutes', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const later = time + 4 * UnixTime.MINUTE
      expect(UnixTime.toDate(later)).toEqual(new Date('2021-09-07T00:04:00Z'))
    })

    it('can add seconds', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const later = time + 6
      expect(UnixTime.toDate(later)).toEqual(new Date('2021-09-07T00:00:06Z'))
    })
  })

  describe(UnixTime.toStartOf.name, () => {
    it('day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const start = UnixTime.toStartOf(time, 'day')
      expect(UnixTime.toDate(start)).toEqual(new Date('2021-09-07T00:00:00Z'))
    })

    it('beginning of a day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const start = UnixTime.toStartOf(time, 'day')
      expect(UnixTime.toDate(start)).toEqual(new Date('2021-09-07T00:00:00Z'))
    })

    it('hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const start = UnixTime.toStartOf(time, 'hour')
      expect(UnixTime.toDate(start)).toEqual(new Date('2021-09-07T12:00:00Z'))
    })

    it('beginning of an hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:00:00Z'))
      const start = UnixTime.toStartOf(time, 'hour')
      expect(UnixTime.toDate(start)).toEqual(new Date('2021-09-07T12:00:00Z'))
    })

    it('minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const start = UnixTime.toStartOf(time, 'minute')
      expect(UnixTime.toDate(start)).toEqual(new Date('2021-09-07T12:34:00Z'))
    })

    it('beginning of a minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:00Z'))
      const start = UnixTime.toStartOf(time, 'minute')
      expect(UnixTime.toDate(start)).toEqual(new Date('2021-09-07T12:34:00Z'))
    })
  })

  describe(UnixTime.toNext.name, () => {
    it('day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const end = UnixTime.toNext(time, 'day')
      expect(UnixTime.toDate(end)).toEqual(new Date('2021-09-08T00:00:00Z'))
    })

    it('beginning of a day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-08T00:00:00Z'))
      const end = UnixTime.toNext(time, 'day')
      expect(UnixTime.toDate(end)).toEqual(new Date('2021-09-09T00:00:00Z'))
    })

    it('hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const end = UnixTime.toNext(time, 'hour')
      expect(UnixTime.toDate(end)).toEqual(new Date('2021-09-07T13:00:00Z'))
    })

    it('beginning of an hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:00:00Z'))
      const end = UnixTime.toNext(time, 'hour')
      expect(UnixTime.toDate(end)).toEqual(new Date('2021-09-07T13:00:00Z'))
    })

    it('minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const end = UnixTime.toNext(time, 'minute')
      expect(UnixTime.toDate(end)).toEqual(new Date('2021-09-07T12:35:00Z'))
    })

    it('beginning of a minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:00Z'))
      const end = UnixTime.toNext(time, 'minute')
      expect(UnixTime.toDate(end)).toEqual(new Date('2021-09-07T12:35:00Z'))
    })
  })

  describe(UnixTime.isFull.name, () => {
    it('full day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-08T00:00:00Z'))
      expect(UnixTime.isFull(time, 'day')).toEqual(true)
    })

    it('not full day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-08T10:13:51Z'))
      expect(UnixTime.isFull(time, 'day')).toEqual(false)
    })

    it('full hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:00:00Z'))
      expect(UnixTime.isFull(time, 'hour')).toEqual(true)
    })

    it('not full hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:01:10Z'))
      expect(UnixTime.isFull(time, 'hour')).toEqual(false)
    })

    it('full minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:10:00Z'))
      expect(UnixTime.isFull(time, 'minute')).toEqual(true)
    })

    it('not full minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:10:01Z'))
      expect(UnixTime.isFull(time, 'minute')).toEqual(false)
    })

    it('full sixHourly', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T06:00:00Z'))
      expect(UnixTime.isFull(time, 'six hours')).toEqual(true)
    })

    it('not full sixHourly', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T06:01:01Z'))
      expect(UnixTime.isFull(time, 'six hours')).toEqual(false)
    })
  })

  describe(UnixTime.toEndOf.name, () => {
    it('adjusts to the end of day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const end = UnixTime.toEndOf(time, 'day')
      expect(UnixTime.toDate(end)).toEqual(new Date('2021-09-08T00:00:00Z'))
    })

    it('does not adjust if already at the end of day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const end = UnixTime.toEndOf(time, 'day')
      expect(UnixTime.toDate(end)).toEqual(new Date('2021-09-07T00:00:00Z'))
    })
  })

  describe('inExclusiveRange', () => {
    const testCases = [
      { value: 2, from: 1, to: 3, result: true },

      { value: 2, from: 2, to: 3, result: false },
      { value: 3, from: 1, to: 3, result: false },

      { value: 2, from: 3, to: 6, result: false },
      { value: 8, from: 3, to: 6, result: false },
    ]

    for (const { value, from, to, result } of testCases) {
      it(`${value}.inExclusiveRange(${from}, ${to}) = ${result.toString()}`, () => {
        expect(UnixTime.inExclusiveRange(value, from, to)).toEqual(result)
      })
    }
  })
})
