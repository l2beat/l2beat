import type { InMemoryCache } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createZkCatalogRouter } from './ZkCatalogRouter'

// Method: mount the real ZK catalog router with a page cache that already
// holds one project entry (so no data is fetched) and a render function that
// marks HTML, then request the project page the ways browsers and agents do.
// This pins the route order: `:slug` registered first would swallow
// "sp1turbo.md".
describe(createZkCatalogRouter.name, () => {
  it('serves the project page as markdown on the .md URL', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/zk-catalog/sp1turbo.md',
    )

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(
      'text/markdown; charset=utf-8',
    )
    expect(await response.text()).toMatchRegex(/^# SP1 Turbo\n/)
  })

  it('serves markdown on the page URL when Accept prefers it', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/zk-catalog/sp1turbo',
      { headers: { Accept: 'text/markdown' } },
    )

    expect(response.headers.get('content-type')).toEqual(
      'text/markdown; charset=utf-8',
    )
    expect(await response.text()).toMatchRegex(/^# SP1 Turbo\n/)
  })

  it('serves HTML on the page URL to browsers', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/zk-catalog/sp1turbo',
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
  return createZkCatalogRouter(manifest, async () => '<html />', cache)
}

/** Only the name is asserted: the renderer's own test covers the content. */
const ENTRY: ProjectZkCatalogEntry = {
  name: 'SP1 Turbo',
  shortName: undefined,
  slug: 'sp1turbo',
  icon: '/icons/sp1turbo.png',
  archivedAt: undefined,
  underReviewStatus: undefined,
  header: {
    links: [],
    techStack: {},
    trustedSetupsByProofSystem: {},
    tvs: { value: 0, change: 0, changePeriod: '7D' },
  },
  sections: [],
}
