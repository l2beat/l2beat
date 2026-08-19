import { expect } from 'earl'
import { findRangeChanges, formatRange } from './ranges'

describe(findRangeChanges.name, () => {
  const identity = (id: string, since: number, until?: number) => ({
    id,
    label: `label ${id}`,
    since,
    until,
  })

  it('reports a changed since', () => {
    expect(
      findRangeChanges([identity('a', 100)], [identity('a', 120)]),
    ).toEqual([
      {
        id: 'a',
        label: 'label a',
        old: { since: 100, until: undefined },
        new: { since: 120, until: undefined },
      },
    ])
  })

  it('reports a range that got closed', () => {
    expect(
      findRangeChanges([identity('a', 100)], [identity('a', 100, 200)]),
    ).toEqual([
      {
        id: 'a',
        label: 'label a',
        old: { since: 100, until: undefined },
        new: { since: 100, until: 200 },
      },
    ])
  })

  it('reports a changed until', () => {
    expect(
      findRangeChanges([identity('a', 100, 200)], [identity('a', 100, 250)]),
    ).toEqual([
      {
        id: 'a',
        label: 'label a',
        old: { since: 100, until: 200 },
        new: { since: 100, until: 250 },
      },
    ])
  })

  it('ignores unchanged ranges and label-only changes', () => {
    const committed = [identity('a', 100, 200), identity('b', 5)]
    const current = [
      { ...identity('a', 100, 200), label: 'renamed' },
      identity('b', 5),
    ]
    expect(findRangeChanges(committed, current)).toEqual([])
  })

  it('ignores identities missing on either side', () => {
    expect(findRangeChanges([identity('a', 1)], [identity('b', 2)])).toEqual([])
  })
})

describe(formatRange.name, () => {
  it('formats an open range', () => {
    expect(formatRange({ since: 100 })).toEqual('100 -> open')
  })

  it('formats a closed range', () => {
    expect(formatRange({ since: 100, until: 200 })).toEqual('100 -> 200')
  })
})
