import type { InMemoryCache } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { DaProjectPageEntry } from '~/server/features/data-availability/project/getDaProjectEntry'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createDataAvailabilityRouter } from './DataAvailabilityRouter'

// Method: mount the real DA router with a page cache that already holds one
// project entry (so no data is fetched) and a render function that marks
// HTML, then request the project page the ways browsers and agents do. This
// pins the route order: `:bridge` registered first would swallow
// "blobstream.md".
describe(createDataAvailabilityRouter.name, () => {
  it('serves the project page as markdown on the .md URL', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/data-availability/projects/celestia/blobstream.md',
    )

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(
      'text/plain; charset=utf-8',
    )
    expect(await response.text()).toMatchRegex(/^# Celestia\n/)
  })

  it('serves markdown on the page URL when Accept prefers it', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/data-availability/projects/celestia/blobstream',
      { headers: { Accept: 'text/markdown' } },
    )

    expect(response.headers.get('content-type')).toEqual(
      'text/plain; charset=utf-8',
    )
    expect(await response.text()).toMatchRegex(/^# Celestia\n/)
  })

  it('serves HTML on the page URL to browsers', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/data-availability/projects/celestia/blobstream',
      { headers: { Accept: 'text/html,*/*;q=0.8' } },
    )

    expect(await response.text()).toEqual('<html />')
  })
})

function createRouter() {
  const manifest = mockObject<Manifest>({})
  const cachedPage = { head: {}, props: { entry: ENTRY } }
  const cache = mockObject<InMemoryCache>({
    get: (async () => cachedPage) as InMemoryCache['get'],
  })
  return createDataAvailabilityRouter(manifest, async () => '<html />', cache)
}

const ENTRY: DaProjectPageEntry = {
  entryType: 'common',
  name: 'Celestia',
  slug: 'celestia',
  icon: '/icons/celestia.png',
  kind: 'Public Blockchain',
  type: 'Public Blockchain',
  description: 'Celestia is a modular data availability network.',
  isUnderReview: false,
  archivedAt: undefined,
  colors: undefined,
  selectedBridge: {
    name: 'Blobstream',
    slug: 'blobstream',
    isNoBridge: false,
    grissiniValues: [],
  },
  bridges: [],
  header: {
    daLayerGrissiniValues: [],
    daBridgeGrissiniValues: [],
    tvs: 0,
    links: [],
    economicSecurity: undefined,
    durationStorage: undefined,
    maxThroughputPerSecond: undefined,
    usedIn: [],
    numberOfValidators: undefined,
  },
  sections: [],
}
