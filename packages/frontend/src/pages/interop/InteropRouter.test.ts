import type { InMemoryCache } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createInteropRouter } from './InteropRouter'
import type { InteropTokenPage } from './token/renderInteropTokenMarkdown'

// Method: mount the real interop router with a page cache that already holds
// one token page (so no data is fetched) and a render function that marks
// HTML, then request the token page the ways browsers and agents do, in every
// URL shape the page accepts. This pins the route order: the page route
// registered first would take "usdc01.md" as the token id.
describe(createInteropRouter.name, () => {
  for (const path of [
    '/interop/tokens/usdc01.md',
    '/interop/tokens/usdc01/usdc.md',
    '/interop/tokens/usdc01/circle/usdc.md',
  ]) {
    it(`serves the token page as markdown on ${path}`, async () => {
      const response = await fetchFromRouter(createRouter(), path)

      expect(response.status).toEqual(200)
      expect(response.headers.get('content-type')).toEqual(
        'text/plain; charset=utf-8',
      )
      expect(await response.text()).toMatchRegex(/^# USDC\n/)
    })
  }

  it('answers 404 in markdown for a token that does not exist', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/interop/tokens/unknown.md',
    )

    expect(response.status).toEqual(404)
    expect(response.headers.get('content-type')).toEqual(
      'text/plain; charset=utf-8',
    )
  })

  it('serves markdown on the page URL when Accept prefers it', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/interop/tokens/usdc01/circle/usdc',
      { headers: { Accept: 'text/markdown' } },
    )

    expect(response.headers.get('content-type')).toEqual(
      'text/plain; charset=utf-8',
    )
    expect(await response.text()).toMatchRegex(/^# USDC\n/)
  })

  it('serves HTML on the page URL to browsers', async () => {
    for (const path of [
      '/interop/tokens/usdc01',
      '/interop/tokens/usdc01/circle/usdc',
    ]) {
      const response = await fetchFromRouter(createRouter(), path, {
        headers: { Accept: 'text/html,*/*;q=0.8' },
      })

      expect(await response.text()).toEqual('<html />')
    }
  })
})

function createRouter() {
  const manifest = mockObject<Manifest>({ getUrl: (url) => url })
  const cache = mockObject<InMemoryCache>({
    get: (async ({ key }: { key: string[] }) =>
      key[2] === PAGE.token.id ? PAGE : undefined) as InMemoryCache['get'],
  })
  return createInteropRouter(manifest, async () => '<html />', cache)
}

/** Without data, so the page is small: the renderer's own test covers the content. */
const PAGE: InteropTokenPage & { apiSelection: { from: []; to: [] } } = {
  token: {
    id: 'usdc01',
    symbol: 'USDC',
    issuer: 'circle',
    iconUrl: null,
    category: 'stablecoin',
  },
  tokenEntry: { sections: [], deploymentsCount: 0 },
  tokenData: null,
  apiSelection: { from: [], to: [] },
}
