import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getMissingTimestamps, timeRange } from './timerange'

describe(timeRange.name, () => {
  it('creates hourly timestamp range', () => {
    const to = UnixTime.now()
    const from = to.add(-3, 'hours')

    expect(timeRange(from, to, 'hourly')).toEqual([
      from,
      from.add(1, 'hours'),
      from.add(2, 'hours'),
    ])
  })

  it('creates six hourly timestamp range', () => {
    const to = UnixTime.now()
    const from = to.add(-24, 'hours')

    expect(timeRange(from, to, 'sixHourly')).toEqual([
      from,
      from.add(6, 'hours'),
      from.add(12, 'hours'),
      from.add(18, 'hours'),
    ])
  })

  it('creates daily timestamp range', () => {
    const to = UnixTime.now()
    const from = to.add(-5, 'days')

    expect(timeRange(from, to, 'daily')).toEqual([
      from,
      from.add(1, 'days'),
      from.add(2, 'days'),
      from.add(3, 'days'),
      from.add(4, 'days'),
    ])
  })
})

describe(getMissingTimestamps.name, () => {
  it('returns missing timestamps with hourly resolution', () => {
    const now = UnixTime.now()

    const from = now.add(-7, 'hours')
    const to = now

    const data = [
      { timestamp: from },
      { timestamp: from.add(1, 'hours') },
      // 2 hours offset to fill
      { timestamp: from.add(3, 'hours') },
      { timestamp: from.add(4, 'hours') },
      // 5 hours offset to fill
      // 6 hours offset to fill
    ]

    const result = getMissingTimestamps(data, from, to, 'hourly')

    expect(result).toEqual([
      from.add(2, 'hours'),
      from.add(5, 'hours'),
      from.add(6, 'hours'),
    ])
  })

  it('returns missing timestamps with six-hourly resolution', () => {
    const now = new UnixTime(100_000_000)

    const from = now.add(-48, 'hours')

    const actualFrom = from.toStartOf('day')

    const data = [
      { timestamp: actualFrom },
      { timestamp: actualFrom.add(6, 'hours') },
      // 12 hours offset to fill
      { timestamp: actualFrom.add(18, 'hours') },
      { timestamp: actualFrom.add(24, 'hours') },
      // 30 hours offset to fill
      // 36 hours offset to fill
      { timestamp: actualFrom.add(42, 'hours') },
      // 48 hours offset to fill
    ]

    const result = getMissingTimestamps(data, from, now, 'sixHourly')

    expect(result).toEqual([
      actualFrom.add(12, 'hours'),
      actualFrom.add(30, 'hours'),
      actualFrom.add(36, 'hours'),
      actualFrom.add(48, 'hours'),
    ])
  })

  it('returns missing timestamps with daily resolution', () => {
    const now = UnixTime.now()

    const from = now.add(-7, 'days')

    const data = [
      { timestamp: from },
      { timestamp: from.add(1, 'days') },
      // 2 days offset to fill
      { timestamp: from.add(3, 'days') },
      // 4 days offset to fill
      { timestamp: from.add(5, 'days') },
      // 6 days offset to fill
    ]

    const result = getMissingTimestamps(data, from, now, 'daily')

    expect(result).toEqual([
      from.add(2, 'days'),
      from.add(4, 'days'),
      from.add(6, 'days'),
    ])
  })
})
