import { expect } from 'earljs'

import { UnixTime } from '../../src/model/UnixTime'

describe('UnixTime', () => {
  it('represents time as seconds since Jan 01 1970', () => {
    const date = new Date('2021-09-07T00:00:00Z')
    const time = UnixTime.fromDate(date)
    const seconds = Math.floor(date.getTime() / 1000)

    expect(time.toNumber()).toEqual(seconds)
  })

  it('cannot be constructed from milliseconds', () => {
    expect(() => new UnixTime(Date.now())).toThrow(
      TypeError,
      'timestamp must represent time in seconds'
    )
  })

  it('cannot be constructed from non-integers', () => {
    expect(() => new UnixTime(6.9)).toThrow(
      TypeError,
      'timestamp must be an integer'
    )
  })

  it('cannot be constructed from non-integers', () => {
    expect(() => new UnixTime(6.9)).toThrow(
      TypeError,
      'timestamp must be an integer'
    )
  })

  describe('add', () => {
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

  describe('toStartOf', () => {
    it('can get start of day', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const start = time.toStartOf('day')
      expect(start.toDate()).toEqual(new Date('2021-09-07T00:00:00Z'))
    })

    it('can get start of hour', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const start = time.toStartOf('hour')
      expect(start.toDate()).toEqual(new Date('2021-09-07T12:00:00Z'))
    })

    it('can get start of minute', () => {
      const time = UnixTime.fromDate(new Date('2021-09-07T12:34:56Z'))
      const start = time.toStartOf('minute')
      expect(start.toDate()).toEqual(new Date('2021-09-07T12:34:00Z'))
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
      it(`${a}.${method}(${b}) = ${result}`, () => {
        expect(new UnixTime(a)[method](new UnixTime(b))).toEqual(result)
      })
    }
  })
})
