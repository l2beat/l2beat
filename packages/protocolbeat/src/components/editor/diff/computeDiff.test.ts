import type { Change } from '@codemirror/merge'
import { expect } from 'earl'
import { computeDiff } from './computeDiff'

describe('computeDiff', () => {
  it('finds nothing in identical texts', () => {
    expect(computeDiff('a\nb', 'a\nb', false)).toEqual({
      lineChanges: [],
      filteredChanges: [],
      textChanges: [],
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
    expect(changes(result.textChanges)).toEqual([[1, 2, 1, 4]])
  })

  it('starts a change at the newline before it', () => {
    const result = computeDiff('a\n\nb\nc', 'a\n\nc', false)
    expect(result.lineChanges).toEqual([mapping([3, 4], [3, 3])])
    expect(changes(result.textChanges)).toEqual([[2, 5, 2, 3]])
  })

  it('moves a change at the end of the text onto the newline before it', () => {
    const result = computeDiff('a', 'a\nb', false)
    expect(result.lineChanges).toEqual([mapping([2, 2], [2, 3])])
    expect(changes(result.textChanges)).toEqual([[1, 1, 1, 3]])
  })

  it('filters out a whitespace only change but keeps it for alignment', () => {
    const result = computeDiff('a = 1;\nb', 'a =\n  1;\nb', false)
    expect(result.lineChanges).toEqual([])
    expect(result.filteredChanges).toEqual([mapping([1, 2], [1, 3])])
    expect(changes(result.textChanges)).toEqual([[0, 7, 0, 9]])
  })

  it('splits a narrowed change into kept and filtered parts in order', () => {
    const result = computeDiff('a\nx();\n\nb', 'a\nb', false)
    expect(result.lineChanges).toEqual([mapping([2, 3], [2, 2])])
    expect(result.filteredChanges).toEqual([mapping([3, 4], [2, 2])])
    expect(changes(result.textChanges)).toEqual([
      [1, 7, 1, 2],
      [7, 8, 2, 2],
    ])
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
