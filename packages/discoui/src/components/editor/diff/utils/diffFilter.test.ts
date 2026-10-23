import { expect } from 'earl'
import {
  alignmentGaps,
  type ChangeDecision,
  decideChanges,
  type LineRange,
  type LineRangeMapping,
} from './diffFilter'

describe('decideChanges', () => {
  it('returns an empty list when there are no changes', () => {
    expect(decideChanges([], 'a', 'b', true)).toEqual([])
  })

  it('drops a whitespace-only change', () => {
    const left = 'a = 1'
    const right = 'a  =  1'
    expect(decide(left, right, [whole(left, right)], true)).toEqual([
      { kind: 'drop' },
    ])
  })

  it('drops a comment-only change when ignoreComments is true', () => {
    const left = '// foo\nx'
    const right = '// bar\nx'
    expect(decide(left, right, [whole(left, right)], true)).toEqual([
      { kind: 'drop' },
    ])
  })

  it('narrows a comment-only change to the comment line when ignoreComments is false', () => {
    const left = '// foo\nx'
    const right = '// bar\nx'
    expect(decide(left, right, [whole(left, right)], false)).toEqual([
      { kind: 'narrow', original: range(1, 2), modified: range(1, 2) },
    ])
  })

  it('keeps a real code change unchanged', () => {
    const left = 'x = 1'
    const right = 'x = 2'
    expect(decide(left, right, [whole(left, right)], true)).toEqual([
      { kind: 'keep' },
    ])
  })

  it('narrows by trimming a common leading line', () => {
    const left = 'shared\nold'
    const right = 'shared\nnew'
    expect(decide(left, right, [whole(left, right)], true)).toEqual([
      { kind: 'narrow', original: range(2, 3), modified: range(2, 3) },
    ])
  })

  it('narrows by trimming a common trailing line', () => {
    const left = 'old\nshared'
    const right = 'new\nshared'
    expect(decide(left, right, [whole(left, right)], true)).toEqual([
      { kind: 'narrow', original: range(1, 2), modified: range(1, 2) },
    ])
  })

  it('narrows an insert-only change to a zero-width range on the left', () => {
    const left = 'func()'
    const right = '// docs\nfunc()'
    expect(decide(left, right, [whole(left, right)], false)).toEqual([
      { kind: 'narrow', original: range(1, 1), modified: range(1, 2) },
    ])
  })

  it('narrows a removal-only change to a zero-width range on the right', () => {
    const left = '// docs\nfunc()'
    const right = 'func()'
    expect(decide(left, right, [whole(left, right)], false)).toEqual([
      { kind: 'narrow', original: range(1, 2), modified: range(1, 1) },
    ])
  })

  it('drops a comment+reformat change when ignoreComments is true', () => {
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
      { kind: 'drop' },
    ])
  })

  it('narrows a comment+reformat change to the inserted comments when ignoreComments is false', () => {
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
        false,
      ),
    ).toEqual([{ kind: 'keep' }])
  })

  it('keeps the comma-bearing line highlighted on the modified side when a trailing parameter is removed', () => {
    // Removing the last parameter in a multi-line argument list also strips
    // the trailing comma from the line above. The remaining tokens on the
    // modified side are a strict prefix of the original line, so the token
    // filter narrows modified to a zero-width range *between* lines 3 and 4
    // — hiding the visual change on line 3 where the user expects to see
    // the comma removed.
    const left = [
      'function initialize(',
      '    ISystemConfig _systemConfig,',
      '    IAnchorStateRegistry _anchorStateRegistry,',
      '    IETHLockbox _ethLockbox',
      ')',
    ].join('\n')
    const right = [
      'function initialize(',
      '    ISystemConfig _systemConfig,',
      '    IAnchorStateRegistry _anchorStateRegistry',
      ')',
    ].join('\n')
    expect(decide(left, right, [whole(left, right)], true)).toEqual([
      { kind: 'narrow', original: range(3, 5), modified: range(3, 4) },
    ])
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
    const right = ['a = 2', 'shared', 'b = 2', 'tail', 'shared', 'new'].join(
      '\n',
    )
    const changes: LineRangeMapping[] = [
      { original: range(1, 2), modified: range(1, 2) },
      { original: range(3, 4), modified: range(3, 4) },
      { original: range(5, 7), modified: range(5, 7) },
    ]
    expect(decide(left, right, changes, true)).toEqual([
      { kind: 'keep' },
      { kind: 'drop' },
      { kind: 'narrow', original: range(6, 7), modified: range(6, 7) },
    ])
  })
})

describe('alignmentGaps', () => {
  const outer: LineRangeMapping = {
    original: range(10, 12),
    modified: range(10, 13),
  }

  it('returns the outer mapping for a drop', () => {
    expect(alignmentGaps(outer, { kind: 'drop' })).toEqual([outer])
  })

  it('returns nothing for a keep', () => {
    expect(alignmentGaps(outer, { kind: 'keep' })).toEqual([])
  })

  it('returns the lead and trail slices for a narrow', () => {
    // A comment-block-plus-code change where the filter drops the comments
    // and narrows to just the code line. The leading comment region has 1
    // line on original and 2 on modified — without these gap mappings, the
    // diff editor would skip padding and everything below would drift by 1.
    expect(
      alignmentGaps(outer, {
        kind: 'narrow',
        original: range(11, 12),
        modified: range(12, 13),
      }),
    ).toEqual([
      { original: range(10, 11), modified: range(10, 12) },
      { original: range(12, 12), modified: range(13, 13) },
    ])
  })
})

function decide(
  left: string,
  right: string,
  changes: LineRangeMapping[],
  ignoreComments: boolean,
): ChangeDecision[] {
  return decideChanges(changes, left, right, ignoreComments)
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
