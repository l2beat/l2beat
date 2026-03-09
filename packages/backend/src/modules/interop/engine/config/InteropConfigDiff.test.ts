import { expect } from 'earl'
import {
  diffInteropConfigValues,
  type InteropConfigDiff,
  interopConfigDiffToMarkdown,
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
})
