import { expect } from 'earl'
import {
  diffInteropConfigValues,
  type InteropConfigDiff,
  type InteropConfigDiffFilters,
  interopConfigDiffToMarkdown,
  removeMutedInteropConfigDiffEntries,
} from './InteropConfigDiff'

describe('InteropConfigDiff', () => {
  it('returns a change when a primitive value changed', () => {
    const entries = diffInteropConfigValues({ version: 1 }, { version: 2 })

    expect(entries).toEqual([
      {
        kind: 'change',
        path: ['version'],
        lhs: 1,
        rhs: 2,
      },
    ])
  })

  it('treats undefined object properties as non-existent', () => {
    const previous = { networks: [{ chain: 'a' }] }
    const current = { networks: [{ chain: 'a', onRamp: undefined }] }

    const entries = diffInteropConfigValues(previous, current)

    expect(entries.length).toEqual(0)
  })

  it('formats a readable markdown diff', () => {
    const interopDiff: InteropConfigDiff = {
      key: 'ccip',
      previous: undefined,
      current: undefined,
      entries: [
        { kind: 'create', path: ['networks', 0, 'onRamp'], rhs: '0xabc' },
        { kind: 'remove', path: ['networks', 1, 'offRamp'], lhs: '0xdef' },
        { kind: 'change', path: ['version'], lhs: 1, rhs: 2 },
      ],
    }

    const markdown = interopConfigDiffToMarkdown(interopDiff)

    expect(markdown.startsWith('```diff')).toEqual(true)
    expect(markdown.includes('+ $.networks[0].onRamp: "0xabc"')).toEqual(true)
    expect(markdown.includes('- $.networks[1].offRamp: "0xdef"')).toEqual(true)
    expect(markdown.includes('~ $.version')).toEqual(true)
    expect(markdown.endsWith('```')).toEqual(true)
  })

  it('removes muted entries for selected config keys', () => {
    const interopDiff: InteropConfigDiff = {
      key: 'polygon',
      previous: undefined,
      current: undefined,
      entries: [
        { kind: 'change', path: ['lastSyncedBlock'], lhs: 1, rhs: 2 },
        {
          kind: 'change',
          path: ['predicates', 0],
          lhs: '0xabc',
          rhs: '0xdef',
        },
      ],
    }

    const testFilters = {
      polygon: [
        (diff) => diff.path.length === 1 && diff.path[0] === 'lastSyncedBlock',
      ],
    } satisfies InteropConfigDiffFilters

    const filtered = removeMutedInteropConfigDiffEntries(
      interopDiff,
      testFilters,
    )

    expect(filtered.entries).toEqual([
      {
        kind: 'change',
        path: ['predicates', 0],
        lhs: '0xabc',
        rhs: '0xdef',
      },
    ])
  })
})
