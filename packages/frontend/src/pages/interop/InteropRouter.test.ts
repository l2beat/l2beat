import type { InMemoryCache } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import {
  MARKDOWN_CONTENT_TYPE,
  NEGOTIATED_MARKDOWN_CONTENT_TYPE,
} from '~/server/markdown/markdownAlternate'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createInteropRouter } from './InteropRouter'
import type { InteropTokenPage } from './token/renderInteropTokenMarkdown'

// Method: mount the real interop router with a page cache that already holds
// one token page (so no data is fetched) and a render function that marks
// HTML, then request the page the ways browsers and agents do. This pins the
// route order: a page route registered first would swallow "usdc01.md" as the
// token id.
describe(`${createInteropRouter.name} for a token page`, () => {
  for (const path of [
    '/tokens/usdc01.md',
    '/tokens/usdc01/usdc.md',
    '/tokens/usdc01/circle/usdc.md',
  ]) {
    it(`serves the token page as markdown on ${path}`, async () => {
      const response = await fetchFromRouter(createRouter(), path)

      expect(response.status).toEqual(200)
      expect(response.headers.get('content-type')).toEqual(
        MARKDOWN_CONTENT_TYPE,
      )
      expect(await response.text()).toMatchRegex(/^# USDC\n/)
    })
  }

  it('answers 404 in markdown for a token that does not exist', async () => {
    const response = await fetchFromRouter(createRouter(), '/tokens/unknown.md')

    expect(response.status).toEqual(404)
    expect(response.headers.get('content-type')).toEqual(MARKDOWN_CONTENT_TYPE)
  })

  it('serves markdown on the page URL when Accept prefers it', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/tokens/usdc01/circle/usdc',
      { headers: { Accept: 'text/markdown' } },
    )

    expect(response.headers.get('content-type')).toEqual(
      NEGOTIATED_MARKDOWN_CONTENT_TYPE,
    )
    expect(await response.text()).toMatchRegex(/^# USDC\n/)
  })

  it('serves HTML on the page URL to browsers', async () => {
    for (const path of ['/tokens/usdc01', '/tokens/usdc01/circle/usdc']) {
      const response = await fetchFromRouter(createRouter(), path, {
        headers: { Accept: 'text/html,*/*;q=0.8' },
      })

      expect(await response.text()).toEqual('<html />')
    }
  })
})

function createRouter() {
  // Page metadata is built per request, outside the cache.
  const manifest = mockObject<Manifest>({
    getUrl: (url) => url,
    getImage: (url) => ({ src: url, width: 1200, height: 630 }),
  })
  const cache = mockObject<InMemoryCache>({
    get: (async ({ key }: { key: string[] }) =>
      key[2] === TOKEN_PAGE.token.id
        ? TOKEN_PAGE
        : undefined) as InMemoryCache['get'],
  })
  return createInteropRouter(manifest, async () => '<html />', cache)
}

/** Without data, so the page is small: the renderer's own test covers the content. */
const TOKEN_PAGE: InteropTokenPage & { apiSelection: { from: []; to: [] } } = {
  token: {
    id: 'usdc01',
    symbol: 'USDC',
    issuer: 'circle',
    iconUrl: null,
    category: 'stablecoin',
    isPriceUnreliable: false,
  },
  tokenEntry: { sections: [], deploymentsCount: 0 },
  tokenData: null,
  lastSyncedAt: undefined,
  apiSelection: { from: [], to: [] },
}
