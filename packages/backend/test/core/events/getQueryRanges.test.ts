import { UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { getRanges } from '../../../src/core/events/EventUpdater'

describe(getRanges.name, () => {
  const FROM = new UnixTime(1660608000)
  const TO = FROM.add(12, 'hours')
  const SINCE = FROM

  it('all synced', () => {
    const earliest = FROM
    const latest = TO

    const result = getRanges(FROM, TO, earliest, latest, SINCE)

    expect(result).toEqual([])
  })

  it('missing earlier', () => {
    const earliest = FROM.add(2, 'hours')
    const latest = TO

    const result = getRanges(FROM, TO, earliest, latest, SINCE)

    expect(result).toEqual([{ from: FROM, to: earliest }])
  })

  it('missing later', () => {
    const earliest = FROM
    const latest = TO.add(-2, 'hours')

    const result = getRanges(FROM, TO, earliest, latest, SINCE)

    expect(result).toEqual([{ from: latest, to: TO }])
  })

  it('missing earlier and later', () => {
    const earliest = FROM.add(2, 'hours')
    const latest = TO.add(-2, 'hours')

    const result = getRanges(FROM, TO, earliest, latest, SINCE)

    expect(result).toEqual([
      { from: FROM, to: earliest },
      { from: latest, to: TO },
    ])
  })

  it('no data in db', () => {
    const earliest = undefined
    const latest = undefined

    const result = getRanges(FROM, TO, earliest, latest, SINCE)

    expect(result).toEqual([{ from: FROM, to: TO }])
  })

  it('SINCE later than from', () => {
    const earliest = undefined
    const latest = undefined
    const since = FROM.add(2, 'hours')

    const result = getRanges(FROM, TO, earliest, latest, since)

    expect(result).toEqual([{ from: since, to: TO }])
  })
})
