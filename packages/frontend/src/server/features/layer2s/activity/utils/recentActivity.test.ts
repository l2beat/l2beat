import type {
  HourlyActivityRecord,
  LiveActivityHourRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  appendRecentPoints,
  type RecentHours,
  toRecentHours,
  toRecentPoints,
} from './recentActivity'

const DAY = UnixTime.toStartOf(UnixTime(1_800_000_000), 'day')
const H = UnixTime.HOUR

describe(toRecentHours.name, () => {
  it('adds the stored blocks activity has not summed to its hours', () => {
    // Methodology: activity summed up to block 100, which ended hour 13 save
    // one block at its very start. Blocks 101-160 are stored
    const result = toRecentHours(
      [summed(DAY + 12 * H, 400), summed(DAY + 13 * H, 1)],
      [stored(DAY + 13 * H, 101, 150, 60), stored(DAY + 14 * H, 151, 160, 7)],
      100,
      DAY + 13 * H,
    )

    expect(result).toEqual({
      hours: new Map([
        [DAY + 13 * H, { count: 61, uopsCount: 61 }],
        [DAY + 14 * H, { count: 7, uopsCount: 7 }],
      ]),
      until: DAY + 14 * H + 600,
    })
  })

  it('has none when the stored blocks start past the ones summed', () => {
    const result = toRecentHours(
      [],
      [stored(DAY + 13 * H, 105, 150, 60)],
      100,
      DAY,
    )

    expect(result).toEqual(undefined)
  })

  it('has none when the stored blocks have a gap', () => {
    // 101-120 and 131-150: 40 blocks over 50 numbers
    const result = toRecentHours(
      [],
      [
        { ...stored(DAY + 13 * H, 101, 120, 60), blocks: 20 },
        { ...stored(DAY + 14 * H, 131, 150, 7), blocks: 20 },
      ],
      100,
      DAY,
    )

    expect(result).toEqual(undefined)
  })
})

describe(toRecentPoints.name, () => {
  const recent = (until: UnixTime): RecentHours => ({
    hours: new Map([
      [DAY + 13 * H, { count: 3600, uopsCount: 4000 }],
      [DAY + 14 * H, { count: 600, uopsCount: 700 }],
    ]),
    until,
  })

  it('gives the hours after the given one, with the hour under way', () => {
    expect(toRecentPoints(recent(DAY + 14 * H + 900), 'hour', DAY)).toEqual([
      [DAY + 13 * H, 3600, 4000],
      [DAY + 14 * H, 600, 700],
    ])
    expect(
      toRecentPoints(recent(DAY + 14 * H + 900), 'hour', DAY + 13 * H),
    ).toEqual([[DAY + 14 * H, 600, 700]])
  })

  it('leaves out an hour under way for less than 10 minutes', () => {
    expect(toRecentPoints(recent(DAY + 14 * H + 300), 'hour', DAY)).toEqual([
      [DAY + 13 * H, 3600, 4000],
    ])
  })

  it('sums the day so far once it is an hour old', () => {
    expect(toRecentPoints(recent(DAY + 14 * H + 900), 'day', 0)).toEqual([
      [DAY, 4200, 4700],
    ])
    expect(toRecentPoints(recent(DAY + 1800), 'day', 0)).toEqual([])
  })
})

describe(appendRecentPoints.name, () => {
  const PROJECT = ProjectId('base')

  it("adds the project's recent hours, with Ethereum's beside them", () => {
    const recent = new Map<ProjectId, RecentHours>([
      [
        PROJECT,
        {
          hours: new Map([[DAY + 13 * H, { count: 10, uopsCount: 12 }]]),
          until: DAY + 13 * H + 1200,
        },
      ],
      [
        ProjectId.ETHEREUM,
        {
          hours: new Map([[DAY + 13 * H, { count: 5, uopsCount: 6 }]]),
          until: DAY + 13 * H + 1100,
        },
      ],
    ])

    const result = appendRecentPoints(
      [[DAY + 12 * H, 1, 2, 3, 4]],
      recent,
      PROJECT,
      'hour',
    )

    expect(result).toEqual({
      data: [
        [DAY + 12 * H, 1, 2, 3, 4],
        [DAY + 13 * H, 10, 5, 12, 6],
      ],
      liveUntil: DAY + 13 * H + 1200,
    })
  })

  it('leaves the chart as it is without recent hours of the project', () => {
    const data: [number, number, number, number, number][] = [
      [DAY + 12 * H, 1, 2, 3, 4],
    ]

    expect(appendRecentPoints(data, new Map(), PROJECT, 'hour')).toEqual({
      data,
      liveUntil: undefined,
    })
  })
})

function summed(timestamp: UnixTime, count: number): HourlyActivityRecord {
  return { projectId: ProjectId('base'), timestamp, count, uopsCount: null }
}

function stored(
  timestamp: UnixTime,
  firstNumber: number,
  lastNumber: number,
  count: number,
): LiveActivityHourRecord {
  return {
    timestamp,
    blocks: lastNumber - firstNumber + 1,
    count,
    uopsCount: count,
    firstNumber,
    lastNumber,
    lastTimestamp: timestamp + 600,
  }
}
