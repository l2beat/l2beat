import { expect } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { LIST_PAGES_WITH_MARKDOWN } from '~/utils/getMarkdownAlternatePath'
import {
  createMarkdownAlternatesRouter,
  MARKDOWN_ALTERNATES,
  type MarkdownAlternate,
} from './MarkdownAlternatesRouter'

// Method: serve an alternate with injected sections and read it back over
// HTTP; the real alternates are only checked against the list pages
// registered as having a markdown version, which is what gets advertised.
describe(createMarkdownAlternatesRouter.name, () => {
  const ALTERNATE: MarkdownAlternate = {
    path: '/layer2s/summary.md',
    title: 'L2BEAT scaling projects',
    summary: 'Every tracked layer 2.',
    getSections: () =>
      Promise.resolve([
        {
          heading: 'Layer 2s (/layer2s/projects/{slug})',
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
      'text/markdown; charset=utf-8',
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
        '## Layer 2s (/layer2s/projects/{slug})',
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
})
