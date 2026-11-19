import type {
  HourlyActivityRecord,
  LiveActivityHourRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { appendRecentPoints, type ChainHours } from './withLiveActivity'

const DAY = UnixTime.toStartOf(UnixTime(1_800_000_000), 'day')
const H = UnixTime.HOUR
const PROJECT = ProjectId('base')

type Row = [number, number | null, number | null, number | null, number | null]
type EthereumRow = [number, number | null, number | null]

describe(appendRecentPoints.name, () => {
  const projectHours = (until: UnixTime): ChainHours => ({
    summed: [],
    stored: [stored(DAY + 13 * H, 10, 12), stored(DAY + 14 * H, 20, 22, until)],
  })
  const ethereumHours = (until: UnixTime): ChainHours => ({
    summed: [],
    stored: [stored(DAY + 13 * H, 5, 6), stored(DAY + 14 * H, 7, 8, until)],
  })
  const hoursOf = (projectUntil: UnixTime, ethereumUntil: UnixTime) =>
    new Map([
      [PROJECT, projectHours(projectUntil)],
      [ProjectId.ETHEREUM, ethereumHours(ethereumUntil)],
    ])

  it("adds the project's recent hours, with Ethereum's beside the whole ones", () => {
    // Methodology: the project reaches 14:20, Ethereum 14:10. Hour 13 is
    // whole for both, hour 14 is under way for both
    const result = append(
      [[DAY + 12 * H, 1, 2, 3, 4]],
      hoursOf(DAY + 14 * H + 1200, DAY + 14 * H + 600),
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
      new Map([
        [
          PROJECT,
          {
            summed: [],
            stored: [stored(DAY + 13 * H, 10, 12, DAY + 13 * H + 2400)],
          },
        ],
        [ProjectId.ETHEREUM, ethereumHours(DAY + 14 * H + 600)],
      ]),
    )

    expect(result.data.at(-1)).toEqual([DAY + 13 * H, 10, null, 12, null])
  })

  it('rebuilds the hour activity summed only part of', () => {
    // Methodology: activity counts hour 13 as summed after its first block;
    // the rest of the hour is stored
    const result = append(
      [
        [DAY + 12 * H, 400, null, 400, null],
        [DAY + 13 * H, 1, null, 1, null],
      ],
      new Map([
        [
          PROJECT,
          {
            summed: [summed(DAY + 12 * H, 400), summed(DAY + 13 * H, 1)],
            stored: [
              stored(DAY + 13 * H, 60, 60),
              stored(DAY + 14 * H, 7, 7, DAY + 14 * H + 600),
            ],
          },
        ],
      ]),
    )

    expect(result.data).toEqual([
      [DAY + 12 * H, 400, null, 400, null],
      [DAY + 13 * H, 61, null, 61, null],
      [DAY + 14 * H, 7, null, 7, null],
    ])
  })

  it('puts recent points in place of the periods activity has not summed', () => {
    // Methodology: a range ending this hour has an empty row for it
    const result = append(
      [
        [DAY + 12 * H, 1, 2, 3, 4],
        [DAY + 13 * H, null, null, null, null],
      ],
      hoursOf(DAY + 14 * H + 1200, DAY + 14 * H + 600),
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
      hoursOf(DAY + 14 * H + 1200, DAY + 14 * H + 600),
    )

    expect(result.data.slice(1, 3)).toEqual([
      [DAY + 12 * H, 0, 0, 0, 0],
      [DAY + 13 * H, 10, 5, 12, 6],
    ])
  })

  it('leaves out an hour under way for less than 10 minutes', () => {
    const result = append(
      [[DAY + 12 * H, 1, 2, 3, 4]],
      hoursOf(DAY + 14 * H + 300, DAY + 14 * H + 300),
    )

    expect(result.data.at(-1)?.[0]).toEqual(DAY + 13 * H)
  })

  it('rebuilds a day activity summed only part of, and sums today once an hour old', () => {
    // Methodology: activity summed yesterday up to 23:30 and counts it as
    // whole. Its last half hour is stored, with today's first hours
    const day = (until: UnixTime) =>
      appendRecentPoints<EthereumRow>(
        [
          [DAY - 2 * UnixTime.DAY, 500, 500],
          [DAY - UnixTime.DAY, 1000, 1000],
        ],
        new Map([
          [
            ProjectId.ETHEREUM,
            {
              summed: [summed(DAY - H, 1000)],
              stored: [
                stored(DAY - H, 600, 600),
                stored(DAY, 3600, 4000, until),
              ],
            },
          ],
        ]),
        ProjectId.ETHEREUM,
        'day',
        (t, own) => [t, own.count, own.uopsCount],
      )

    expect(day(DAY + 2 * H).data).toEqual([
      [DAY - 2 * UnixTime.DAY, 500, 500],
      [DAY - UnixTime.DAY, 1600, 1600],
      [DAY, 3600, 4000],
    ])
    expect(day(DAY + 1800).data.at(-1)).toEqual([
      DAY - UnixTime.DAY,
      1600,
      1600,
    ])
  })

  it('leaves the chart as it is without stored blocks of the project', () => {
    const data: Row[] = [[DAY + 12 * H, 1, 2, 3, 4]]

    expect(append(data, new Map())).toEqual({ data, liveUntil: undefined })
    expect(
      append(data, new Map([[PROJECT, { summed: [], stored: [] }]])),
    ).toEqual({ data, liveUntil: undefined })
  })
})

function append(data: Row[], hours: Map<ProjectId, ChainHours>) {
  return appendRecentPoints(
    data,
    hours,
    PROJECT,
    'hour',
    (t, own, ethereum) => [
      t,
      own.count,
      ethereum?.count ?? null,
      own.uopsCount,
      ethereum?.uopsCount ?? null,
    ],
  )
}

function summed(timestamp: UnixTime, count: number): HourlyActivityRecord {
  return { projectId: PROJECT, timestamp, count, uopsCount: null }
}

function stored(
  timestamp: UnixTime,
  count: number,
  uopsCount: number,
  lastTimestamp = timestamp + H - 1,
): LiveActivityHourRecord {
  return { timestamp, count, uopsCount, lastTimestamp }
}
