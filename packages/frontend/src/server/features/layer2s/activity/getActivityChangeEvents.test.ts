import type { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ChangeCategory } from '../../utils/changeEventConstants'
import { RISE_HISTORY_DAYS } from '../../utils/findPeakRises'
import { computeActivityChangeCandidates } from './getActivityChangeEvents'

describe(computeActivityChangeCandidates.name, () => {
  // Days before VISIBLE are baseline history; one project spikes on SPIKE.
  const START = UnixTime(1_700_006_400)
  const HISTORY = RISE_HISTORY_DAYS + 10
  const DAYS = HISTORY + 60
  const VISIBLE_FROM = START + HISTORY * UnixTime.DAY
  const SPIKE = HISTORY + 30
  const categories = new Map<string, ChangeCategory>([
    ['a', 'rollups'],
    ['b', 'rollups'],
    ['c', 'others'],
  ])

  function series(
    projectId: string,
    valueAt: (day: number) => number | undefined,
  ): ActivityRecord[] {
    return Array.from({ length: DAYS }, (_, day) => valueAt(day)).flatMap(
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
    return computeActivityChangeCandidates(
      records,
      categories,
      VISIBLE_FROM,
    ).filter((c) => c.metric === 'tps')
  }

  it('splits a rise across the projects that drove it', () => {
    const candidates = compute(
      series('a', () => 10_000),
      series('b', (d) => (d === SPIKE ? 9_000 : 1_000)),
      series('c', () => 500),
    )

    expect(candidates).toEqual([
      expect.subset({
        category: 'rollups',
        peak: START + SPIKE * UnixTime.DAY,
        observed: 19_000,
        levels: [
          expect.subset({
            onset: START + SPIKE * UnixTime.DAY,
            baseline: 11_000,
            contributors: [['b', 8_000]],
            restDelta: 0,
          }),
        ],
      }),
    ])
  })
})
