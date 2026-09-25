import { expect } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import {
  createMarkdownAlternatesRouter,
  MARKDOWN_ALTERNATES,
  type MarkdownAlternate,
} from './MarkdownAlternatesRouter'

// Method: serve an alternate with injected sections and read it back over
// HTTP; the real alternates are only checked for having a page counterpart.
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

  it('places every alternate at its page URL plus .md', () => {
    for (const alternate of MARKDOWN_ALTERNATES) {
      expect(alternate.path).toMatchRegex(/^\/[a-z0-9/-]+\.md$/)
    }
  })
})
