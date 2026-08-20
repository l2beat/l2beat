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
      skipped: [],
    })
  })

  it('appends new identities and new projects', () => {
    const { merged, skipped } = mergeSnapshots(
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
    expect(skipped).toEqual([])
  })

  it('leaves a re-keyed project untouched - no append of the new identity', () => {
    // A rotation: id a disappears, id b appears. Appending b while keeping a
    // would put two configs in the snapshot where the project file has one.
    const { merged, skipped } = mergeSnapshots(
      { proj: [identity('a', 100)] },
      { proj: [identity('b', 100)] },
    )
    expect(merged).toEqual({ proj: [identity('a', 100)] })
    expect(skipped).toEqual(['proj'])
  })

  it('lets a range move through - closing an entry is the encouraged workflow', () => {
    // The id survives, so nothing is dropped; the guard test still demands
    // this exact regeneration as the sign-off for the re-sync.
    const { merged, skipped } = mergeSnapshots(
      { proj: [identity('a', 100)] },
      { proj: [identity('a', 100, 200), identity('b', 200)] },
    )
    expect(merged).toEqual({
      proj: [identity('a', 100, 200), identity('b', 200)],
    })
    expect(skipped).toEqual([])
  })

  it('keeps a project the fresh snapshot dropped entirely', () => {
    const { merged, skipped } = mergeSnapshots(
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
    expect(skipped).toEqual(['gone'])
  })

  it('skips only the dirty project, others still get their appends', () => {
    const { merged, skipped } = mergeSnapshots(
      { dirty: [identity('a', 100)], clean: [identity('b', 1)] },
      {
        dirty: [identity('x', 100)],
        clean: [identity('b', 1), identity('c', 2)],
      },
    )
    expect(merged).toEqual({
      clean: [identity('b', 1), identity('c', 2)],
      dirty: [identity('a', 100)],
    })
    expect(skipped).toEqual(['dirty'])
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
