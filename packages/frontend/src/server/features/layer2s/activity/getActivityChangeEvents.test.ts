import type { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  type ActivityChangeCategory,
  computeActivityChangeEvents,
} from './getActivityChangeEvents'

describe(computeActivityChangeEvents.name, () => {
  // Projects with steady daily counts for 40 days; tests bend one day (35)
  // and check what gets reported. Days 0-29 only build the baseline.
  const START = UnixTime(1_700_006_400)
  const VISIBLE_FROM = START + 30 * UnixTime.DAY
  const DAY_35 = START + 35 * UnixTime.DAY
  const categories = new Map<string, ActivityChangeCategory>([
    ['a', 'rollups'],
    ['b', 'rollups'],
    ['c', 'others'],
  ])

  function series(
    projectId: string,
    valueAt: (day: number) => number | undefined,
  ): ActivityRecord[] {
    return Array.from({ length: 40 }, (_, day) => valueAt(day)).flatMap(
      (count, day) =>
        count === undefined
          ? []
          : [
              {
                projectId: ProjectId(projectId),
                timestamp: UnixTime(START + day * UnixTime.DAY),
                count,
                uopsCount: null,
                start: 0,
                end: 0,
              },
            ],
    )
  }

  function compute(...parts: ActivityRecord[][]) {
    const records = parts.flat().sort((x, y) => x.timestamp - y.timestamp)
    return computeActivityChangeEvents(
      records,
      categories,
      VISIBLE_FROM,
    ).filter((e) => e.metric === 'tps')
  }

  const steadyA = series('a', () => 10_000_000)

  it('reports a rise with the project that drove it', () => {
    const events = compute(
      steadyA,
      series('b', (d) => (d === 35 ? 8_000_000 : 1_000_000)),
    )

    expect(events).toEqual([
      expect.subset({
        timestamp: DAY_35,
        category: 'rollups',
        contributors: [['b', 7_000_000, false]],
      }),
    ])
  })

  it('reports drops too', () => {
    const events = compute(
      steadyA,
      series('b', (d) => (d === 35 ? 100_000 : 8_000_000)),
    )

    expect(events.map((e) => [e.timestamp, e.observed < e.baseline])).toEqual([
      [DAY_35, true],
    ])
  })

  it('does not count a missing day as a drop to zero', () => {
    const events = compute(
      steadyA,
      series('b', (d) => (d === 35 ? undefined : 8_000_000)),
    )

    expect(events).toEqual([])
  })

  it('ignores a change that is small next to all L2 activity', () => {
    // Others triples, but it is a rounding error next to rollups.
    const events = compute(
      steadyA,
      series('c', (d) => (d === 35 ? 600_000 : 200_000 + (d % 2) * 2_000)),
    )

    expect(events).toEqual([])
  })

  it('keeps every day of a multi-day surge and marks its peak', () => {
    const events = compute(
      steadyA,
      series('b', (d) =>
        d === 34 ? 6_000_000 : d === 35 ? 9_000_000 : 1_000_000,
      ),
    )

    expect(events.map((e) => [e.timestamp, e.isPeak])).toEqual([
      [DAY_35 - UnixTime.DAY, false],
      [DAY_35, true],
    ])
  })

  it('treats a surge with a calm day in the middle as one event', () => {
    const events = compute(
      steadyA,
      series('b', (d) =>
        d === 33 ? 6_000_000 : d === 35 ? 9_000_000 : 1_000_000,
      ),
    )

    expect(events.filter((e) => e.isPeak).map((e) => e.timestamp)).toEqual([
      DAY_35,
    ])
  })
})
