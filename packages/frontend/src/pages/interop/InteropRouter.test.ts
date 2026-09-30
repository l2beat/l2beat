import { type InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { InteropProtocolEntry } from '~/server/features/layer2s/interop/protocol/getInteropProtocolEntry'
import { MARKDOWN_CONTENT_TYPE } from '~/server/markdown/markdownAlternate'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createInteropRouter } from './InteropRouter'

// Method: mount the real interop router with a page cache that already holds
// one protocol page (so no transfer data is fetched) and a render function
// that marks HTML, then request the protocol page the ways browsers and
// agents do. Whether a slug is also a scaling project comes from the real
// project database, so "across" and "arbitrum" stand for the two cases. This
// pins the route order: `:slug` registered first would swallow "across.md".
describe(createInteropRouter.name, () => {
  it('serves the protocol page as markdown on the .md URL', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/interop/protocols/across.md',
    )

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(MARKDOWN_CONTENT_TYPE)
    expect(await response.text()).toMatchRegex(/^# Across\n/)
  })

  it('serves markdown on the page URL when Accept prefers it', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/interop/protocols/across',
      { headers: { Accept: 'text/markdown' } },
    )

    expect(response.headers.get('content-type')).toEqual(MARKDOWN_CONTENT_TYPE)
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

function createRouter() {
  // Page metadata is built per request, outside the cache.
  const manifest = mockObject<Manifest>({
    getUrl: (url) => url,
    getImage: (url) => ({ src: url, width: 1200, height: 630 }),
  })
  const cachedPage = {
    project: { name: 'Across', slug: 'across', description: undefined },
    projectEntry: ENTRY,
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
  const cache = mockObject<InMemoryCache>({
    get: (async () => cachedPage) as InMemoryCache['get'],
  })
  return createInteropRouter(manifest, async () => '<html />', cache)
}

/** Only the name is asserted: the renderer's own test covers the content. */
const ENTRY: InteropProtocolEntry = {
  id: ProjectId('across'),
  name: 'Across',
  shortName: undefined,
  slug: 'across',
  icon: '/icons/across.png',
  underReviewStatus: undefined,
  header: { recentUpdatesCount: 0 },
  sections: [],
}
