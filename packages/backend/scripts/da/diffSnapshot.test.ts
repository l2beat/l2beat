import { expect } from 'earl'
import { diffSnapshots } from './diffSnapshot'

describe(diffSnapshots.name, () => {
  it('reports added, removed and unchanged configurations', () => {
    const committed = {
      alpha: [
        { id: 'aaa', label: 'ethereum inbox 0x1 since 1' },
        { id: 'bbb', label: 'celestia namespace ns since 2' },
      ],
      beta: [{ id: 'ccc', label: 'avail appIds [1] since 3' }],
    }
    const current = {
      alpha: [
        { id: 'aaa', label: 'ethereum inbox 0x1 since 1' },
        { id: 'ddd', label: 'celestia namespace ns2 since 2' },
      ],
      gamma: [{ id: 'eee', label: 'eigen-da customer x since 4' }],
    }

    expect(diffSnapshots(current, committed)).toEqual({
      added: [
        {
          projectId: 'alpha',
          id: 'ddd',
          label: 'celestia namespace ns2 since 2',
        },
        { projectId: 'gamma', id: 'eee', label: 'eigen-da customer x since 4' },
      ],
      removed: [
        {
          projectId: 'alpha',
          id: 'bbb',
          label: 'celestia namespace ns since 2',
        },
        { projectId: 'beta', id: 'ccc', label: 'avail appIds [1] since 3' },
      ],
      unchanged: 1,
    })
  })

  it('treats the same id under different projects as distinct', () => {
    const committed = { alpha: [{ id: 'aaa', label: 'x' }] }
    const current = { beta: [{ id: 'aaa', label: 'x' }] }

    expect(diffSnapshots(current, committed)).toEqual({
      added: [{ projectId: 'beta', id: 'aaa', label: 'x' }],
      removed: [{ projectId: 'alpha', id: 'aaa', label: 'x' }],
      unchanged: 0,
    })
  })

  it('reports no changes for identical snapshots', () => {
    const snapshot = { alpha: [{ id: 'aaa', label: 'x' }] }
    expect(diffSnapshots(snapshot, snapshot)).toEqual({
      added: [],
      removed: [],
      unchanged: 1,
    })
  })
})
