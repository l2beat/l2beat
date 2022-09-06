import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { getUpdateRanges } from '../../../src/core/events/getUpdateRanges'

describe(getUpdateRanges.name, () => {
  const FROM = new UnixTime(1660608000)
  const UNTIL = FROM.add(4, 'hours')
  const TO = FROM.add(12, 'hours')
  const SINCE = FROM

  it('nothing to sync', () => {
    const dbStatus = { earliest: FROM, latest: TO }

    const result = getUpdateRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([])
  })

  it('whole time range to sync', () => {
    const dbStatus = undefined

    const result = getUpdateRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([{ from: FROM, to: TO }])
  })

  it('something to sync before the data stored in DB', () => {
    const dbStatus = { earliest: FROM.add(2, 'hours'), latest: TO }

    const result = getUpdateRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([
      { from: FROM, to: dbStatus.earliest.add(-1, 'hours') },
    ])
  })

  it('something to sync after the data stored in DB ', () => {
    const dbStatus = { earliest: FROM, latest: TO.add(-2, 'hours') }

    const result = getUpdateRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([{ from: dbStatus.latest.add(1, 'hours'), to: TO }])
  })

  it('something to sync before and after', () => {
    const dbStatus = {
      earliest: FROM.add(2, 'hours'),
      latest: TO.add(-2, 'hours'),
    }

    const result = getUpdateRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([
      { from: FROM, to: dbStatus.earliest.add(-1, 'hours') },
      { from: dbStatus.latest.add(1, 'hours'), to: TO },
    ])
  })

  it('only one timestamp to sync / from == to', () => {
    const dbStatus = undefined

    const from = TO

    const result = getUpdateRanges(from, TO, dbStatus, SINCE)

    expect(result).toEqual([{ from, to: TO }])
  })

  describe('sinceTimestamp', () => {
    it('cold start', () => {
      const dbStatus = undefined

      const since = FROM.add(2, 'hours')
      const result = getUpdateRanges(FROM, TO, dbStatus, since)

      expect(result).toEqual([{ from: since, to: TO }])
    })

    it('hot start', () => {
      const since = FROM.add(2, 'hours')
      const dbStatus = { earliest: since, latest: TO }

      const result = getUpdateRanges(FROM, TO, dbStatus, since, UNTIL)

      expect(result).toEqual([])
    })
  })

  describe('untilTimestamp', () => {
    it('cold start', () => {
      const dbStatus = undefined

      const result = getUpdateRanges(FROM, TO, dbStatus, SINCE, UNTIL)

      expect(result).toEqual([{ from: FROM, to: UNTIL }])
    })

    it('hot start', () => {
      const dbStatus = { earliest: FROM, latest: UNTIL }

      const result = getUpdateRanges(FROM, TO, dbStatus, SINCE, UNTIL)

      expect(result).toEqual([])
    })
  })
})
