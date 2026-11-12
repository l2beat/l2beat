import type { ProjectPrivacyAdversaries } from '@l2beat/config'
import { type InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { env } from '~/env'
import type { ProjectDefiEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import type { InteropProtocolEntry } from '~/server/features/layer2s/interop/protocol/getInteropProtocolEntry'
import type { ProjectL2Entry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import {
  MARKDOWN_CONTENT_TYPE,
  NEGOTIATED_MARKDOWN_CONTENT_TYPE,
} from '~/server/markdown/markdownAlternate'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createProjectRouter } from './ProjectRouter'

// Method: mount the real project router with a page cache that already holds
// one page (so no data is fetched) and a render function that marks HTML, then
// request the page the ways browsers and agents do. Which page a slug has
// comes from the real project database.
describe(createProjectRouter.name, () => {
  const original = {
    defi: env.CLIENT_SIDE_DEFI_ENABLED,
    ossification: env.CLIENT_SIDE_OSSIFICATION_ENABLED,
    interopChains: env.INTEROP_CHAINS,
  }

  afterEach(() => {
    env.CLIENT_SIDE_DEFI_ENABLED = original.defi
    env.CLIENT_SIDE_OSSIFICATION_ENABLED = original.ossification
    env.INTEROP_CHAINS = original.interopChains
  })

  // Pins the route order: `:slug` registered first would swallow "arbitrum.md".
  it('serves the page as markdown on the .md URL', async () => {
    const response = await fetchFromRouter(
      createRouter(L2_PAGE),
      '/projects/arbitrum.md',
    )

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual(MARKDOWN_CONTENT_TYPE)
    expect(await response.text()).toMatchRegex(/^# Arbitrum One\n/)
  })

  it('serves markdown on the page URL when Accept prefers it', async () => {
    const response = await fetchFromRouter(
      createRouter(L2_PAGE),
      '/projects/arbitrum',
      { headers: { Accept: 'text/markdown' } },
    )

    expect(response.headers.get('content-type')).toEqual(
      NEGOTIATED_MARKDOWN_CONTENT_TYPE,
    )
    expect(await response.text()).toMatchRegex(/^# Arbitrum One\n/)
  })

  it('serves HTML on the page URL to browsers', async () => {
    const response = await fetchFromRouter(
      createRouter(L2_PAGE),
      '/projects/arbitrum',
      { headers: { Accept: 'text/html,*/*;q=0.8' } },
    )

    expect(response.status).toEqual(200)
    expect(await response.text()).toEqual('<html />')
  })

  it('answers 404 for a slug without a page', async () => {
    const router = createRouter(L2_PAGE)

    const markdown = await fetchFromRouter(router, '/projects/no-such-slug.md')
    const negotiated = await fetchFromRouter(router, '/projects/no-such-slug', {
      headers: { Accept: 'text/markdown' },
    })

    expect(markdown.status).toEqual(404)
    expect(negotiated.status).toEqual(404)
  })

  // Express answers 500 only for errors that reach it; a rejection it does not
  // await would escape as an unhandled rejection.
  it('answers 500 when the page fails to build', async () => {
    const cache = mockObject<InMemoryCache>({
      get: (async () => {
        throw new Error('Database unavailable')
      }) as InMemoryCache['get'],
    })
    const router = createProjectRouter(MANIFEST, async () => '<html />', cache)

    const response = await fetchFromRouter(router, '/projects/arbitrum', {
      headers: { Accept: 'text/html' },
    })

    expect(response.status).toEqual(500)
  })

  // One slug per kind of page: each has a builder of its own.
  for (const [slug, getPage, heading] of [
    ['tornado-cash', () => ({ props: { entry: PRIVACY_ENTRY } }), '# Tornado Cash'],
    ['sp1turbo', () => ({ props: { projectEntry: ZK_CATALOG_ENTRY } }), '# SP1 Turbo'],
    ['across', () => INTEROP_PAGE, '# Across'],
    ['lido', () => ({ props: { entry: DEFI_ENTRY } }), '# Lido'],
  ] as const) {
    it(`serves /projects/${slug}.md with the markdown of its kind of page`, async () => {
      env.CLIENT_SIDE_DEFI_ENABLED = true

      const response = await fetchFromRouter(
        createRouter(getPage()),
        `/projects/${slug}.md`,
      )

      expect((await response.text()).split('\n')[0]).toEqual(heading)
    })
  }

  // The flags production runs: DeFi off and Ossification on.
  it('serves the pages of DeFi projects that Ossification tracks without the DeFi section', async () => {
    env.CLIENT_SIDE_DEFI_ENABLED = false
    env.CLIENT_SIDE_OSSIFICATION_ENABLED = true

    const response = await fetchFromRouter(
      createRouter({ props: { entry: DEFI_ENTRY } }),
      '/projects/uniswapv3',
    )

    expect(response.status).toEqual(200)
  })

  // Chain pages show only interop flows, which have no markdown version.
  it('serves a chain page as HTML only', async () => {
    env.INTEROP_CHAINS = ['solana']
    const router = createRouter({ props: {} })

    const negotiated = await fetchFromRouter(router, '/projects/solana', {
      headers: { Accept: 'text/markdown' },
    })
    const markdown = await fetchFromRouter(router, '/projects/solana.md')

    expect(negotiated.status).toEqual(200)
    expect(await negotiated.text()).toEqual('<html />')
    expect(markdown.status).toEqual(404)
  })
})

const MANIFEST = mockObject<Manifest>({})

function createRouter(cachedPage: object) {
  const cache = mockObject<InMemoryCache>({
    get: (async () => ({ head: {}, ...cachedPage })) as InMemoryCache['get'],
  })
  return createProjectRouter(MANIFEST, async () => '<html />', cache)
}

// Of each entry only the name is asserted: the renderers' own tests cover the
// content.

const L2_RISK = { name: 'Risk', value: 'Value', sentiment: 'good' } as const

const L2_ENTRY: ProjectL2Entry = {
  id: ProjectId('arbitrum'),
  type: 'layer2',
  name: 'Arbitrum One',
  shortName: undefined,
  slug: 'arbitrum',
  icon: '/icons/arbitrum.png',
  archivedAt: undefined,
  isAppchain: false,
  underReviewStatus: undefined,
  header: {
    description: 'Arbitrum One is a general-purpose optimistic rollup.',
    recentUpdatesCount: 0,
    links: [],
    chainId: 42161,
    category: 'Optimistic Rollup',
    purposes: ['Universal'],
    privacyProjects: [],
    tvs: {
      breakdown: {
        total: 15_200_000_000,
        native: 5_000_000_000,
        canonical: 8_000_000_000,
        external: 2_200_000_000,
        totalChange: 0.0123,
        totalChangePeriod: '7D',
      },
      additionalTrustAssumptionsPercentage: 0,
      tokens: { warnings: [], associatedTokens: [] },
    },
    activity: {
      lastDayUops: 25.3,
      uopsWeeklyChange: -0.021,
      uopsWeeklyChangePeriod: '7D',
      syncWarning: undefined,
    },
  },
  rosette: { self: [L2_RISK, L2_RISK, L2_RISK, L2_RISK, L2_RISK] },
  sections: [],
  hostChainName: 'Ethereum',
  stageConfig: {
    stage: 'Stage 1',
    downgradePending: undefined,
    message: undefined,
    summary: [],
  },
  walkAway: undefined,
  discoUiHref: undefined,
}

const L2_PAGE = { props: { projectEntry: L2_ENTRY } }

const PRIVACY_RISK = { value: 'Value', sentiment: 'good', description: '' } as const

const PRIVACY_ENTRY: ProjectPrivacyEntry = {
  id: ProjectId('tornado-cash'),
  slug: 'tornado-cash',
  href: '/projects/tornado-cash',
  name: 'Tornado Cash',
  icon: '/icons/tornado-cash.png',
  description: 'Tornado Cash is a non-custodial mixer.',
  badges: [],
  projectLinks: [],
  discoUi: {
    href: 'https://disco.ethbeat.org/ui/p/tornado-cash',
    images: { desktop: '/desktop.png', mobile: '/mobile.png' },
  },
  bucketCount: 0,
  assetsCount: 0,
  hasTvl: false,
  attributes: [],
  trackedOn: [],
  scalingProjects: [],
  exitWindow: { ...PRIVACY_RISK, walkawayTest: { passed: true } },
  trustedSetup: { ...PRIVACY_RISK, risk: 'green', label: PRIVACY_RISK.value },
  reproducibility: PRIVACY_RISK,
  summary: {
    totalValueLockedUsd: undefined,
    totalValueLockedChange7d: undefined,
    deposits: { total: 0, last7d: 0, change7d: 0, last30d: 0 },
  },
  isUnderReview: false,
  recentUpdatesCount: 0,
  warnings: {},
  // Every privacy project has one; the risk profile is derived from it.
  sections: [
    {
      type: 'PrivacyAdversariesSection',
      props: {
        id: 'privacy-adversaries',
        title: 'Privacy',
        adversaries: {
          promise: { protects: 'linkage', text: '' },
          adversaries: [],
          fields: [],
          cells: {} as ProjectPrivacyAdversaries['cells'],
        },
      },
    },
  ],
}

const ZK_CATALOG_ENTRY: ProjectZkCatalogEntry = {
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

const DEFI_ENTRY: ProjectDefiEntry = {
  id: ProjectId('lido'),
  slug: 'lido',
  name: 'Lido',
  icon: '/icons/lido.png',
  description: 'Lido is a liquid staking protocol.',
  badges: [],
  projectLinks: [],
  discoUi: {
    href: 'https://disco.ethbeat.org/ui/p/lido',
    images: { desktop: '/desktop.png', mobile: '/mobile.png' },
  },
  isUnderReview: false,
  warnings: {},
  sections: [],
}

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

const INTEROP_PAGE = {
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
