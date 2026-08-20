import { expect } from 'earl'
import { mergeSnapshots } from './merge'
import type { SnapshotIdentity } from './types'

const identity = (
  id: string,
  since: number,
  until?: number,
): SnapshotIdentity => ({ id, label: `label ${id}`, since, until })

describe(mergeSnapshots.name, () => {
  it('is the identity when nothing changed', () => {
    const snapshot = { proj: [identity('a', 100), identity('b', 100, 200)] }
    expect(mergeSnapshots(snapshot, snapshot)).toEqual({
      merged: snapshot,
      preserved: 0,
    })
  })

  it('appends new identities and new projects', () => {
    const { merged, preserved } = mergeSnapshots(
      { proj: [identity('a', 100)] },
      {
        proj: [identity('a', 100), identity('b', 200)],
        other: [identity('c', 1)],
      },
    )
    expect(merged).toEqual({
      other: [identity('c', 1)],
      proj: [identity('a', 100), identity('b', 200)],
    })
    expect(preserved).toEqual(0)
  })

  it('keeps a committed entry whose id disappeared, label included', () => {
    const { merged, preserved } = mergeSnapshots(
      { proj: [identity('a', 100), identity('b', 100)] },
      { proj: [identity('b', 100)] },
    )
    expect(merged).toEqual({ proj: [identity('a', 100), identity('b', 100)] })
    expect(preserved).toEqual(1)
  })

  it('keeps the committed range when the fresh one moved', () => {
    // Includes the encouraged workflow: closing an open entry is a range
    // move too and needs --overwrite.
    const { merged, preserved } = mergeSnapshots(
      { proj: [identity('a', 100)] },
      { proj: [identity('a', 100, 200)] },
    )
    expect(merged).toEqual({ proj: [identity('a', 100)] })
    expect(preserved).toEqual(1)
  })

  it('keeps a project the fresh snapshot dropped entirely', () => {
    const { merged, preserved } = mergeSnapshots(
      {
        proj: [identity('a', 100)],
        gone: [identity('b', 1), identity('c', 2)],
      },
      { proj: [identity('a', 100)] },
    )
    expect(merged).toEqual({
      gone: [identity('b', 1), identity('c', 2)],
      proj: [identity('a', 100)],
    })
    expect(preserved).toEqual(2)
  })

  it('sorts projects and identities for stable diffs', () => {
    const { merged } = mergeSnapshots(
      { b: [identity('z', 1), identity('a', 2)] },
      { a: [identity('x', 1)], b: [identity('z', 1), identity('a', 2)] },
    )
    expect(Object.keys(merged)).toEqual(['a', 'b'])
    expect(merged.b.map((e) => e.id)).toEqual(['a', 'z'])
  })
})
