import type { Change } from '@codemirror/merge'
import { expect } from 'earl'
import { computeDiff } from './computeDiff'

describe('computeDiff', () => {
  it('finds nothing in identical texts', () => {
    expect(computeDiff('a\nb', 'a\nb', false)).toEqual({
      lineChanges: [],
      textChanges: [],
      alignmentGaps: [],
    })
  })

  it('diffs whole lines, then the characters inside them', () => {
    const result = computeDiff('x = 1;\nkeep', 'x = 2;\nkeep', false)
    expect(result.lineChanges).toEqual([mapping([1, 2], [1, 2])])
    expect(changes(result.textChanges)).toEqual([[4, 5, 4, 5]])
  })

  it('reports inserted and removed lines with an empty side', () => {
    const result = computeDiff('a\nc', 'a\nb\nc', false)
    expect(result.lineChanges).toEqual([mapping([2, 2], [2, 3])])
    expect(changes(result.textChanges)).toEqual([[2, 2, 2, 4]])
  })

  it('moves a change at the end of the text onto the newline before it', () => {
    const result = computeDiff('a', 'a\nb', false)
    expect(result.lineChanges).toEqual([mapping([2, 2], [2, 3])])
    expect(changes(result.textChanges)).toEqual([[1, 1, 1, 3]])
  })

  it('drops a whitespace only change and pads the shorter side', () => {
    const result = computeDiff('a = 1;\nb', 'a =\n  1;\nb', false)
    expect(result.lineChanges).toEqual([])
    expect(result.textChanges).toEqual([])
    expect(result.alignmentGaps).toEqual([mapping([1, 2], [1, 3])])
  })

  it('drops comment changes only when told to ignore comments', () => {
    const original = '// old\nx;'
    const modified = '// new\nx;'
    expect(computeDiff(original, modified, true).lineChanges).toEqual([])
    expect(computeDiff(original, modified, false).lineChanges).toEqual([
      mapping([1, 2], [1, 2]),
    ])
  })
})

function mapping(original: [number, number], modified: [number, number]) {
  return {
    original: {
      startLineNumber: original[0],
      endLineNumberExclusive: original[1],
    },
    modified: {
      startLineNumber: modified[0],
      endLineNumberExclusive: modified[1],
    },
  }
}

function changes(textChanges: Change[]): number[][] {
  return textChanges.map((change) => [
    change.fromA,
    change.toA,
    change.fromB,
    change.toB,
  ])
}
