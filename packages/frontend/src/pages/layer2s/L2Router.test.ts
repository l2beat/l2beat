import type { InMemoryCache } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createL2Router } from './L2Router'
import { ENTRY } from './project/renderL2ProjectMarkdown.fixture'

// Method: mount the real scaling router with a page cache that already holds
// one project entry (so no data is fetched) and a render function that marks
// HTML, then request the project page the ways browsers and agents do. This
// pins the route order: `:slug` registered first would swallow "arbitrum.md".
describe(createL2Router.name, () => {
  it('serves the project page as markdown on the .md URL', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/layer2s/projects/arbitrum.md',
    )

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(
      'text/markdown; charset=utf-8',
    )
    expect(await response.text()).toMatchRegex(/^# Arbitrum One\n/)
  })

  it('serves markdown on the page URL when Accept prefers it', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/layer2s/projects/arbitrum',
      { headers: { Accept: 'text/markdown' } },
    )

    expect(response.headers.get('content-type')).toEqual(
      'text/markdown; charset=utf-8',
    )
    expect(await response.text()).toMatchRegex(/^# Arbitrum One\n/)
  })

  it('serves HTML on the page URL to browsers', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/layer2s/projects/arbitrum',
      { headers: { Accept: 'text/html,*/*;q=0.8' } },
    )

    expect(await response.text()).toEqual('<html />')
  })
})

function createRouter() {
  const manifest = mockObject<Manifest>({})
  const cachedPage = { head: {}, props: { projectEntry: ENTRY } }
  const cache = mockObject<InMemoryCache>({
    get: (async () => cachedPage) as InMemoryCache['get'],
  })
  return createL2Router(manifest, async () => '<html />', cache)
}
