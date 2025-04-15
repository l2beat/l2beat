import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getTimeRangeIntersection } from './getTimeRangeIntersection'

describe(getTimeRangeIntersection.name, () => {
  it('returns the correct range with single input', () => {
    const since = UnixTime(1000)
    const until = UnixTime(2000)

    const result = getTimeRangeIntersection({
      sinceTimestamp: since,
      untilTimestamp: until,
    })

    expect(result.sinceTimestamp).toEqual(since)
    expect(result.untilTimestamp).toEqual(until)
  })

  it('returns the correct range with multiple inputs', () => {
    const result = getTimeRangeIntersection(
      {
        sinceTimestamp: UnixTime(1000),
        untilTimestamp: UnixTime(3000),
      },
      {
        sinceTimestamp: UnixTime(1500),
        untilTimestamp: UnixTime(2000),
      },
    )

    expect(result.sinceTimestamp).toEqual(UnixTime(1500)) // max of since timestamps
    expect(result.untilTimestamp).toEqual(UnixTime(2000)) // min of until timestamps
  })

  it('handles undefined untilTimestamp', () => {
    const result = getTimeRangeIntersection(
      {
        sinceTimestamp: UnixTime(1000),
        untilTimestamp: undefined,
      },
      {
        sinceTimestamp: UnixTime(1500),
        untilTimestamp: UnixTime(2000),
      },
    )

    expect(result.sinceTimestamp).toEqual(UnixTime(1500))
    expect(result.untilTimestamp).toEqual(UnixTime(2000))
  })

  it('returns undefined untilTimestamp when all are undefined', () => {
    const result = getTimeRangeIntersection(
      {
        sinceTimestamp: UnixTime(1000),
        untilTimestamp: undefined,
      },
      {
        sinceTimestamp: UnixTime(1500),
        untilTimestamp: undefined,
      },
    )

    expect(result.sinceTimestamp).toEqual(UnixTime(1500))
    expect(result.untilTimestamp).toEqual(undefined)
  })

  it('throws when any sinceTimestamp is undefined', () => {
    expect(() =>
      getTimeRangeIntersection(
        {
          sinceTimestamp: UnixTime(1000),
          untilTimestamp: UnixTime(2000),
        },
        {
          sinceTimestamp: undefined,
          untilTimestamp: UnixTime(3000),
        },
      ),
    ).toThrow('sinceTimestamp should be defined')
  })
})
