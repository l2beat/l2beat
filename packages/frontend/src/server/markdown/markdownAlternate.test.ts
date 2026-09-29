import { expect } from 'earl'
import express from 'express'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { serveMarkdown, serveMarkdownIfPreferred } from './markdownAlternate'

// Method: mount both handlers the way a page router does (`:slug.md` next to
// the HTML route) over a fake markdown source, then make real HTTP requests
// with the Accept headers browsers and agents send and check what comes back.
describe(`${serveMarkdown.name} and ${serveMarkdownIfPreferred.name}`, () => {
  it('serves the .md suffix as markdown', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/layer2s/projects/arbitrum.md',
    )

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(
      'text/plain; charset=utf-8',
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
      'text/plain; charset=utf-8',
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
        'text/plain; charset=utf-8',
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
})

function createRouter() {
  const getMarkdown = async (req: express.Request<{ slug: string }>) =>
    req.params.slug === 'unknown' ? undefined : `# ${req.params.slug}\n`

  const router = express.Router()
  router.get('/layer2s/projects/:slug.md', serveMarkdown(getMarkdown))
  router.get(
    '/layer2s/projects/:slug',
    serveMarkdownIfPreferred(getMarkdown),
    (_req, res) => {
      res.header('Content-Type', 'text/html; charset=utf-8').send('<html />')
    },
  )
  return router
}
