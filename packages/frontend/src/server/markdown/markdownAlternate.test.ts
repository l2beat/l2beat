import { v } from '@l2beat/validate'
import { expect } from 'earl'
import express from 'express'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { registerPageWithMarkdown } from './markdownAlternate'

// Method: register a page over a fake markdown source and a handler that
// marks HTML, then make real HTTP requests with the Accept headers browsers
// and agents send and check what comes back. Requesting the `.md` URL also
// pins the route order: the page pattern registered first would take
// "arbitrum.md" as the slug and answer HTML.
describe(registerPageWithMarkdown.name, () => {
  it('serves the .md suffix as markdown', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/layer2s/projects/arbitrum.md',
    )

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(
      'text/markdown; charset=utf-8',
    )
    expect(await response.text()).toEqual('# arbitrum\n')
  })

  it('sends the .md suffix with the headers of every markdown document', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/layer2s/projects/arbitrum.md',
    )

    expect(response.headers.get('link')).toEqual(
      '<https://l2beat.com/llms.txt>; rel="describedby"',
    )
    expect(response.headers.get('cache-control')).toEqual(
      'public, max-age=0, s-maxage=60, stale-while-revalidate=300, stale-if-error=3600',
    )
  })

  it('answers 404 in markdown for a page that does not exist, uncached', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/layer2s/projects/unknown.md',
    )

    expect(response.status).toEqual(404)
    expect(response.headers.get('content-type')).toEqual(
      'text/markdown; charset=utf-8',
    )
    expect(response.headers.get('cache-control')).toEqual(null)
    expect(await response.text()).toEqual('# Not found\n')
  })

  it('serves markdown on the page URL when Accept prefers it', async () => {
    for (const accept of ['text/markdown', 'text/markdown, text/html;q=0.9']) {
      const response = await fetchFromRouter(
        createRouter(),
        '/layer2s/projects/arbitrum',
        { headers: { Accept: accept } },
      )

      expect(response.status).toEqual(200)
      expect(response.headers.get('content-type')).toEqual(
        'text/markdown; charset=utf-8',
      )
      expect(await response.text()).toEqual('# arbitrum\n')
    }
  })

  it('keeps negotiated markdown out of shared caches', async () => {
    // Cloudflare ignores Vary: Accept, so an edge-cached markdown response
    // would be served to browsers asking for the same URL.
    const response = await fetchFromRouter(
      createRouter(),
      '/layer2s/projects/arbitrum',
      { headers: { Accept: 'text/markdown' } },
    )

    expect(response.headers.get('cache-control')).toEqual('private, no-store')
    expect(response.headers.get('vary')).toEqual('Accept')
  })

  it('serves HTML to browsers and clients without a preference', async () => {
    const browserAccept =
      'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    for (const accept of [browserAccept, '*/*', undefined]) {
      const response = await fetchFromRouter(
        createRouter(),
        '/layer2s/projects/arbitrum',
        { headers: accept ? { Accept: accept } : {} },
      )

      expect(response.headers.get('content-type')).toEqual(
        'text/html; charset=utf-8',
      )
      expect(response.headers.get('vary')).toEqual('Accept')
    }
  })

  it('validates the query of the HTML page only', async () => {
    const html = await fetchFromRouter(
      createRouter(),
      '/layer2s/projects/arbitrum?update=1&update=2',
    )
    const markdown = await fetchFromRouter(
      createRouter(),
      '/layer2s/projects/arbitrum.md?update=1&update=2',
    )

    expect(html.status).toEqual(400)
    expect(markdown.status).toEqual(200)
  })
})

function createRouter() {
  const router = express.Router()
  registerPageWithMarkdown(router, {
    path: '/layer2s/projects/:slug',
    params: v.object({ slug: v.string() }),
    query: v.object({ update: v.string().optional() }),
    getMarkdown: async ({ slug }) =>
      slug === 'unknown' ? undefined : `# ${slug}\n`,
    sendHtml: (_req, res) => {
      res.header('Content-Type', 'text/html; charset=utf-8').send('<html />')
    },
  })
  return router
}
