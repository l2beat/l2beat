import { expect } from 'earl'
import type { ApiProjectEntry } from '../../api/types'
import { buildHomeSections, moveInSections } from './homeSections'

describe(buildHomeSections.name, () => {
  const entries: ApiProjectEntry[] = [
    entry('arbitrum', 'rollups'),
    entry('across', 'interop'),
    entry('base', 'rollups'),
    entry('zora', 'archived'),
  ]

  it('groups by category in site order, favorites first', () => {
    const sections = buildHomeSections(entries, ['base'], false)
    expect(
      sections.map((s) => [s.title, s.entries.map((e) => e.name)]),
    ).toEqual([
      ['Favorites', ['base']],
      ['Rollups', ['arbitrum']],
      ['Interop', ['across']],
      ['Archived', ['zora']],
    ])
  })

  it('keeps search relevance order in one section', () => {
    const sections = buildHomeSections(entries, [], true)
    expect(
      sections.map((s) => [s.title, s.entries.map((e) => e.name)]),
    ).toEqual([['Results', ['arbitrum', 'across', 'base', 'zora']]])
  })
})

describe(moveInSections.name, () => {
  // Two sections in a 4 column grid:
  // 0 1 2 3
  // 4 5
  // ---
  // 6 7 8
  const lengths = [6, 3]

  it('moves down within a section', () => {
    expect(moveInSections(lengths, 1, 'ArrowDown', 4)).toEqual(5)
  })

  it('moves down into a short last row', () => {
    expect(moveInSections(lengths, 3, 'ArrowDown', 4)).toEqual(5)
  })

  it('moves down into the next section keeping the column', () => {
    expect(moveInSections(lengths, 5, 'ArrowDown', 4)).toEqual(7)
  })

  it('clamps the column to the next section', () => {
    expect(moveInSections([4, 2], 3, 'ArrowDown', 4)).toEqual(5)
  })

  it('stays on the last row of the last section', () => {
    expect(moveInSections(lengths, 7, 'ArrowDown', 4)).toEqual(7)
  })

  it('moves up into the last row of the previous section', () => {
    expect(moveInSections(lengths, 7, 'ArrowUp', 4)).toEqual(5)
    expect(moveInSections(lengths, 8, 'ArrowUp', 4)).toEqual(5)
  })

  it('stays on the first row of the first section', () => {
    expect(moveInSections(lengths, 2, 'ArrowUp', 4)).toEqual(2)
  })

  it('moves left and right across sections', () => {
    expect(moveInSections(lengths, 5, 'ArrowRight', 4)).toEqual(6)
    expect(moveInSections(lengths, 6, 'ArrowLeft', 4)).toEqual(5)
    expect(moveInSections(lengths, 8, 'ArrowRight', 4)).toEqual(8)
    expect(moveInSections(lengths, 0, 'ArrowLeft', 4)).toEqual(0)
  })
})

function entry(
  name: string,
  category: ApiProjectEntry['category'],
): ApiProjectEntry {
  return { name, category, addresses: [], contractNames: [] }
}
