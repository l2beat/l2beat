import { assert } from '@l2beat/shared-pure'
import type { ApiProjectCategory, ApiProjectEntry } from '../../api/types'

export const CATEGORY_TITLES: Record<ApiProjectCategory, string> = {
  rollups: 'Rollups',
  validiumsAndOptimiums: 'Validiums & Optimiums',
  others: 'Others',
  interop: 'Interop',
  privacy: 'Privacy',
  defi: 'DeFi',
  zkCatalog: 'ZK Catalog',
  sharedModules: 'Shared modules',
  unlisted: 'Unlisted',
  archived: 'Archived',
}

export interface HomeSection {
  title: string
  favorites: boolean
  entries: ApiProjectEntry[]
}

export function buildHomeSections(
  entries: ApiProjectEntry[],
  favorites: string[],
  searching: boolean,
): HomeSection[] {
  const sections: HomeSection[] = [
    {
      title: 'Favorites',
      favorites: true,
      entries: entries.filter((x) => favorites.includes(x.name)),
    },
  ]
  const rest = entries.filter((x) => !favorites.includes(x.name))
  if (searching) {
    sections.push({ title: 'Results', favorites: false, entries: rest })
  } else {
    for (const [category, title] of Object.entries(CATEGORY_TITLES)) {
      sections.push({
        title,
        favorites: false,
        entries: rest.filter((x) => x.category === category),
      })
    }
  }
  return sections.filter((x) => x.entries.length > 0)
}

export type GridKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'

export function moveInSections(
  sectionLengths: number[],
  index: number,
  key: GridKey,
  columnCount: number,
): number {
  const total = sectionLengths.reduce((a, b) => a + b, 0)
  assert(index >= 0, 'Index must not be negative')
  assert(index < total, 'Index must be inside the sections')
  if (key === 'ArrowLeft') {
    return Math.max(index - 1, 0)
  }
  if (key === 'ArrowRight') {
    return Math.min(index + 1, total - 1)
  }

  let section = 0
  let start = 0
  while (index >= start + lengthAt(sectionLengths, section)) {
    start += lengthAt(sectionLengths, section)
    section++
  }
  const length = lengthAt(sectionLengths, section)
  const offset = index - start
  const column = offset % columnCount

  if (key === 'ArrowDown') {
    if (offset + columnCount < length) {
      return index + columnCount
    }
    if (rowOf(offset, columnCount) < rowOf(length - 1, columnCount)) {
      return start + length - 1
    }
    if (section + 1 < sectionLengths.length) {
      const nextLength = lengthAt(sectionLengths, section + 1)
      return start + length + Math.min(column, nextLength - 1)
    }
    return index
  }

  if (offset - columnCount >= 0) {
    return index - columnCount
  }
  if (section > 0) {
    const previousLength = lengthAt(sectionLengths, section - 1)
    const lastRowStart = rowOf(previousLength - 1, columnCount) * columnCount
    const previousStart = start - previousLength
    return previousStart + Math.min(lastRowStart + column, previousLength - 1)
  }
  return index
}

function lengthAt(sectionLengths: number[], section: number) {
  const length = sectionLengths[section]
  assert(length !== undefined, 'Section must exist')
  assert(length > 0, 'Section must not be empty')
  return length
}

function rowOf(offset: number, columnCount: number) {
  return Math.floor(offset / columnCount)
}
