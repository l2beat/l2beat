import { expect } from 'earl'
import type {
  ChangeCandidate,
  ChangeLevel,
} from '~/server/features/utils/changeEvents'
import { selectChangeEvents } from './selectChangeEvents'

describe(selectChangeEvents.name, () => {
  const DAY = 86_400
  const none = { contributors: [], restDelta: 0, restCount: 0 }

  function level(onset: number, baseline: number): ChangeLevel {
    return { onset: onset * DAY, baseline, ...none }
  }

  function candidate(
    peak: number,
    observed: number,
    levels: ChangeLevel[],
    steps: ChangeCandidate['steps'] = [],
  ): ChangeCandidate {
    return {
      category: 'rollups',
      metric: 'uops',
      peak: peak * DAY,
      observed,
      levels,
      steps,
    }
  }

  // A linear axis from 0 to `top`.
  function select(candidates: ChangeCandidate[], top: number) {
    return selectChangeEvents(candidates, {
      metric: 'uops',
      categories: ['rollups'],
      toPlotHeight: (value) => value / top,
      minSize: 0.15,
    }).map((e) => ({
      start: e.start / DAY,
      size: Math.round(e.size * 100) / 100,
    }))
  }

  it('pins a rise only when it looks big on the drawn axis', () => {
    const rise = candidate(10, 3_500, [level(10, 2_500)])

    // 1,000 is 20% of a 5K axis, but 10% of a 10K one.
    expect(select([rise], 5_000)).toEqual([{ start: 10, size: 0.2 }])
    expect(select([rise], 10_000)).toEqual([])
  })

  it('describes a rise with its tightest level that is big enough', () => {
    const rise = candidate(
      30,
      4_700,
      [level(30, 4_600), level(5, 2_400)],
      [{ from: 1, to: 0, ...none }],
    )

    // The spike alone is 2% of the axis; the whole rise from 2,400 is 46%.
    expect(select([rise], 5_000)).toEqual([{ start: 5, size: 0.46 }])
  })

  it('adds a pin for a step under a spike when the step is big by itself', () => {
    const rise = candidate(
      30,
      4_700,
      [level(30, 3_800), level(5, 2_400)],
      [{ from: 1, to: 0, ...none }],
    )

    expect(select([rise], 5_000)).toEqual([
      { start: 30, size: 0.18 },
      { start: 5, size: 0.28 },
    ])
  })

  it('pins rises that start on the same day once, at their largest', () => {
    const smaller = candidate(20, 3_500, [level(10, 2_400)])
    const larger = candidate(40, 3_900, [level(10, 2_400)])

    expect(select([smaller, larger], 5_000)).toEqual([{ start: 10, size: 0.3 }])
  })
})
