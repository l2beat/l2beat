import { type InMemoryCache, ProjectId } from '@l2beat/shared-pure'
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
          'Compare Ethereum scaling projects across metrics like value secured and activity, on one or more charts.',
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
  // Always ranked by TVS regardless of chart metrics - the universe is
  // already ordered by TVS descending. Ethereum is a baseline to opt into,
  // never a default.
  const defaultProjects = allProjects
    .filter((project) => project.id !== ProjectId.ETHEREUM)
    .slice(0, DEFAULT_COMPARE_PROJECTS_COUNT)
  const defaultProjectSlugs = defaultProjects.map((project) => project.slug)

  // Chart data is only prefetched for the pristine default view; every
  // customized URL renders with client-side loading states instead. The
  // canonical-URL check collapses garbage params into the default view.
  const isDefaultView =
    buildCompareUrl('/scaling/compare', initialState) === '/scaling/compare'
  if (!isDefaultView) {
    return {
      allProjects,
      initialState,
      defaultProjectSlugs,
      initialChartRange: compareRangeToChartRange(initialState.range),
      queryState: undefined,
    }
  }

  // The resolved range is cached together with the dehydrated queries so
  // the client's seeded query input always matches the prefetched one.
  const chartData = await cache.get(
    {
      key: ['scaling', 'compare', 'data', 'default'],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getPrefetchedChartData(initialState, defaultProjects),
  )

  return {
    allProjects,
    initialState,
    defaultProjectSlugs,
    ...chartData,
  }
}

async function getPrefetchedChartData(
  initialState: CompareChartState,
  defaultProjects: CompareProjectEntry[],
) {
  const initialChartRange = compareRangeToChartRange(initialState.range)
  const clientState = toCompareClientState(initialState, initialChartRange)
  const helpers = getSsrHelpers()
  for (const chart of clientState.charts) {
    await COMPARE_SERVER_METRICS[chart.metric].prefetch(
      helpers,
      defaultProjects,
      { ...chart, chartRange: clientState.chartRange },
    )
  }

  return {
    initialChartRange,
    queryState: helpers.dehydrate(),
  }
}
