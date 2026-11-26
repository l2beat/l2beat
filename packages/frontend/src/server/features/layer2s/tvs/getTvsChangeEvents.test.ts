import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ChangeCategory } from '../../utils/changeEventConstants'
import { computeTvsChangeCandidates } from './getTvsChangeEvents'

describe(computeTvsChangeCandidates.name, () => {
  // Projects with slowly drifting TVS for 40 days; tests bend them from day
  // 35 and check what gets reported.
  const START = UnixTime(1_700_006_400)
  const VISIBLE_FROM = START + 30 * UnixTime.DAY
  const DAY_35 = START + 35 * UnixTime.DAY
  const categories = new Map<string, ChangeCategory>([
    ['a', 'rollups'],
    ['b', 'rollups'],
    ['c', 'others'],
  ])

  function series(projectId: string, valueAt: (day: number) => number) {
    return Array.from({ length: 40 }, (_, day) => ({
      projectId,
      timestamp: START + day * UnixTime.DAY,
      value: valueAt(day),
    }))
  }

  // Small daily wiggles, so the usual daily change is not zero.
  const drift = (base: number) => (day: number) =>
    base * (1 + 0.002 * Math.sin(day))

  it('reports a jump with the project that drove it', () => {
    const records = [
      ...series('a', (day) => drift(10e9)(day) + (day >= 35 ? 2e9 : 0)),
      ...series('b', drift(5e9)),
      ...series('c', drift(1e9)),
    ]

    const candidates = computeTvsChangeCandidates(
      records,
      categories,
      VISIBLE_FROM,
    )

    // Each of the three-day steps that cover the jump sees it; one stays.
    expect(candidates.length).toEqual(1)
    const [candidate] = candidates
    const level = candidate?.levels[0]
    expect(candidate?.category).toEqual('rollups')
    expect((level?.onset ?? 0) <= DAY_35).toEqual(true)
    expect((candidate?.peak ?? 0) >= DAY_35).toEqual(true)
    expect(level?.contributors[0]?.[0]).toEqual('a')
  })

  it('reports drops too', () => {
    const records = [
      ...series('a', drift(10e9)),
      ...series('b', drift(5e9)),
      ...series('c', (day) => drift(1e9)(day) - (day >= 35 ? 6e8 : 0)),
    ]

    const [candidate] = computeTvsChangeCandidates(
      records,
      categories,
      VISIBLE_FROM,
    )

    expect(candidate?.category).toEqual('others')
    expect(
      (candidate?.observed ?? 0) < (candidate?.levels[0]?.baseline ?? 0),
    ).toEqual(true)
  })

  it('ignores a market move that lifts every project alike', () => {
    const rally = (base: number) => (day: number) =>
      drift(base)(day) * (day >= 35 ? 1.1 : 1)
    const records = [
      ...series('a', rally(10e9)),
      ...series('b', rally(5e9)),
      ...series('c', rally(1e9)),
    ]

    expect(
      computeTvsChangeCandidates(records, categories, VISIBLE_FROM),
    ).toEqual([])
  })

  it('leaves out a project missing the day a step starts from', () => {
    const records = [
      ...series('a', drift(10e9)),
      ...series('b', drift(5e9)),
      // A new project appears on day 35 with 3B: not a change of any step.
      ...series('c', (day) => (day >= 35 ? 3e9 : Number.NaN)).filter(
        (r) => !Number.isNaN(r.value),
      ),
    ]

    expect(
      computeTvsChangeCandidates(records, categories, VISIBLE_FROM),
    ).toEqual([])
  })
})
