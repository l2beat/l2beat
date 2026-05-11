import { expect } from 'earl'
import {
  type ChangeDecision,
  decideChanges,
  type LineRange,
  type LineRangeMapping,
} from './diffFilter'

describe('decideChanges', () => {
  it('returns an empty list when there are no changes', () => {
    expect(decideChanges([], 'a', 'b', false)).toEqual([])
  })

  it('drops a whitespace-only change', () => {
    const left = 'a = 1'
    const right = 'a  =  1'
    expect(decide(left, right, [whole(left, right)], false)).toEqual([
      { kind: 'drop' },
    ])
  })

  it('drops a comment-only change when considerComments is false', () => {
    const left = '// foo\nx'
    const right = '// bar\nx'
    expect(decide(left, right, [whole(left, right)], false)).toEqual([
      { kind: 'drop' },
    ])
  })

  it('narrows a comment-only change to the comment line when considerComments is true', () => {
    const left = '// foo\nx'
    const right = '// bar\nx'
    expect(decide(left, right, [whole(left, right)], true)).toEqual([
      { kind: 'narrow', original: range(1, 2), modified: range(1, 2) },
    ])
  })

  it('keeps a real code change unchanged', () => {
    const left = 'x = 1'
    const right = 'x = 2'
    expect(decide(left, right, [whole(left, right)], false)).toEqual([
      { kind: 'keep' },
    ])
  })

  it('narrows by trimming a common leading line', () => {
    const left = 'shared\nold'
    const right = 'shared\nnew'
    expect(decide(left, right, [whole(left, right)], false)).toEqual([
      { kind: 'narrow', original: range(2, 3), modified: range(2, 3) },
    ])
  })

  it('narrows by trimming a common trailing line', () => {
    const left = 'old\nshared'
    const right = 'new\nshared'
    expect(decide(left, right, [whole(left, right)], false)).toEqual([
      { kind: 'narrow', original: range(1, 2), modified: range(1, 2) },
    ])
  })

  it('narrows an insert-only change to a zero-width range on the left', () => {
    const left = 'func()'
    const right = '// docs\nfunc()'
    expect(decide(left, right, [whole(left, right)], true)).toEqual([
      { kind: 'narrow', original: range(1, 1), modified: range(1, 2) },
    ])
  })

  it('narrows a removal-only change to a zero-width range on the right', () => {
    const left = '// docs\nfunc()'
    const right = 'func()'
    expect(decide(left, right, [whole(left, right)], true)).toEqual([
      { kind: 'narrow', original: range(1, 2), modified: range(1, 1) },
    ])
  })

  it('drops a comment+reformat change when considerComments is false', () => {
    const left = [
      'function compareOneOf(bytes32[] storage compValue, bytes32 value)',
      '    internal',
      '    view',
      '{',
    ].join('\n')
    const right = [
      '/// @dev allowlist check',
      '/// @param compValue array',
      '/// @param value param',
      'function compareOneOf(',
      '    bytes32[] storage compValue,',
      '    bytes32 value',
      ') internal view {',
    ].join('\n')
    expect(decide(left, right, [whole(left, right)], false)).toEqual([
      { kind: 'drop' },
    ])
  })

  it('narrows a comment+reformat change to the inserted comments when considerComments is true', () => {
    const left = [
      'function compareOneOf(bytes32[] storage compValue, bytes32 value)',
      '    internal',
      '    view',
      '{',
    ].join('\n')
    const right = [
      '/// @dev allowlist check',
      '/// @param compValue array',
      '/// @param value param',
      'function compareOneOf(',
      '    bytes32[] storage compValue,',
      '    bytes32 value',
      ') internal view {',
    ].join('\n')
    expect(decide(left, right, [whole(left, right)], true)).toEqual([
      { kind: 'narrow', original: range(1, 1), modified: range(1, 4) },
    ])
  })

  it('clamps projected ranges to the fallback when a multiline comment straddles the boundary', () => {
    // The block comment spans lines 1-2 on both sides with differing bodies,
    // but the outer change is line 2 only. The comment's startLine=1 must not
    // leak into the narrowed range — clamped to fallback [2, 3), the narrowed
    // range equals fallback and we expect `keep` (i.e., pass through).
    const left = '/* A1\nB1 */\ncode'
    const right = '/* A2\nB2 */\ncode'
    expect(
      decide(
        left,
        right,
        [{ original: range(2, 3), modified: range(2, 3) }],
        true,
      ),
    ).toEqual([{ kind: 'keep' }])
  })

  it('handles multiple changes with a mix of drop, keep, and narrow decisions', () => {
    const left = [
      'a = 1', // line 1 — code-only diff (keep)
      'shared', // line 2 — boundary
      'b  =  2', // line 3 — whitespace diff (drop)
      'tail', // line 4 — boundary
      'shared',
      'old', // line 6 — narrow target
    ].join('\n')
    const right = [
      'a = 2',
      'shared',
      'b = 2',
      'tail',
      'shared',
      'new',
    ].join('\n')
    const changes: LineRangeMapping[] = [
      { original: range(1, 2), modified: range(1, 2) },
      { original: range(3, 4), modified: range(3, 4) },
      { original: range(5, 7), modified: range(5, 7) },
    ]
    expect(decide(left, right, changes, false)).toEqual([
      { kind: 'keep' },
      { kind: 'drop' },
      { kind: 'narrow', original: range(6, 7), modified: range(6, 7) },
    ])
  })
})

function decide(
  left: string,
  right: string,
  changes: LineRangeMapping[],
  considerComments: boolean,
): ChangeDecision[] {
  return decideChanges(changes, left, right, considerComments)
}

function range(start: number, endExclusive: number): LineRange {
  return { startLineNumber: start, endLineNumberExclusive: endExclusive }
}

function whole(left: string, right: string): LineRangeMapping {
  return {
    original: range(1, left.split('\n').length + 1),
    modified: range(1, right.split('\n').length + 1),
  }
}
