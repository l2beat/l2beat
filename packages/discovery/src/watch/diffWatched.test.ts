import type { json } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { diffWatched } from './diffWatched'

describe(diffWatched.name, () => {
  it('is empty for equal values', () => {
    const values = { a: { x: [1, 2], y: 'z' }, b: 1 }
    expect(diffWatched(values, structuredClone(values))).toEqual([])
  })

  it('reports added, removed and changed leaves of a keyed object', () => {
    const previous = { leads: { a: { s: 'open' }, b: { s: 'open' } } }
    const current = { leads: { a: { s: 'handled' }, c: { s: 'open' } } }
    expect(diffWatched(previous, current)).toEqual([
      {
        key: 'leads',
        changes: [
          { path: ['a', 's'], before: 'open', after: 'handled' },
          { path: ['b'], before: { s: 'open' } },
          { path: ['c'], after: { s: 'open' } },
        ],
      },
    ])
  })

  it('reads keys named like Object.prototype members as absent', () => {
    expect(
      diffWatched({ constructor: 1 }, { leads: { toString: 'a' } }),
    ).toEqual([
      { key: 'constructor', changes: [{ path: [], before: 1 }] },
      { key: 'leads', changes: [{ path: [], after: { toString: 'a' } }] },
    ])
    expect(
      diffWatched({ leads: { a: 1 } }, { leads: { a: 1, valueOf: 2 } }),
    ).toEqual([{ key: 'leads', changes: [{ path: ['valueOf'], after: 2 }] }])
  })

  it('reports a whole watch key added or removed as one change', () => {
    expect(diffWatched({ old: { a: 1 } }, { new: [1] })).toEqual([
      { key: 'new', changes: [{ path: [], after: [1] }] },
      { key: 'old', changes: [{ path: [], before: { a: 1 } }] },
    ])
  })

  it('compares arrays and type changes as a whole', () => {
    const previous = { list: [1, 2], kind: { a: 1 } }
    const current = { list: [2, 1], kind: 'a' }
    expect(diffWatched(previous, current)).toEqual([
      { key: 'kind', changes: [{ path: [], before: { a: 1 }, after: 'a' }] },
      { key: 'list', changes: [{ path: [], before: [1, 2], after: [2, 1] }] },
    ])
  })

  it('ignores object key order', () => {
    expect(diffWatched({ a: { x: 1, y: 2 } }, { a: { y: 2, x: 1 } })).toEqual(
      [],
    )
  })

  it('rejects values deeper than 8 levels', () => {
    let previous: json = 1
    let current: json = 2
    for (let i = 0; i < 9; i++) {
      previous = { a: previous }
      current = { a: current }
    }
    expect(() => diffWatched({ k: previous }, { k: current })).toThrow(
      'Watched value too deep',
    )
  })
})
