import { expect } from 'earl'
import { getEmptyStateGroups } from './searchBarEmptyState'

// Projects are identified by href only, so each fixture is just a list of
// hrefs; the assertions compare the hrefs each group ends up with.
describe(getEmptyStateGroups.name, () => {
  it('lists a project once, in the first group that has it', () => {
    const groups = getEmptyStateGroups(
      { pinned: saved('a', 'b'), recent: saved('b', 'c', 'a', 'd') },
      added('d', 'e', 'c'),
      '/elsewhere',
    )

    expect(hrefs(groups)).toEqual({
      pinned: ['a', 'b'],
      recentlyViewed: ['c', 'd'],
      recentlyAdded: ['e'],
    })
  })

  it('caps each group, counting only projects not shown above', () => {
    const groups = getEmptyStateGroups(
      {
        pinned: saved('p1', 'p2', 'p3', 'p4', 'p5', 'p6'),
        recent: saved('p1', 'r1', 'r2', 'r3', 'r4'),
      },
      added('a1', 'a2', 'a3', 'a4', 'a5', 'a6'),
      '/elsewhere',
    )

    expect(hrefs(groups)).toEqual({
      pinned: ['p1', 'p2', 'p3', 'p4', 'p5'],
      recentlyViewed: ['r1', 'r2', 'r3'],
      recentlyAdded: ['a1', 'a2', 'a3', 'a4', 'a5'],
    })
  })

  it('leaves the page being viewed out of recently viewed', () => {
    const groups = getEmptyStateGroups(
      { pinned: [], recent: saved('here', 'r1', 'r2', 'r3') },
      [],
      'here',
    )

    expect(hrefs(groups).recentlyViewed).toEqual(['r1', 'r2', 'r3'])
  })

  it('keeps every recently added project for a visitor with none of their own', () => {
    const recentlyAdded = added(...Array.from({ length: 15 }, (_, i) => `${i}`))

    const groups = getEmptyStateGroups(
      { pinned: [], recent: [] },
      recentlyAdded,
      '/elsewhere',
    )

    expect(groups.recentlyAdded).toEqual(recentlyAdded)
  })
})

function saved(...hrefs: string[]) {
  return hrefs.map((href) => ({ href, name: href, iconUrl: '' }))
}

function added(...hrefs: string[]) {
  return hrefs.map((href) => ({ href }))
}

function hrefs(groups: ReturnType<typeof getEmptyStateGroups>) {
  return Object.fromEntries(
    Object.entries(groups).map(([key, list]: [string, { href: string }[]]) => [
      key,
      list.map((p) => p.href),
    ]),
  )
}
