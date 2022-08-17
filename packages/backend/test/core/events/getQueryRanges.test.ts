import { UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { getQueryRanges } from '../../../src/core/events/getQueryRanges'

describe(getQueryRanges.name, () => {
  const FROM = new UnixTime(1660608000)
  const TO = FROM.add(12, 'hours')
  const SINCE = FROM

  it('all synced', () => {
    const dbStatus = { earliest: FROM, latest: TO }

    const result = getQueryRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([])
  })

  it('missing earlier', () => {
    const dbStatus = { earliest: FROM.add(2, 'hours'), latest: TO }

    const result = getQueryRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([{ from: FROM, to: dbStatus.earliest }])
  })

  it('missing later', () => {
    const dbStatus = { earliest: FROM, latest: TO.add(-2, 'hours') }

    const result = getQueryRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([{ from: dbStatus.latest, to: TO }])
  })

  it('missing earlier and later', () => {
    const dbStatus = {
      earliest: FROM.add(2, 'hours'),
      latest: TO.add(-2, 'hours'),
    }

    const result = getQueryRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([
      { from: FROM, to: dbStatus.earliest },
      { from: dbStatus.latest, to: TO },
    ])
  })

  it('no data in db', () => {
    const dbStatus = undefined

    const result = getQueryRanges(FROM, TO, dbStatus, SINCE)

    expect(result).toEqual([{ from: FROM, to: TO }])
  })

  it('SINCE later than from', () => {
    const dbStatus = undefined

    const since = FROM.add(2, 'hours')
    const result = getQueryRanges(FROM, TO, dbStatus, since)

    expect(result).toEqual([{ from: since, to: TO }])
  })
})
