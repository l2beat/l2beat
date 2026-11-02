import { expect } from 'earl'
import { type SavedProject, withVisit } from './pinnedProjectsStore'

// withVisit is the whole of what a page visit does to the stored lists, so
// it is tested on plain values, without localStorage.
describe(withVisit.name, () => {
  it('keeps eight unpinned recent projects however many are pinned', () => {
    const pinned = range(10).map((i) => project(`pinned-${i}`))
    const recent = range(8).map((i) => project(`recent-${i}`))

    // Visiting every pinned project used to push the unpinned ones out.
    const after = pinned.reduce(withVisit, { pinned, recent, hasPinned: true })

    expect(after.recent.filter((p) => p.href.startsWith('/recent'))).toEqual(
      recent,
    )
  })

  it('drops the oldest unpinned project past eight', () => {
    const recent = range(8).map((i) => project(`recent-${i}`))

    const after = withVisit(
      { pinned: [], recent, hasPinned: false },
      project('new'),
    )

    expect(after.recent.map((p) => p.href)).toEqual([
      '/new',
      ...recent.slice(0, 7).map((p) => p.href),
    ])
  })

  it('moves a revisited project to the front without duplicating it', () => {
    const [a, b] = [project('a'), project('b')]

    const after = withVisit({ pinned: [], recent: [a, b], hasPinned: false }, b)

    expect(after.recent).toEqual([b, a])
  })

  it("refreshes a pinned project's name and icon", () => {
    const old = project('a')
    const renamed = { ...old, name: 'A renamed', iconUrl: '/icons/a.new.png' }

    const after = withVisit(
      { pinned: [old], recent: [], hasPinned: true },
      renamed,
    )

    expect(after.pinned).toEqual([renamed])
  })
})

function project(slug: string): SavedProject {
  return { href: `/${slug}`, name: slug, iconUrl: `/icons/${slug}.png` }
}

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i)
}
