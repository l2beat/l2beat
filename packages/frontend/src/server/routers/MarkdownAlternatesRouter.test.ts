import { expect } from 'earl'
import { ps } from '~/server/projects'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { LIST_PAGES_WITH_MARKDOWN } from '~/utils/getMarkdownAlternatePath'
import {
  createMarkdownAlternatesRouter,
  MARKDOWN_ALTERNATES,
  type MarkdownAlternate,
  type MarkdownAlternatePath,
} from './MarkdownAlternatesRouter'

// Method: serve an alternate with injected sections and read it back over
// HTTP. The real alternates are checked against the list pages registered as
// having a markdown version, which is what gets advertised, and where the
// markdown must list the same projects as the HTML, against a query for
// those projects rather than a hardcoded list that goes stale.
describe(createMarkdownAlternatesRouter.name, () => {
  const ALTERNATE: MarkdownAlternate = {
    path: '/layer2s/summary.md',
    title: 'L2BEAT scaling projects',
    summary: 'Every tracked layer 2.',
    notes: 'Intro shown above the table.',
    getSections: () =>
      Promise.resolve([
        {
          heading: 'Layer 2s (/layer2s/projects/{slug})',
          description: 'What the section lists.',
          links: [
            {
              name: 'Arbitrum One',
              path: '/layer2s/projects/arbitrum',
              description:
                'Optimistic Rollup, Stage 1. A general-purpose rollup.',
            },
          ],
        },
      ]),
  }

  it('serves the alternate as llms.txt-shaped markdown', async () => {
    const response = await fetchFromRouter(
      createMarkdownAlternatesRouter([ALTERNATE]),
      '/layer2s/summary.md',
    )

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(
      'text/plain; charset=utf-8',
    )
    expect(response.headers.get('link')).toEqual(
      '<https://l2beat.com/llms.txt>; rel="describedby"',
    )
    expect(await response.text()).toEqual(
      [
        '# L2BEAT scaling projects',
        '',
        '> Every tracked layer 2.',
        '',
        'Intro shown above the table.',
        '',
        '## Layer 2s (/layer2s/projects/{slug})',
        '',
        'What the section lists.',
        '',
        '- [Arbitrum One](https://l2beat.com/layer2s/projects/arbitrum): Optimistic Rollup, Stage 1. A general-purpose rollup.',
        '',
      ].join('\n'),
    )
  })

  it('serves exactly the list pages registered as having markdown', () => {
    const served: string[] = MARKDOWN_ALTERNATES.map((a) => a.path)
    const registered = LIST_PAGES_WITH_MARKDOWN.map((page) => `${page}.md`)

    expect(served.toSorted()).toEqual(registered.toSorted())
  })

  // The HTML ZK catalog hides archived provers and has no archived view.
  it('lists exactly the active proving systems of the ZK catalog', async () => {
    const active = await ps.getProjects({
      where: ['zkCatalogInfo'],
      whereNot: ['archivedAt'],
    })

    const paths = await getLinkPaths('/zk-catalog.md')

    expect(paths.toSorted()).toEqual(
      active.map((p) => `/zk-catalog/${p.slug}`).toSorted(),
    )
  })

  // The HTML summary shows them in its Custom tab, linked to the project.
  it('lists every active custom DA solution', async () => {
    const custom = await ps.getProjects({
      where: ['customDa'],
      whereNot: ['archivedAt'],
    })

    const paths = await getLinkPaths('/data-availability/summary.md')

    expect(paths).toInclude(...custom.map((p) => `/layer2s/projects/${p.slug}`))
  })
})

async function getLinkPaths(path: MarkdownAlternatePath): Promise<string[]> {
  const alternate = MARKDOWN_ALTERNATES.find((a) => a.path === path)
  const sections = (await alternate?.getSections()) ?? []
  return sections.flatMap((section) =>
    section.links.flatMap((link) => ('path' in link ? [link.path] : [])),
  )
}
