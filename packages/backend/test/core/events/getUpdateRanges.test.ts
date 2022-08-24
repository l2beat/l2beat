import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { getUpdateRanges } from '../../../src/core/events/getUpdateRanges'

describe(getUpdateRanges.name, () => {
  const FROM = new UnixTime(1660608000)
  const TO = FROM.add(12, 'hours')
  const SINCE = FROM

  it('all synced', () => {
    const dbStatus = { earliest: FROM, latest: TO }

    const result = getUpdateRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([])
  })

  it('missing earlier', () => {
    const dbStatus = { earliest: FROM.add(2, 'hours'), latest: TO }

    const result = getUpdateRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([
      { from: FROM, to: dbStatus.earliest.add(-1, 'hours') },
    ])
  })

  it('missing later', () => {
    const dbStatus = { earliest: FROM, latest: TO.add(-2, 'hours') }

    const result = getUpdateRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([{ from: dbStatus.latest.add(1, 'hours'), to: TO }])
  })

  it('missing earlier and later', () => {
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

  it('no data in db', () => {
    const dbStatus = undefined

    const result = getUpdateRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([{ from: FROM, to: TO }])
  })

  it('SINCE later than from', () => {
    const dbStatus = undefined

    const since = FROM.add(2, 'hours')
    const result = getUpdateRanges(FROM, TO, dbStatus, since)

    expect(result).toEqual([{ from: since, to: TO }])
  })

  it('from equals to', () => {
    const dbStatus = undefined

    const from = TO

    const result = getUpdateRanges(from, TO, dbStatus, SINCE)

    expect(result).toEqual([{ from, to: TO }])
  })
})
