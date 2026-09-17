import { describe, expect, it } from 'vitest'
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
): SnapshotIdentity => ({
  id,
  label: `label ${id}`,
  since,
  until,
  config: undefined,
})

/** compareProject that must produce a message. */
const compare = (...args: Parameters<typeof compareProject>): string => {
  const message = compareProject(...args)
  if (message === null) throw new Error('expected a message')
  return message
}

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
    const message = compare(
      domain,
      'proj',
      [identity('a', 100)],
      [identity('b', 100)],
    )
    expect(message).toContain('test-domain identities changed for proj')
    expect(message).toContain('disappeared:')
    expect(message).toContain('- a (label a) [100 -> open]')
    expect(message).toContain(
      'appeared (typically the new era of the same change):',
    )
    expect(message).toContain('- b (label b) [100 -> open]')
    expect(message).toContain('WIPE WARNING')
    expect(message).toContain('FREEZE RECIPE')
    expect(message).toContain(AI_GUARD_RAIL)
    // The routine "just regenerate" advice must not appear next to a wipe.
    expect(message).not.toContain('snapshots:generate')
  })

  it('prints the paste-ready frozen entry when the domain renders one', () => {
    const message = compare(
      { ...domain, freezeSnippet: (e) => `SNIPPET ${e.id}` },
      'proj',
      [identity('a', 100)],
      [identity('b', 100)],
    )
    expect(message).toContain('to paste in front of the last element')
    expect(message).toContain('SNIPPET a')
    expect(message).not.toContain('SNIPPET b')
  })

  it('reports a range change with its recipe', () => {
    const message = compare(
      domain,
      'proj',
      [identity('a', 100)],
      [identity('a', 100, 200)],
    )
    expect(message).toContain('ranges changed:')
    expect(message).toContain('- a (label a): 100 -> open => 100 -> 200')
    expect(message).toContain('RANGE CHANGE RECIPE')
    expect(message).toContain(AI_GUARD_RAIL)
    expect(message).not.toContain('FREEZE RECIPE')
  })

  it('combines a removal and a range change into one message', () => {
    const message = compare(
      domain,
      'proj',
      [identity('a', 100), identity('b', 100)],
      [identity('b', 100, 200)],
    )
    expect(message).toContain('disappeared:')
    expect(message).toContain('ranges changed:')
    expect(message).toContain('FREEZE RECIPE')
    expect(message).toContain('RANGE CHANGE RECIPE')
  })

  it('reports additions alone as routine, without the guard-rail', () => {
    const message = compare(
      domain,
      'proj',
      [identity('a', 100)],
      [identity('a', 100), identity('b', 200)],
    )
    expect(message).toContain(
      'New test-domain identities are not yet in the snapshot for proj',
    )
    expect(message).toContain('- b (label b) [200 -> open]')
    expect(message).toContain("run 'pnpm snapshots:generate'")
    expect(message).not.toContain(AI_GUARD_RAIL)
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
