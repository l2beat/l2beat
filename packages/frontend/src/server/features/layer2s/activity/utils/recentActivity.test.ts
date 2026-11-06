import type {
  HourlyActivityRecord,
  LiveActivityHourRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ActivityChartDataPoint } from '../getActivityChart'
import {
  appendRecentPoints,
  type RecentHours,
  reachesNow,
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
  const recentOf = (projectUntil: UnixTime, ethereumUntil: UnixTime) =>
    new Map<ProjectId, RecentHours>([
      [
        PROJECT,
        {
          hours: new Map([
            [DAY + 13 * H, { count: 10, uopsCount: 12 }],
            [DAY + 14 * H, { count: 20, uopsCount: 22 }],
          ]),
          until: projectUntil,
        },
      ],
      [
        ProjectId.ETHEREUM,
        {
          hours: new Map([
            [DAY + 13 * H, { count: 5, uopsCount: 6 }],
            [DAY + 14 * H, { count: 7, uopsCount: 8 }],
          ]),
          until: ethereumUntil,
        },
      ],
    ])

  it("adds the project's recent hours, with Ethereum's beside the whole ones", () => {
    // Methodology: the project reaches 14:20, Ethereum 14:10. Hour 13 is
    // whole for both, hour 14 is under way for both
    const result = appendRecentPoints(
      [[DAY + 12 * H, 1, 2, 3, 4]],
      recentOf(DAY + 14 * H + 1200, DAY + 14 * H + 600),
      PROJECT,
      'hour',
    )

    expect(result).toEqual({
      data: [
        [DAY + 12 * H, 1, 2, 3, 4],
        [DAY + 13 * H, 10, 5, 12, 6],
        [DAY + 14 * H, 20, null, 22, null],
      ],
      liveUntil: DAY + 14 * H + 1200,
    })
  })

  it("leaves out Ethereum's whole hour when it is the project's under way", () => {
    // The project reaches 13:40 and Ethereum 14:10, so hour 13 is whole for
    // Ethereum only
    const result = appendRecentPoints(
      [[DAY + 12 * H, 1, 2, 3, 4]],
      recentOf(DAY + 13 * H + 2400, DAY + 14 * H + 600),
      PROJECT,
      'hour',
    )

    expect(result.data.at(-1)).toEqual([DAY + 13 * H, 10, null, 12, null])
  })

  it('puts recent points in place of the periods activity has not summed', () => {
    // Methodology: a range ending this hour has an empty row for it
    const result = appendRecentPoints(
      [
        [DAY + 12 * H, 1, 2, 3, 4],
        [DAY + 13 * H, null, null, null, null],
      ],
      recentOf(DAY + 14 * H + 1200, DAY + 14 * H + 600),
      PROJECT,
      'hour',
    )

    expect(result.data).toEqual([
      [DAY + 12 * H, 1, 2, 3, 4],
      [DAY + 13 * H, 10, 5, 12, 6],
      [DAY + 14 * H, 20, null, 22, null],
    ])
  })

  it('leaves the chart as it is when a period activity has not summed lies between', () => {
    // Methodology: the chart ends at hour 11 and the recent hours start at
    // 13, so hour 12 is missing; a last row without a value is the same
    const gap: ActivityChartDataPoint[] = [[DAY + 11 * H, 1, 2, 3, 4]]
    const empty: ActivityChartDataPoint[] = [[DAY + 12 * H, null, 2, null, 4]]
    const recent = recentOf(DAY + 14 * H + 1200, DAY + 14 * H + 600)

    expect(appendRecentPoints(gap, recent, PROJECT, 'hour')).toEqual({
      data: gap,
      liveUntil: undefined,
    })
    expect(appendRecentPoints(empty, recent, PROJECT, 'hour')).toEqual({
      data: empty,
      liveUntil: undefined,
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

describe(reachesNow.name, () => {
  // Methodology: just after midnight a preset ends before a calendar range
  // ending yesterday does, so only how they end tells them apart
  const NOW = DAY + UnixTime.HOUR + 5 * UnixTime.MINUTE

  it('holds for the presets and a calendar range ending today', () => {
    expect(
      reachesNow([DAY - 7 * UnixTime.DAY, DAY - UnixTime.HOUR], NOW),
    ).toEqual(true)
    expect(
      reachesNow([DAY - 7 * UnixTime.DAY, DAY + UnixTime.HOUR], NOW),
    ).toEqual(true)
  })

  it('does not for a calendar range ending an earlier day', () => {
    expect(reachesNow([DAY - 7 * UnixTime.DAY, DAY - 1], NOW)).toEqual(false)
    expect(
      reachesNow([DAY - 30 * UnixTime.DAY, DAY - 2 * UnixTime.DAY], NOW),
    ).toEqual(false)
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
