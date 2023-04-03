import { expect } from 'earl'

import { UnixTime } from '../types'
import { getTimestamps } from './getTimestamps'

describe(getTimestamps.name, () => {
  describe('hourly', () => {
    const GRANULARITY = 'hourly'
    const FROM = UnixTime.fromDate(new Date('2021-09-07T13:00:00Z'))
    const TO = UnixTime.fromDate(new Date('2021-09-07T15:00:00Z'))

    const RESULT = [
      FROM,
      UnixTime.fromDate(new Date('2021-09-07T14:00:00Z')),
      TO,
    ]

    it('throws if FROM greater than TO', () => {
      expect(() => getTimestamps(TO, FROM, GRANULARITY)).toThrow(
        'FROM cannot be greater than TO',
      )
    })

    it('13:00 to 15:00', () => {
      expect(getTimestamps(FROM, TO, GRANULARITY)).toEqual(RESULT)
    })

    it('13:01 to 15:01', () => {
      expect(
        getTimestamps(
          FROM.add(1, 'minutes'),
          TO.add(1, 'minutes'),
          GRANULARITY,
        ),
      ).toEqual([
        UnixTime.fromDate(new Date('2021-09-07T14:00:00Z')),
        UnixTime.fromDate(new Date('2021-09-07T15:00:00Z')),
      ])
    })

    it('23:00 to 01:00', () => {
      const from = UnixTime.fromDate(new Date('2021-09-07T23:00:00Z'))
      const to = UnixTime.fromDate(new Date('2021-09-08T01:00:00Z'))
      const result = [
        from,
        UnixTime.fromDate(new Date('2021-09-08T00:00:00Z')),
        to,
      ]

      expect(getTimestamps(from, to, GRANULARITY)).toEqual(result)
    })
  })

  describe('daily', () => {
    const GRANULARITY = 'daily'
    const FROM = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
    const TO = UnixTime.fromDate(new Date('2021-09-09T00:00:00Z'))

    const RESULT = [
      FROM,
      UnixTime.fromDate(new Date('2021-09-08T00:00:00Z')),
      TO,
    ]

    it('throws if FROM greater than TO', () => {
      expect(() => getTimestamps(TO, FROM, GRANULARITY)).toThrow(
        'FROM cannot be greater than TO',
      )
    })

    it('07.09.2021 00:00 to 09.09.2021 00:00', () => {
      expect(getTimestamps(FROM, TO, GRANULARITY)).toEqual(RESULT)
    })

    it('07.09.2021 01:00 to 09.09.2021 01:00', () => {
      expect(
        getTimestamps(FROM.add(1, 'hours'), TO.add(1, 'hours'), GRANULARITY),
      ).toEqual([
        UnixTime.fromDate(new Date('2021-09-08T00:00:00Z')),
        UnixTime.fromDate(new Date('2021-09-09T00:00:00Z')),
      ])
    })
  })
})
