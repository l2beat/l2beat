import { expect } from 'earl'
import type { SearchBarPage } from './searchBarPages'
import {
  groupSearchResults,
  isDirectMatch,
  searchEntries,
} from './searchBarResults'

describe(searchEntries.name, () => {
  it('treats page tags as direct matches and project subsequence matches as fuzzy', () => {
    const pages: IndexedSearchBarPage[] = [
      {
        type: 'page',
        category: 'interop',
        name: 'Summary',
        tags: ['pages', 'interop', 'interoperability'],
        href: '/interop/summary',
        index: 0,
      },
    ]

    const projects = [
      projectEntry({
        name: 'Cartesi PRT Honeypot',
        tags: ['cartesi-prt-honeypot', 'Cartesi PRT Honeypot', 'Honeypot PRT'],
      }),
    ]

    const [pageResult] = searchEntries('interop', pages)
    const [projectResult] = searchEntries('interop', projects)

    expect(pageResult?.searchMatchKind).toEqual('direct')
    expect(projectResult?.searchMatchKind).toEqual('fuzzy')
  })

  it('keeps only strong direct matches when they exist', () => {
    const entries = [
      projectEntry({
        name: 'Ethereal',
        tags: ['ethereal', 'Ethereal'],
        category: 'scaling',
      }),
      projectEntry({
        name: 'Ethereum with Enshrined Bridge',
        tags: ['ethereum', 'Ethereum'],
        category: 'da',
      }),
      projectEntry({
        name: 'Jetstream',
        tags: ['jetstreamchain', 'Jetstream'],
        category: 'scaling',
      }),
    ]

    const results = searchEntries('ethere', entries)

    expect(results.map((entry) => entry.name)).toEqual([
      'Ethereal',
      'Ethereum with Enshrined Bridge',
    ])
    expect(isDirectMatch('ethere', entries[0]!)).toEqual(true)
    expect(isDirectMatch('ethere', entries[1]!)).toEqual(true)
    expect(isDirectMatch('ethere', entries[2]!)).toEqual(false)
  })

  it('does not treat generic tag substrings as direct matches', () => {
    const pages: IndexedSearchBarPage[] = [
      {
        type: 'page',
        category: 'scaling',
        name: 'Summary',
        tags: ['pages', 'scaling'],
        href: '/scaling/summary',
        index: 0,
      },
    ]

    const projects = [
      projectEntry({
        name: 'Agglayer',
        tags: ['agglayer', 'Agglayer'],
      }),
    ]

    const pageResults = searchEntries('ag', pages)
    const projectResults = searchEntries('ag', projects)
    const grouped = groupSearchResults([...projectResults, ...pageResults])

    expect(isDirectMatch('ag', pages[0]!)).toEqual(false)
    expect(isDirectMatch('ag', projects[0]!)).toEqual(true)
    expect(grouped.map(([category]) => category)).toEqual(['scaling'])
    expect(grouped[0]?.[1].map((entry) => entry.name)).toEqual(['Agglayer'])
  })
})

describe(groupSearchResults.name, () => {
  it('drops fuzzy project groups when direct page matches exist', () => {
    const pages: IndexedSearchBarPage[] = [
      {
        type: 'page',
        category: 'interop',
        name: 'Summary',
        tags: ['pages', 'interop', 'interoperability'],
        href: '/interop/summary',
        index: 0,
      },
      {
        type: 'page',
        category: 'interop',
        name: 'Non-minting',
        tags: ['pages', 'interop', 'interoperability', 'non-minting'],
        href: '/interop/non-minting',
        index: 1,
      },
    ]

    const projectResults = searchEntries('interop', [
      projectEntry({
        name: 'Cartesi PRT Honeypot',
        tags: ['cartesi-prt-honeypot', 'Cartesi PRT Honeypot', 'Honeypot PRT'],
      }),
    ])

    const grouped = groupSearchResults([
      ...projectResults,
      ...searchEntries('interop', pages),
    ])

    expect(grouped.map(([category]) => category)).toEqual(['interop'])
    expect(grouped[0]?.[1].map((entry) => entry.name)).toEqual([
      'Summary',
      'Non-minting',
    ])
  })

  it('orders groups by their strongest remaining result', () => {
    const grouped = groupSearchResults(
      searchEntries('ethere', [
        projectEntry({
          name: 'Ethereal',
          tags: ['ethereal', 'Ethereal'],
          category: 'scaling',
        }),
        projectEntry({
          name: 'Ethereum with Enshrined Bridge',
          tags: ['ethereum', 'Ethereum'],
          category: 'da',
        }),
        projectEntry({
          name: 'Jetstream',
          tags: ['jetstreamchain', 'Jetstream'],
          category: 'scaling',
        }),
      ]),
    )

    expect(grouped.map(([category]) => category)).toEqual(['scaling', 'da'])
    expect(
      grouped.flatMap(([, entries]) => entries.map((entry) => entry.name)),
    ).toEqual(['Ethereal', 'Ethereum with Enshrined Bridge'])
  })
})

function projectEntry({
  name,
  tags,
  category = 'scaling',
}: {
  name: string
  tags: string[]
  category?: 'scaling' | 'da'
}) {
  return {
    type: 'project' as const,
    category,
    name,
    tags,
    href: `/${name.toLowerCase()}`,
  }
}

type IndexedSearchBarPage = SearchBarPage & {
  index: number
}
