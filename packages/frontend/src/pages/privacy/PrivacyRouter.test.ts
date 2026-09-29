import { type InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createPrivacyRouter } from './PrivacyRouter'

// Method: mount the real privacy router with a page cache that already holds
// one project entry (so no data is fetched) and a render function that marks
// HTML, then request the project page the ways browsers and agents do. This
// pins the route order: `:slug` registered first would swallow
// "tornado-cash.md".
describe(createPrivacyRouter.name, () => {
  it('serves the project page as markdown on the .md URL', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/privacy/projects/tornado-cash.md',
    )

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(
      'text/plain; charset=utf-8',
    )
    expect(await response.text()).toMatchRegex(/^# Tornado Cash\n/)
  })

  it('serves markdown on the page URL when Accept prefers it', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/privacy/projects/tornado-cash',
      { headers: { Accept: 'text/markdown' } },
    )

    expect(response.headers.get('content-type')).toEqual(
      'text/plain; charset=utf-8',
    )
    expect(await response.text()).toMatchRegex(/^# Tornado Cash\n/)
  })

  it('serves HTML on the page URL to browsers', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/privacy/projects/tornado-cash',
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
  return createPrivacyRouter(manifest, async () => '<html />', cache)
}

const RISK = { value: 'Value', sentiment: 'good', description: '' } as const

/** Only the heading is asserted: the renderer's own test covers the content. */
const ENTRY: ProjectPrivacyEntry = {
  id: ProjectId('tornado-cash'),
  slug: 'tornado-cash',
  href: '/privacy/projects/tornado-cash',
  name: 'Tornado Cash',
  icon: '/icons/tornado-cash.png',
  description: 'Tornado Cash is a non-custodial mixer.',
  badges: [],
  projectLinks: [],
  discoUi: {
    href: 'https://disco.l2beat.com/ui/p/tornado-cash',
    images: { desktop: '/desktop.png', mobile: '/mobile.png' },
  },
  bucketCount: 0,
  assetsCount: 0,
  hasTvl: false,
  attributes: [],
  trackedOn: [],
  exitWindow: { ...RISK, walkawayTest: { passed: true } },
  trustedSetup: { ...RISK, risk: 'green' },
  reproducibility: RISK,
  summary: {
    totalValueLockedUsd: undefined,
    totalValueLockedChange7d: undefined,
    deposits: { total: 0, last7d: 0, change7d: 0, last30d: 0 },
  },
  isUnderReview: false,
  recentUpdatesCount: 0,
  warnings: {},
  sections: [],
}
