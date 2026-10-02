import { type InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { env } from '~/env'
import type { ProjectDefiEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createDefiRouter } from './DefiRouter'

// Method: turn the DeFi feature flag on, mount the real DeFi router with a
// page cache that already holds one project entry (so no data is fetched) and
// a render function that marks HTML, then request the project page the ways
// browsers and agents do. This pins the route order: `:slug` registered first
// would swallow "lido.md".
describe(createDefiRouter.name, () => {
  const originalDefiEnabled = env.CLIENT_SIDE_DEFI_ENABLED

  before(() => {
    env.CLIENT_SIDE_DEFI_ENABLED = true
  })

  after(() => {
    env.CLIENT_SIDE_DEFI_ENABLED = originalDefiEnabled
  })

  it('serves the project page as markdown on the .md URL', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/defi/projects/lido.md',
    )

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(
      'text/plain; charset=utf-8',
    )
    expect(await response.text()).toMatchRegex(/^# Lido\n/)
  })

  it('serves markdown on the page URL when Accept prefers it', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/defi/projects/lido',
      { headers: { Accept: 'text/markdown' } },
    )

    expect(response.headers.get('content-type')).toEqual(
      'text/markdown; charset=utf-8',
    )
    expect(await response.text()).toMatchRegex(/^# Lido\n/)
  })

  it('serves HTML on the page URL to browsers', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/defi/projects/lido',
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
  const router = createDefiRouter(manifest, async () => '<html />', cache)
  if (!router) throw new Error('DeFi router is disabled')
  return router
}

/** Only the name is asserted: the renderer's own test covers the content. */
const ENTRY: ProjectDefiEntry = {
  id: ProjectId('lido'),
  slug: 'lido',
  name: 'Lido',
  icon: '/icons/lido.png',
  description: 'Lido is a liquid staking protocol.',
  badges: [],
  projectLinks: [],
  discoUi: {
    href: 'https://disco.l2beat.com/ui/p/lido',
    images: { desktop: '/desktop.png', mobile: '/mobile.png' },
  },
  isUnderReview: false,
  warnings: {},
  sections: [],
}
