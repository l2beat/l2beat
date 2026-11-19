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
} from './withLiveActivity'

const DAY = UnixTime.toStartOf(UnixTime(1_800_000_000), 'day')
const H = UnixTime.HOUR

type Row = [number, number | null, number | null, number | null, number | null]

describe(toRecentHours.name, () => {
  it('adds the stored blocks activity has not summed to its hours', () => {
    // Methodology: activity summed hour 13 save its last blocks, which are
    // stored with the ones after them
    const result = toRecentHours(
      [summed(DAY + 12 * H, 400), summed(DAY + 13 * H, 1)],
      [stored(DAY + 13 * H, 60), stored(DAY + 14 * H, 7)],
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

  it('has none without stored blocks', () => {
    expect(toRecentHours([summed(DAY + 13 * H, 1)], [], DAY)).toEqual(undefined)
  })
})

describe(appendRecentPoints.name, () => {
  const PROJECT = ProjectId('base')
  const hours = (counts: [UnixTime, number, number][]) =>
    new Map(counts.map(([t, count, uopsCount]) => [t, { count, uopsCount }]))
  const recentOf = (
    projectUntil: UnixTime,
    ethereumUntil: UnixTime,
  ): Map<ProjectId, RecentHours> =>
    new Map([
      [
        PROJECT,
        {
          hours: hours([
            [DAY + 13 * H, 10, 12],
            [DAY + 14 * H, 20, 22],
          ]),
          until: projectUntil,
        },
      ],
      [
        ProjectId.ETHEREUM,
        {
          hours: hours([
            [DAY + 13 * H, 5, 6],
            [DAY + 14 * H, 7, 8],
          ]),
          until: ethereumUntil,
        },
      ],
    ])
  const append = (data: Row[], recent: Map<ProjectId, RecentHours>) =>
    appendRecentPoints(data, recent, PROJECT, 'hour', (t, own, ethereum) => [
      t,
      own.count,
      ethereum?.count ?? null,
      own.uopsCount,
      ethereum?.uopsCount ?? null,
    ])

  it("adds the project's recent hours, with Ethereum's beside the whole ones", () => {
    // Methodology: the project reaches 14:20, Ethereum 14:10. Hour 13 is
    // whole for both, hour 14 is under way for both
    const result = append(
      [[DAY + 12 * H, 1, 2, 3, 4]],
      recentOf(DAY + 14 * H + 1200, DAY + 14 * H + 600),
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
    const result = append(
      [[DAY + 12 * H, 1, 2, 3, 4]],
      recentOf(DAY + 13 * H + 2400, DAY + 14 * H + 600),
    )

    expect(result.data.at(-1)).toEqual([DAY + 13 * H, 10, null, 12, null])
  })

  it('puts recent points in place of the periods activity has not summed', () => {
    // Methodology: a range ending this hour has an empty row for it
    const result = append(
      [
        [DAY + 12 * H, 1, 2, 3, 4],
        [DAY + 13 * H, null, null, null, null],
      ],
      recentOf(DAY + 14 * H + 1200, DAY + 14 * H + 600),
    )

    expect(result.data).toEqual([
      [DAY + 12 * H, 1, 2, 3, 4],
      [DAY + 13 * H, 10, 5, 12, 6],
      [DAY + 14 * H, 20, null, 22, null],
    ])
  })

  it('has the hours without blocks after the last summed one, at zero', () => {
    // Methodology: the chart ends at hour 11, and hour 12 had no blocks
    const result = append(
      [[DAY + 11 * H, 1, 2, 3, 4]],
      recentOf(DAY + 14 * H + 1200, DAY + 14 * H + 600),
    )

    expect(result.data.slice(1, 3)).toEqual([
      [DAY + 12 * H, 0, 0, 0, 0],
      [DAY + 13 * H, 10, 5, 12, 6],
    ])
  })

  it('leaves out an hour under way for less than 10 minutes', () => {
    const result = append(
      [[DAY + 12 * H, 1, 2, 3, 4]],
      recentOf(DAY + 14 * H + 300, DAY + 14 * H + 300),
    )

    expect(result.data.at(-1)?.[0]).toEqual(DAY + 13 * H)
  })

  it('sums the day so far once it is an hour old', () => {
    const day = (until: UnixTime) =>
      appendRecentPoints<[number, number | null, number | null]>(
        [[DAY - UnixTime.DAY, 1, 2]],
        new Map([
          [
            ProjectId.ETHEREUM,
            { hours: hours([[DAY + 13 * H, 3600, 4000]]), until },
          ],
        ]),
        ProjectId.ETHEREUM,
        'day',
        (t, own) => [t, own.count, own.uopsCount],
      )

    expect(day(DAY + 13 * H).data.at(-1)).toEqual([DAY, 3600, 4000])
    expect(day(DAY + 1800).liveUntil).toEqual(undefined)
  })

  it('leaves the chart as it is without recent hours of the project', () => {
    const data: Row[] = [[DAY + 12 * H, 1, 2, 3, 4]]

    expect(append(data, new Map())).toEqual({ data, liveUntil: undefined })
  })
})

function summed(timestamp: UnixTime, count: number): HourlyActivityRecord {
  return { projectId: ProjectId('base'), timestamp, count, uopsCount: null }
}

function stored(timestamp: UnixTime, count: number): LiveActivityHourRecord {
  return { timestamp, count, uopsCount: count, lastTimestamp: timestamp + 600 }
}
