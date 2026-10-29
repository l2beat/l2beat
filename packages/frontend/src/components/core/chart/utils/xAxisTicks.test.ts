import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getTickCondition, getTimeTicks } from './xAxisTicks'

describe(getTickCondition.name, () => {
  // Labels are UTC, so ticks must land on UTC dates. West of UTC, a UTC
  // midnight is still the previous local day, so local-time getters pick
  // the wrong days.
  const originalTz = process.env.TZ
  before(() => {
    process.env.TZ = 'America/New_York'
  })
  after(() => {
    if (originalTz === undefined) Reflect.deleteProperty(process.env, 'TZ')
    else process.env.TZ = originalTz
  })

  const cases = [
    {
      range: '30 days',
      from: '2026-06-15',
      to: '2026-07-14',
      ticks: [
        '2026-06-15',
        '2026-06-22',
        '2026-06-29',
        '2026-07-06',
        '2026-07-13',
      ],
    },
    {
      range: '180 days',
      from: '2026-01-01',
      to: '2026-06-29',
      ticks: [
        '2026-01-01',
        '2026-02-01',
        '2026-03-01',
        '2026-04-01',
        '2026-05-01',
        '2026-06-01',
      ],
    },
    {
      range: '1 year',
      from: '2025-07-01',
      to: '2026-06-30',
      ticks: [
        '2025-07-01',
        '2025-09-01',
        '2025-11-01',
        '2026-01-01',
        '2026-03-01',
        '2026-05-01',
      ],
    },
  ]

  for (const { range, from, to, ticks } of cases) {
    it(`places ${range} ticks on UTC dates`, () => {
      const timestamps = dailyPoints(from, to)
      const rangeInDays = timestamps.length - 1

      const result = timestamps
        .filter(getTickCondition(rangeInDays))
        .map(toIsoDate)

      expect(result).toEqual(ticks)
    })
  }
})

describe(getTimeTicks.name, () => {
  it('leaves out ticks whose labels would be cut off at the plot edges', () => {
    const timestamps = dailyPoints('2026-06-15', '2026-07-14')

    const { values, format } = getTimeTicks(timestamps)

    // 2026-06-15 is a tick day, but it is the first row.
    expect(values.map(toIsoDate)).toEqual([
      '2026-06-22',
      '2026-06-29',
      '2026-07-06',
      '2026-07-13',
    ])
    expect(format(values[0] ?? 0)).toEqual('22 Jun')
  })

  it('has no ticks without rows', () => {
    expect(getTimeTicks([]).values).toEqual([])
  })
})

function dailyPoints(from: string, to: string) {
  const points: number[] = []
  const end = UnixTime.fromDate(new Date(to))
  for (
    let timestamp = UnixTime.fromDate(new Date(from));
    timestamp <= end;
    timestamp += UnixTime.DAY
  ) {
    points.push(timestamp)
  }
  return points
}

function toIsoDate(timestamp: number) {
  return new Date(Number(timestamp) * 1000).toISOString().slice(0, 10)
}
