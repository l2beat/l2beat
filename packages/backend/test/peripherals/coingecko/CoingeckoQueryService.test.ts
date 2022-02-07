import { CoingeckoClient, mock, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import {
  pickPrices,
  getFullTimestampsList,
} from '../../../src/peripherals/coingecko/CoingeckoQueryService'

describe(pickPrices.name, () => {
  const START = new UnixTime(1517961600)

  it('handles full days', () => {
    const prices = [
      { price: 1000, date: START.toDate() },
      { price: 1100, date: START.add(1, 'days').toDate() },
      { price: 1200, date: START.add(2, 'days').toDate() },
    ]
    const timestamps = getFullTimestampsList(START, START.add(2, 'days'), 'daily')

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: 0 },
      { value: 1100, timestamp: START.add(1, 'days'), deltaMs: 0 },
      { value: 1200, timestamp: START.add(2, 'days'), deltaMs: 0 },
    ])
  })

  it('adjusts dates for slightly off days', () => {
    const prices = [
      { price: 1000, date: START.add(2, 'minutes').toDate() },
      { price: 1100, date: START.add(1, 'days').add(1, 'minutes').toDate() },
      { price: 1200, date: START.add(2, 'days').add(3, 'minutes').toDate() },
    ]
    const timestamps = getFullTimestampsList(START, START.add(2, 'days'), 'daily')

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: 2 * 60 * 1000 },
      {
        value: 1100,
        timestamp: START.add(1, 'days'),
        deltaMs: 1 * 60 * 1000,
      },
      { value: 1200, timestamp: START.add(2, 'days'), deltaMs: 3 * 60 * 1000 },
    ])
  })

  it('adjusts dates before the first timestamp', () => {
    const prices = [
      { price: 1000, date: START.add(-2, 'minutes').toDate() },
      { price: 1100, date: START.add(1, 'days').toDate() },
      { price: 1200, date: START.add(2, 'days').toDate() },
    ]
    const timestamps = getFullTimestampsList(START, START.add(2, 'days'), 'daily')

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: -2 * 60 * 1000 },
      {
        value: 1100,
        timestamp: START.add(1, 'days'),
        deltaMs: 0,
      },
      { value: 1200, timestamp: START.add(2, 'days'), deltaMs: 0 },
    ])
  })

  it('discards superflous data', () => {
    const prices = [
      { price: 1100, date: START.add(-2, 'minutes').toDate() },
      { price: 1200, date: START.add(1, 'minutes').toDate() },
      { price: 1300, date: START.add(1, 'days').toDate() },
      { price: 1400, date: START.add(1, 'days').add(2, 'minutes').toDate() },
      { price: 1500, date: START.add(2, 'days').add(-1, 'minutes').toDate() },
      { price: 1600, date: START.add(2, 'days').add(2, 'minutes').toDate() },
    ]
    const timestamps = getFullTimestampsList(START, START.add(2, 'days'), 'daily')

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1200, timestamp: START, deltaMs: 1 * 60 * 1000 },
      { value: 1300, timestamp: START.add(1, 'days'), deltaMs: 0 },
      { value: 1500, timestamp: START.add(2, 'days'), deltaMs: -1 * 60 * 1000 },
    ])
  })

  it('manufactures missing datapoint', () => {
    const prices = [
      { price: 1000, date: START.toDate() },
      { price: 1200, date: START.add(2, 'days').add(-1,'minutes').toDate() },
    ]
    const timestamps = getFullTimestampsList(START, START.add(2, 'days'), 'daily')

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: 0 },
      { value: 1200, timestamp: START.add(1, 'days'), deltaMs: 24 * 60 * 60 * 1000 - 60 * 1000  },
      { value: 1200, timestamp: START.add(2, 'days'), deltaMs: -60 * 1000 },
    ])
  })

  it('manufactures start and end datapoints', () => {
    const prices = [
      { price: 1100, date: START.add(1, 'days').toDate() },
    ]
    const timestamps = getFullTimestampsList(START, START.add(2, 'days'), 'daily')

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1100, timestamp: START, deltaMs: 24 * 60 * 60 * 1000 },
      { value: 1100, timestamp: START.add(1, 'days'), deltaMs: 0  },
      { value: 1100, timestamp: START.add(2, 'days'), deltaMs: -24 * 60 * 60 * 1000 },
    ])
  })

  it('manufactures start and end datapoints', () => {
    const prices = [
      { price: 1000, date: START.toDate() },
      { price: 1400, date: START.add(4, 'days').toDate() },
    ]
    const timestamps = getFullTimestampsList(START, START.add(4, 'days'), 'daily')

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: 0 },
      { value: 1000, timestamp: START.add(1, 'days'), deltaMs: -24 * 60 * 60 * 1000 },
      { value: 1000, timestamp: START.add(2, 'days'), deltaMs: -48 * 60 * 60 * 1000 },
      { value: 1400, timestamp: START.add(3, 'days'), deltaMs: 24 * 60 * 60 * 1000 },
      { value: 1400, timestamp: START.add(4, 'days'), deltaMs: 0 },
    ])
  })
})

describe(getFullTimestampsList.name, () => {
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
      expect(() => getFullTimestampsList(TO, FROM, GRANULARITY)).toThrow(
        'FROM cannot be greater than TO'
      )
    })

    it('13:00 to 15:00', () => {
      expect(getFullTimestampsList(FROM, TO, GRANULARITY)).toEqual(RESULT)
    })

    it('13:01 to 15:01', () => {
      expect(
        getFullTimestampsList(
          FROM.add(1, 'minutes'),
          TO.add(1, 'minutes'),
          GRANULARITY
        )
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

      expect(getFullTimestampsList(from, to, GRANULARITY)).toEqual(result)
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
      expect(() => getFullTimestampsList(TO, FROM, GRANULARITY)).toThrow(
        'FROM cannot be greater than TO'
      )
    })

    it('07.09.2021 00:00 to 09.09.2021 00:00', () => {
      expect(getFullTimestampsList(FROM, TO, GRANULARITY)).toEqual(RESULT)
    })

    it('07.09.2021 01:00 to 09.09.2021 01:00', () => {
      expect(
        getFullTimestampsList(
          FROM.add(1, 'hours'),
          TO.add(1, 'hours'),
          GRANULARITY
        )
      ).toEqual([
        UnixTime.fromDate(new Date('2021-09-08T00:00:00Z')),
        UnixTime.fromDate(new Date('2021-09-09T00:00:00Z')),
      ])
    })
  })
})
