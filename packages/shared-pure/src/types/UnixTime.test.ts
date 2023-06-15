import { expect } from 'earl'

import { UnixTime } from './UnixTime'

describe(UnixTime.name, () => {
  it('represents time as seconds since Jan 01 1970', () => {
    const date = new Date('2021-09-07T00:00:00Z')
    const time = UnixTime.fromDate(date)
    const seconds = Math.floor(date.getTime() / 1000)

    expect(time.toNumber()).toEqual(seconds)
  })

  it('cannot be constructed from milliseconds', () => {
    expect(() => new UnixTime(Date.now())).toThrow(
      TypeError,
      'timestamp must represent time in seconds',
    )
  })

  it('cannot be constructed from non-integers', () => {
    expect(() => new UnixTime(6.9)).toThrow(
      TypeError,
      'timestamp must be an integer',
    )
  })

  it('cannot be constructed from non-integers', () => {
    expect(() => new UnixTime(6.9)).toThrow(
      TypeError,
      'timestamp must be an integer',
    )
  })

  describe(UnixTime.prototype.add.name, () => {
    it('can add days', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const later = time.add(3, 'days')
      expect(later.toDate()).toEqual(new Date('2021-09-10T00:00:00Z'))
    })

    it('can add hours', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const later = time.add(5, 'hours')
      expect(later.toDate()).toEqual(new Date('2021-09-07T05:00:00Z'))
    })

    it('can add minutes', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const later = time.add(4, 'minutes')
      expect(later.toDate()).toEqual(new Date('2021-09-07T00:04:00Z'))
    })

    it('can add seconds', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const later = time.add(6, 'seconds')
      expect(later.toDate()).toEqual(new Date('2021-09-07T00:00:06Z'))
    })
  })

  describe(UnixTime.prototype.toStartOf.name, () => {
    it('day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const start = time.toStartOf('day')
      expect(start.toDate()).toEqual(new Date('2021-09-07T00:00:00Z'))
    })

    it('beginning of a day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const start = time.toStartOf('day')
      expect(start.toDate()).toEqual(new Date('2021-09-07T00:00:00Z'))
    })

    it('hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const start = time.toStartOf('hour')
      expect(start.toDate()).toEqual(new Date('2021-09-07T12:00:00Z'))
    })

    it('beginning of an hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:00:00Z'))
      const start = time.toStartOf('hour')
      expect(start.toDate()).toEqual(new Date('2021-09-07T12:00:00Z'))
    })

    it('minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const start = time.toStartOf('minute')
      expect(start.toDate()).toEqual(new Date('2021-09-07T12:34:00Z'))
    })

    it('beginning of a minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:00Z'))
      const start = time.toStartOf('minute')
      expect(start.toDate()).toEqual(new Date('2021-09-07T12:34:00Z'))
    })
  })

  describe(UnixTime.prototype.toNext.name, () => {
    it('day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const end = time.toNext('day')
      expect(end.toDate()).toEqual(new Date('2021-09-08T00:00:00Z'))
    })

    it('begging of a day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-08T00:00:00Z'))
      const end = time.toNext('day')
      expect(end.toDate()).toEqual(new Date('2021-09-09T00:00:00Z'))
    })

    it('hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const end = time.toNext('hour')
      expect(end.toDate()).toEqual(new Date('2021-09-07T13:00:00Z'))
    })

    it('beginning of an hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:00:00Z'))
      const end = time.toNext('hour')
      expect(end.toDate()).toEqual(new Date('2021-09-07T13:00:00Z'))
    })

    it('minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const end = time.toNext('minute')
      expect(end.toDate()).toEqual(new Date('2021-09-07T12:35:00Z'))
    })

    it('beginning of a minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:00Z'))
      const end = time.toNext('minute')
      expect(end.toDate()).toEqual(new Date('2021-09-07T12:35:00Z'))
    })
  })

  describe(UnixTime.prototype.isFull.name, () => {
    it('full day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-08T00:00:00Z'))
      expect(time.isFull('day')).toEqual(true)
    })

    it('not full day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-08T10:13:51Z'))
      expect(time.isFull('day')).toEqual(false)
    })

    it('full hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:00:00Z'))
      expect(time.isFull('hour')).toEqual(true)
    })

    it('not full hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:01:10Z'))
      expect(time.isFull('hour')).toEqual(false)
    })

    it('full minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:10:00Z'))
      expect(time.isFull('minute')).toEqual(true)
    })

    it('not full minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:10:01Z'))
      expect(time.isFull('minute')).toEqual(false)
    })

    it('full sixHourly', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T06:00:00Z'))
      expect(time.isFull('six hours')).toEqual(true)
    })

    it('not full sixHourly', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T06:01:01Z'))
      expect(time.isFull('six hours')).toEqual(false)
    })
  })

  describe(UnixTime.isSafeToCast.name, () => {
    it('correct timestamp', () => {
      const timestamp = 1661873521
      expect(UnixTime.isSafeToCast(timestamp)).toEqual(true)
    })
    it('too small number', () => {
      const timestamp = new Date('3000-01-01T00:00:00.001Z').getTime()
      expect(UnixTime.isSafeToCast(timestamp)).toEqual(false)
    })
    it('too big number', () => {
      const timestamp = new Date('2018-12-31T23:59:59Z').getTime()
      expect(UnixTime.isSafeToCast(timestamp)).toEqual(false)
    })
    it('not an integer', () => {
      const timestamp = 1.1
      expect(UnixTime.isSafeToCast(timestamp)).toEqual(false)
    })
  })

  describe('comparison methods', () => {
    const testCases = [
      { a: 4, method: 'lt' as const, b: 3, result: false },
      { a: 4, method: 'lt' as const, b: 4, result: false },
      { a: 4, method: 'lt' as const, b: 5, result: true },

      { a: 4, method: 'lte' as const, b: 3, result: false },
      { a: 4, method: 'lte' as const, b: 4, result: true },
      { a: 4, method: 'lte' as const, b: 5, result: true },

      { a: 4, method: 'gt' as const, b: 3, result: true },
      { a: 4, method: 'gt' as const, b: 4, result: false },
      { a: 4, method: 'gt' as const, b: 5, result: false },

      { a: 4, method: 'gte' as const, b: 3, result: true },
      { a: 4, method: 'gte' as const, b: 4, result: true },
      { a: 4, method: 'gte' as const, b: 5, result: false },

      { a: 4, method: 'equals' as const, b: 3, result: false },
      { a: 4, method: 'equals' as const, b: 4, result: true },
      { a: 4, method: 'equals' as const, b: 5, result: false },
    ]

    for (const { a, method, b, result } of testCases) {
      it(`${a}.${method}(${b}) = ${result.toString()}`, () => {
        expect(new UnixTime(a)[method](new UnixTime(b))).toEqual(result)
      })
    }
  })
})
