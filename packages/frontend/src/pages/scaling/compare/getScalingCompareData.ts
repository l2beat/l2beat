import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import { getCompareProjectEntries } from '~/server/features/scaling/compare/getCompareProjectEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { COMPARE_SERVER_METRICS } from './server/compareServerMetrics'
import { buildCompareUrl } from './utils/buildCompareUrl'
import {
  type CompareChartState,
  compareRangeToChartRange,
  DEFAULT_COMPARE_PROJECTS_COUNT,
  toCompareClientState,
} from './utils/compareChartState'
import { parseCompareStateFromSearchParams } from './utils/parseCompareStateFromSearchParams'

export async function getScalingCompareData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    getCompareData(req.originalUrl, cache),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Compare Projects - L2BEAT',
        description:
          'Compare Ethereum scaling projects on a single chart across metrics like value secured.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/scaling/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingComparePage',
      props: {
        ...appLayoutProps,
        ...data,
      },
    },
  }
}

async function getCompareData(originalUrl: string, cache: InMemoryCache) {
  const allProjects = await cache.get(
    {
      key: ['scaling', 'compare', 'projects'],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getCompareProjectEntries(),
  )
  const searchParams = new URLSearchParams(originalUrl.split('?')[1] ?? '')
  const initialState = parseCompareStateFromSearchParams({
    searchParams,
    validSlugs: allProjects.map((project) => project.slug),
  })

  // Key by the canonical URL of the parsed state so garbage params collapse
  // into the same cache entry instead of growing the cache per unique URL.
  const canonicalUrl = buildCompareUrl('/scaling/compare', initialState)
  const chartData = await cache.get(
    {
      key: ['scaling', 'compare', 'data', canonicalUrl],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getPrefetchedChartData(initialState, allProjects),
  )

  return {
    allProjects,
    initialState,
    ...chartData,
  }
}

async function getPrefetchedChartData(
  initialState: CompareChartState,
  allProjects: CompareProjectEntry[],
) {
  const serverMetric = COMPARE_SERVER_METRICS[initialState.metric]
  const defaultProjects = await serverMetric.getDefaultProjects(
    allProjects,
    DEFAULT_COMPARE_PROJECTS_COUNT,
  )
  const selectedProjects = getSelectedProjects(
    initialState.projects,
    defaultProjects,
    allProjects,
  )

  const initialChartRange = compareRangeToChartRange(initialState.range)
  const helpers = getSsrHelpers()
  await serverMetric.prefetch(
    helpers,
    selectedProjects,
    toCompareClientState(initialState, initialChartRange),
  )

  return {
    defaultProjectSlugs: defaultProjects.map((project) => project.slug),
    initialChartRange,
    queryState: helpers.dehydrate(),
  }
}

function getSelectedProjects(
  slugs: string[],
  defaultProjects: CompareProjectEntry[],
  allProjects: CompareProjectEntry[],
): CompareProjectEntry[] {
  if (slugs.length === 0) {
    return defaultProjects
  }
  const bySlug = new Map(allProjects.map((project) => [project.slug, project]))
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((project) => project !== undefined)
}
