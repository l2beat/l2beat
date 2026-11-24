import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ChangeCategory } from '../../utils/changeEventConstants'
import { computeTvsChangeEvents } from './getTvsChangeEvents'

describe(computeTvsChangeEvents.name, () => {
  // Projects with slowly drifting TVS for 40 days; tests bend one day (35)
  // and check what gets reported. Days 0-29 only build the history.
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

    const events = computeTvsChangeEvents(records, categories, VISIBLE_FROM)

    expect(events.length).toEqual(1)
    const [event] = events
    expect(event?.timestamp).toEqual(DAY_35)
    expect(event?.category).toEqual('rollups')
    expect(event?.isPeak).toEqual(true)
    expect(event?.contributors[0]?.[0]).toEqual('a')
    // The day after the jump TVS stays up, which is not a change.
    expect(events.some((e) => e.timestamp > DAY_35)).toEqual(false)
  })

  it('reports drops too', () => {
    const records = [
      ...series('a', drift(10e9)),
      ...series('b', drift(5e9)),
      ...series('c', (day) => drift(1e9)(day) - (day >= 35 ? 4e8 : 0)),
    ]

    const [event] = computeTvsChangeEvents(records, categories, VISIBLE_FROM)

    expect(event?.category).toEqual('others')
    expect((event?.observed ?? 0) < (event?.baseline ?? 0)).toEqual(true)
  })

  it('ignores a market move that lifts every project alike', () => {
    const rally = (base: number) => (day: number) =>
      drift(base)(day) * (day >= 35 ? 1.1 : 1)
    const records = [
      ...series('a', rally(10e9)),
      ...series('b', rally(5e9)),
      ...series('c', rally(1e9)),
    ]

    expect(computeTvsChangeEvents(records, categories, VISIBLE_FROM)).toEqual(
      [],
    )
  })

  it('ignores a jump that is small next to all L2 TVS', () => {
    const records = [
      ...series('a', drift(100e9)),
      ...series('b', drift(50e9)),
      ...series('c', (day) => drift(1e8)(day) + (day >= 35 ? 5e7 : 0)),
    ]

    expect(computeTvsChangeEvents(records, categories, VISIBLE_FROM)).toEqual(
      [],
    )
  })

  it('leaves out a project missing the day before', () => {
    const records = [
      ...series('a', drift(10e9)),
      ...series('b', drift(5e9)),
      // A new project appears on day 35 with 3B: not a change of any day.
      ...series('c', (day) => (day >= 35 ? 3e9 : Number.NaN)).filter(
        (r) => !Number.isNaN(r.value),
      ),
    ]

    expect(computeTvsChangeEvents(records, categories, VISIBLE_FROM)).toEqual(
      [],
    )
  })
})
