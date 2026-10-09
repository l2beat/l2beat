import { expect } from 'earl'
import { renderUnitDiff, toHunks } from './renderUnitDiff'

describe(renderUnitDiff.name, () => {
  it('marks added deployed lines and places removed audited lines before their deployed line', () => {
    const deployed = ['a', 'b', 'new1', 'new2', 'c']
    const audited = ['a', 'old', 'b', 'c']
    const lines = renderUnitDiff(
      deployed,
      audited,
      [[2, 3]],
      [[1, 1, 1]],
      10,
      100,
    )
    expect(lines).toEqual([
      { type: ' ', oldLine: 100, newLine: 10, text: 'a' },
      { type: '-', oldLine: 101, text: 'old' },
      { type: ' ', oldLine: 102, newLine: 11, text: 'b' },
      { type: '+', newLine: 12, text: 'new1' },
      { type: '+', newLine: 13, text: 'new2' },
      { type: ' ', oldLine: 103, newLine: 14, text: 'c' },
    ])
  })

  it('places removed lines after the last deployed line', () => {
    const lines = renderUnitDiff(['a'], ['a', 'tail'], [], [[1, 1, 1]], 1, 1)
    expect(lines.map((l) => l.type)).toEqual([' ', '-'])
  })
})

describe(toHunks.name, () => {
  it('keeps context lines around changes and splits distant changes', () => {
    const lines = renderUnitDiff(
      Array.from({ length: 20 }, (_, i) => `l${i}`),
      [],
      [
        [2, 2],
        [15, 15],
      ],
      [],
      1,
      1,
    )
    const hunks = toHunks(lines, 1)
    expect(hunks.length).toEqual(2)
    expect(hunks[0]?.lines.map((l) => l.text)).toEqual(['l1', 'l2', 'l3'])
    expect(hunks[0]?.newStart).toEqual(2)
    expect(hunks[1]?.lines.map((l) => l.text)).toEqual(['l14', 'l15', 'l16'])
  })

  it('returns no hunks for an unchanged unit', () => {
    expect(toHunks(renderUnitDiff(['a'], ['a'], [], [], 1, 1))).toEqual([])
  })
})
