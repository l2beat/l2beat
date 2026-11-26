import { expect } from 'earl'
import type { ChangeCategory } from '~/server/features/utils/changeEventConstants'
import type {
  ChangeCandidate,
  ChangeLevel,
} from '~/server/features/utils/changeEvents'
import { selectChangeEvents } from './selectChangeEvents'

describe(selectChangeEvents.name, () => {
  const DAY = 86_400
  const none = { contributors: [], restDelta: 0, restCount: 0 }
  // Around every candidate here, rollups reach 5K and others 10K.
  const scale = { rollups: 5_000, others: 10_000 }

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
      scale,
    }
  }

  function select(
    candidates: ChangeCandidate[],
    categories: ChangeCategory[] = ['rollups'],
  ) {
    return selectChangeEvents(candidates, {
      metric: 'uops',
      categories,
      minSize: 0.15,
    }).map((e) => ({
      start: e.start / DAY,
      size: Math.round(e.size * 100) / 100,
    }))
  }

  it('pins a rise only when it is big next to the shown series', () => {
    const rise = candidate(10, 3_500, [level(10, 2_500)])

    // 1,000 is 20% of rollups' 5K, but 10% once others' 10K is shown too.
    expect(select([rise])).toEqual([{ start: 10, size: 0.2 }])
    expect(select([rise], ['rollups', 'others'])).toEqual([])
  })

  it('describes a rise with its tightest level that is big enough', () => {
    const rise = candidate(
      30,
      4_700,
      [level(30, 4_600), level(5, 2_400)],
      [{ from: 1, to: 0, ...none }],
    )

    // The spike alone is 2% of the scale; the whole rise from 2,400 is 46%.
    expect(select([rise])).toEqual([{ start: 5, size: 0.46 }])
  })

  it('adds a pin for a step under a spike when the step is big by itself', () => {
    const rise = candidate(
      30,
      4_700,
      [level(30, 3_800), level(5, 2_400)],
      [{ from: 1, to: 0, ...none }],
    )

    expect(select([rise])).toEqual([
      { start: 30, size: 0.18 },
      { start: 5, size: 0.28 },
    ])
  })

  it('pins rises that start on the same day once, at their largest', () => {
    const smaller = candidate(20, 3_500, [level(10, 2_400)])
    const larger = candidate(40, 3_900, [level(10, 2_400)])

    expect(select([smaller, larger])).toEqual([{ start: 10, size: 0.3 }])
  })
})
