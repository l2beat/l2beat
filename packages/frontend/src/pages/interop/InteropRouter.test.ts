import { type InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { InteropProtocolEntry } from '~/server/features/layer2s/interop/protocol/getInteropProtocolEntry'
import {
  MARKDOWN_CONTENT_TYPE,
  NEGOTIATED_MARKDOWN_CONTENT_TYPE,
} from '~/server/markdown/markdownAlternate'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createInteropRouter } from './InteropRouter'
import type { InteropTokenPage } from './token/renderInteropTokenMarkdown'

// Method: mount the real interop router with a page cache that already holds
// one protocol page and one token page (so no data is fetched) and a render
// function that marks HTML, then request the pages the ways browsers and
// agents do. Whether a slug is also a scaling project comes from the real
// project database, so "across" and "arbitrum" stand for the two cases. This
// pins the route order: a page route registered first would swallow
// "across.md" as the protocol slug or "usdc01.md" as the token id.
describe(createInteropRouter.name, () => {
  describe('protocol pages', () => {
    it('serves the protocol page as markdown on the .md URL', async () => {
      const response = await fetchFromRouter(
        createRouter(),
        '/interop/protocols/across.md',
      )

      expect(response.status).toEqual(200)
      expect(response.headers.get('content-type')).toEqual(
        MARKDOWN_CONTENT_TYPE,
      )
      expect(await response.text()).toMatchRegex(/^# Across\n/)
    })

    it('serves markdown on the page URL when Accept prefers it', async () => {
      const response = await fetchFromRouter(
        createRouter(),
        '/interop/protocols/across',
        { headers: { Accept: 'text/markdown' } },
      )

      expect(response.headers.get('content-type')).toEqual(
        NEGOTIATED_MARKDOWN_CONTENT_TYPE,
      )
      expect(await response.text()).toMatchRegex(/^# Across\n/)
    })

    it('serves HTML on the page URL to browsers', async () => {
      const response = await fetchFromRouter(
        createRouter(),
        '/interop/protocols/across',
        { headers: { Accept: 'text/html,*/*;q=0.8' } },
      )

      expect(await response.text()).toEqual('<html />')
    })

    it('sends protocols that are scaling projects to the scaling markdown', async () => {
      const response = await fetchFromRouter(
        createRouter(),
        '/interop/protocols/arbitrum.md',
        { redirect: 'manual' },
      )

      expect(response.status).toEqual(302)
      expect(
        new URL(response.headers.get('location') ?? '', 'http://x').pathname,
      ).toEqual('/layer2s/projects/arbitrum.md')
    })
  })

  describe('token pages', () => {
    for (const path of [
      '/interop/tokens/usdc01.md',
      '/interop/tokens/usdc01/usdc.md',
      '/interop/tokens/usdc01/circle/usdc.md',
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
      const response = await fetchFromRouter(
        createRouter(),
        '/interop/tokens/unknown.md',
      )

      expect(response.status).toEqual(404)
      expect(response.headers.get('content-type')).toEqual(
        MARKDOWN_CONTENT_TYPE,
      )
    })

    it('serves markdown on the page URL when Accept prefers it', async () => {
      const response = await fetchFromRouter(
        createRouter(),
        '/interop/tokens/usdc01/circle/usdc',
        { headers: { Accept: 'text/markdown' } },
      )

      expect(response.headers.get('content-type')).toEqual(
        NEGOTIATED_MARKDOWN_CONTENT_TYPE,
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
})

function createRouter() {
  // Page metadata is built per request, outside the cache.
  const manifest = mockObject<Manifest>({
    getUrl: (url) => url,
    getImage: (url) => ({ src: url, width: 1200, height: 630 }),
  })
  const cache = mockObject<InMemoryCache>({
    get: (async ({ key }: { key: string[] }) => {
      if (key[1] === 'protocols') return PROTOCOL_PAGE
      return key[2] === TOKEN_PAGE.token.id ? TOKEN_PAGE : undefined
    }) as InMemoryCache['get'],
  })
  return createInteropRouter(manifest, async () => '<html />', cache)
}

/** Only the name is asserted: the renderer's own test covers the content. */
const PROTOCOL_ENTRY: InteropProtocolEntry = {
  id: ProjectId('across'),
  name: 'Across',
  shortName: undefined,
  slug: 'across',
  icon: '/icons/across.png',
  underReviewStatus: undefined,
  header: { recentUpdatesCount: 0 },
  sections: [],
}

const PROTOCOL_PAGE = {
  project: { name: 'Across', slug: 'across', description: undefined },
  projectEntry: PROTOCOL_ENTRY,
  protocolData: {
    entry: undefined,
    flows: [],
    topPath: undefined,
    transferSize: undefined,
    topToken: undefined,
  },
  apiSelection: { from: [], to: [] },
  queryState: { mutations: [], queries: [] },
}

/** Without data, so the page is small: the renderer's own test covers the content. */
const TOKEN_PAGE: InteropTokenPage & { apiSelection: { from: []; to: [] } } = {
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
