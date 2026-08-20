import { expect } from 'earl'
import {
  AI_GUARD_RAIL,
  compareProject,
  diffSnapshots,
  findRangeChanges,
} from './compare'
import type { SnapshotIdentity } from './types'

const identity = (
  id: string,
  since: number,
  until?: number,
): SnapshotIdentity => ({ id, label: `label ${id}`, since, until })

const domain = {
  name: 'test-domain',
  wipeWarning: 'WIPE WARNING',
  freezeRecipe: 'FREEZE RECIPE',
  rangeChangeRecipe: 'RANGE CHANGE RECIPE',
}

describe(findRangeChanges.name, () => {
  it('ignores unchanged ranges and ids present on one side only', () => {
    expect(
      findRangeChanges(
        [identity('a', 100, 200), identity('gone', 1)],
        [identity('a', 100, 200), identity('new', 2)],
      ),
    ).toEqual([])
  })

  it('reports a moved since, a moved until and a closed entry', () => {
    expect(
      findRangeChanges(
        [identity('a', 100), identity('b', 100, 200), identity('c', 100)],
        [identity('a', 101), identity('b', 100, 199), identity('c', 100, 300)],
      ),
    ).toEqual([
      {
        id: 'a',
        label: 'label a',
        old: { since: 100, until: undefined },
        new: { since: 101, until: undefined },
      },
      {
        id: 'b',
        label: 'label b',
        old: { since: 100, until: 200 },
        new: { since: 100, until: 199 },
      },
      {
        id: 'c',
        label: 'label c',
        old: { since: 100, until: undefined },
        new: { since: 100, until: 300 },
      },
    ])
  })
})

describe(compareProject.name, () => {
  it('returns null when nothing changed', () => {
    const entries = [identity('a', 100), identity('b', 100, 200)]
    expect(compareProject(domain, 'proj', entries, entries)).toEqual(null)
  })

  it('reports a rotation as one message with the freeze recipe', () => {
    // The typical rotation: one id disappears, its successor appears.
    const message = compareProject(
      domain,
      'proj',
      [identity('a', 100)],
      [identity('b', 100)],
    )
    if (message === null) throw new Error('expected a message')
    expect(message).toInclude('test-domain identities changed for proj')
    expect(message).toInclude('disappeared:')
    expect(message).toInclude('- a (label a) [100 -> open]')
    expect(message).toInclude(
      'appeared (typically the new era of the same change):',
    )
    if (message === null) throw new Error('expected a message')
    expect(message).toInclude('- b (label b) [100 -> open]')
    expect(message).toInclude('WIPE WARNING')
    expect(message).toInclude('FREEZE RECIPE')
    expect(message).toInclude(AI_GUARD_RAIL)
    // The routine "just regenerate" advice must not appear next to a wipe.
    expect(message).not.toInclude('snapshots:generate')
  })

  it('reports a range change with its recipe', () => {
    const message = compareProject(
      domain,
      'proj',
      [identity('a', 100)],
      [identity('a', 100, 200)],
    )
    if (message === null) throw new Error('expected a message')
    expect(message).toInclude('ranges changed:')
    expect(message).toInclude('- a (label a): 100 -> open => 100 -> 200')
    expect(message).toInclude('RANGE CHANGE RECIPE')
    expect(message).toInclude(AI_GUARD_RAIL)
    expect(message).not.toInclude('FREEZE RECIPE')
  })

  it('combines a removal and a range change into one message', () => {
    const message = compareProject(
      domain,
      'proj',
      [identity('a', 100), identity('b', 100)],
      [identity('b', 100, 200)],
    )
    if (message === null) throw new Error('expected a message')
    expect(message).toInclude('disappeared:')
    expect(message).toInclude('ranges changed:')
    expect(message).toInclude('FREEZE RECIPE')
    expect(message).toInclude('RANGE CHANGE RECIPE')
  })

  it('reports additions alone as routine, without the guard-rail', () => {
    const message = compareProject(
      domain,
      'proj',
      [identity('a', 100)],
      [identity('a', 100), identity('b', 200)],
    )
    if (message === null) throw new Error('expected a message')
    expect(message).toInclude(
      'New test-domain identities are not yet in the snapshot for proj',
    )
    if (message === null) throw new Error('expected a message')
    expect(message).toInclude('- b (label b) [200 -> open]')
    expect(message).toInclude("run 'pnpm snapshots:generate'")
    expect(message).not.toInclude(AI_GUARD_RAIL)
  })
})

describe(diffSnapshots.name, () => {
  it('classifies added, missing, range-changed and unchanged identities', () => {
    const diff = diffSnapshots(
      {
        alpha: [identity('kept', 100), identity('gone', 1, 50)],
        beta: [identity('moved', 100)],
      },
      {
        alpha: [identity('kept', 100), identity('new', 2)],
        beta: [identity('moved', 100, 200)],
        gamma: [identity('fresh', 5)],
      },
    )
    expect(diff.missing).toEqual([
      { projectId: 'alpha', ...identity('gone', 1, 50) },
    ])
    expect(diff.added).toEqual([
      { projectId: 'alpha', ...identity('new', 2) },
      { projectId: 'gamma', ...identity('fresh', 5) },
    ])
    expect(diff.rangeChanges).toEqual([
      {
        projectId: 'beta',
        id: 'moved',
        label: 'label moved',
        old: { since: 100, until: undefined },
        new: { since: 100, until: 200 },
      },
    ])
    expect(diff.unchanged).toEqual(2)
  })

  it('reports nothing for identical snapshots', () => {
    const snapshot = { alpha: [identity('a', 100, 200)] }
    expect(diffSnapshots(snapshot, snapshot)).toEqual({
      added: [],
      missing: [],
      rangeChanges: [],
      unchanged: 1,
    })
  })
})
