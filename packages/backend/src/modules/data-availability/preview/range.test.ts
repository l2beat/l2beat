import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  ceilToHour,
  clampBlockRange,
  clampTimestampRange,
  hoursInWindow,
  parseTimeArg,
  resolveWindow,
} from './range'

describe(parseTimeArg.name, () => {
  it('parses unix seconds', () => {
    expect(parseTimeArg('1700000000')).toEqual(1700000000)
  })

  it('parses ISO dates', () => {
    expect(parseTimeArg('2026-07-30T06:00:00Z')).toEqual(
      UnixTime.fromDate(new Date('2026-07-30T06:00:00Z')),
    )
  })

  it('throws on garbage', () => {
    expect(() => parseTimeArg('not-a-date')).toThrow()
  })
})

describe(resolveWindow.name, () => {
  const now = UnixTime.fromDate(new Date('2026-07-30T12:34:56Z'))
  const startOfHour = UnixTime.fromDate(new Date('2026-07-30T12:00:00Z'))

  it('defaults to the last three full hours', () => {
    expect(resolveWindow(undefined, undefined, now)).toEqual({
      from: startOfHour - 3 * UnixTime.HOUR,
      to: startOfHour,
    })
  })

  it('truncates explicit bounds to hour starts', () => {
    const from = UnixTime.fromDate(new Date('2026-07-30T05:30:00Z'))
    const to = UnixTime.fromDate(new Date('2026-07-30T08:45:00Z'))
    expect(resolveWindow(from, to, now)).toEqual({
      from: UnixTime.fromDate(new Date('2026-07-30T05:00:00Z')),
      to: UnixTime.fromDate(new Date('2026-07-30T08:00:00Z')),
    })
  })

  it('defaults from to three hours before an explicit to', () => {
    const to = UnixTime.fromDate(new Date('2026-07-30T08:00:00Z'))
    expect(resolveWindow(undefined, to, now)).toEqual({
      from: to - 3 * UnixTime.HOUR,
      to,
    })
  })

  it('throws when from is not before to', () => {
    expect(() => resolveWindow(now, now - UnixTime.HOUR, now)).toThrow()
  })
})

describe(clampBlockRange.name, () => {
  it('clamps to sinceBlock and untilBlock', () => {
    expect(
      clampBlockRange({ sinceBlock: 150, untilBlock: 180 }, 100, 200),
    ).toEqual({ from: 150, to: 180 })
  })

  it('keeps the range when the config covers it', () => {
    expect(clampBlockRange({ sinceBlock: 50 }, 100, 200)).toEqual({
      from: 100,
      to: 200,
    })
  })

  it('returns undefined when there is no overlap', () => {
    expect(clampBlockRange({ sinceBlock: 300 }, 100, 200)).toEqual(undefined)
    expect(
      clampBlockRange({ sinceBlock: 0, untilBlock: 50 }, 100, 200),
    ).toEqual(undefined)
  })
})

describe(clampTimestampRange.name, () => {
  it('clamps to sinceTimestamp and untilTimestamp', () => {
    expect(
      clampTimestampRange(
        { sinceTimestamp: 150, untilTimestamp: 180 },
        100,
        200,
      ),
    ).toEqual({ from: 150, to: 180 })
  })

  it('returns undefined when there is no overlap', () => {
    expect(clampTimestampRange({ sinceTimestamp: 200 }, 100, 200)).toEqual(
      undefined,
    )
  })
})

describe(ceilToHour.name, () => {
  it('keeps hour-aligned timestamps', () => {
    const aligned = UnixTime.fromDate(new Date('2026-07-30T05:00:00Z'))
    expect(ceilToHour(aligned)).toEqual(aligned)
  })

  it('rounds up mid-hour timestamps', () => {
    const midHour = UnixTime.fromDate(new Date('2026-07-30T05:20:00Z'))
    expect(ceilToHour(midHour)).toEqual(
      UnixTime.fromDate(new Date('2026-07-30T06:00:00Z')),
    )
  })
})

describe(hoursInWindow.name, () => {
  it('returns hour starts excluding the end', () => {
    const from = UnixTime.fromDate(new Date('2026-07-30T05:00:00Z'))
    expect(hoursInWindow({ from, to: from + 3 * UnixTime.HOUR })).toEqual([
      from,
      from + UnixTime.HOUR,
      from + 2 * UnixTime.HOUR,
    ])
  })
})
