import { expect } from 'earl'
import type { Diff } from '../diffEditor'
import { getInlineDiff } from './getInlineDiff'

describe('getInlineDiff', () => {
  it('prints a modified line once as removed and once as added', () => {
    const diff: Diff = {
      deletions: 1,
      additions: 1,
      changes: [{ left: [2, 2], right: [2, 2] }],
    }
    expect(getInlineDiff(diff, 'a\nb\nc', 'a\nB\nc')).toEqual(
      ['```diff', ' a', '-b', '+B', '```'].join('\n'),
    )
  })

  it('prints inserted lines after the line they follow', () => {
    const diff: Diff = {
      deletions: 0,
      additions: 1,
      changes: [{ left: [1, 0], right: [2, 2] }],
    }
    expect(getInlineDiff(diff, 'a\nc', 'a\nb\nc')).toEqual(
      ['```diff', ' a', '+b', '```'].join('\n'),
    )
  })

  it('prints removed lines between their neighbors', () => {
    const diff: Diff = {
      deletions: 1,
      additions: 0,
      changes: [{ left: [2, 2], right: [1, 0] }],
    }
    expect(getInlineDiff(diff, 'a\nb\nc', 'a\nc')).toEqual(
      ['```diff', ' a', '-b', '```'].join('\n'),
    )
  })
})
