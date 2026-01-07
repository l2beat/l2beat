import { expect } from 'earl'

import { UnixTime } from '../types/UnixTime.js'
import { getHourlyTimestamps } from './getHourlyTimestamps.js'

describe(getHourlyTimestamps.name, () => {
  describe('hourly', () => {
    const FROM = UnixTime.fromDate(new Date('2021-09-07T13:00:00Z'))
    const TO = UnixTime.fromDate(new Date('2021-09-07T15:00:00Z'))

    const RESULT = [
      FROM,
      UnixTime.fromDate(new Date('2021-09-07T14:00:00Z')),
      TO,
    ]

    it('throws if FROM greater than TO', () => {
      expect(() => getHourlyTimestamps(TO, FROM)).toThrow(
        'FROM cannot be greater than TO',
      )
    })

    it('13:00 to 15:00', () => {
      expect(getHourlyTimestamps(FROM, TO)).toEqual(RESULT)
    })

    it('13:01 to 15:01', () => {
      expect(
        getHourlyTimestamps(
          FROM + 1 * UnixTime.MINUTE,
          TO + 1 * UnixTime.MINUTE,
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

      expect(getHourlyTimestamps(from, to)).toEqual(result)
    })
  })
})
