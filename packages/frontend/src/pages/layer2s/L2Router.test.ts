import type { InMemoryCache } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createL2Router } from './L2Router'

// Method: mount the real scaling router with a page cache that already holds
// the page's data (so no data is fetched) and a render function that marks
// HTML, then request the page the ways a browser does.
describe(createL2Router.name, () => {
  // The costs page has a validiums & optimiums tab, which writes this value
  // to the URL; a reload or a shared link must open it, not return a 400.
  it('serves the costs page on every tab the page links to', async () => {
    const router = createRouter({
      entries: { rollups: [], validiumsAndOptimiums: [], others: [] },
      queryState: {},
    })

    for (const tab of ['rollups', 'validiumsAndOptimiums', 'others']) {
      const response = await fetchFromRouter(
        router,
        `/layer2s/costs?tab=${tab}`,
      )

      expect(response.status).toEqual(200)
      expect(await response.text()).toEqual('<html />')
    }
  })
})

function createRouter(cachedValue: unknown) {
  const manifest = mockObject<Manifest>({ getUrl: (path: string) => path })
  const cache = mockObject<InMemoryCache>({
    get: (async () => cachedValue) as InMemoryCache['get'],
  })
  return createL2Router(manifest, async () => '<html />', cache)
}
