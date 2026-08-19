import { type InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { CompareProjectEntry } from '~/server/features/layer2s/compare/getCompareProjectEntries'
import { getCompareProjectEntries } from '~/server/features/layer2s/compare/getCompareProjectEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { COMPARE_METRIC_DEFS } from './metrics/compareMetricDefs'
import { buildCompareUrl } from './utils/buildCompareUrl'
import {
  type CompareChartState,
  compareRangeToChartRange,
  DEFAULT_COMPARE_PROJECTS_COUNT,
} from './utils/compareChartState'
import { COMPARE_PAGE_PATH } from './utils/getCompareEntryUrl'
import { parseCompareStateFromSearchParams } from './utils/parseCompareStateFromSearchParams'

export async function getL2CompareData(
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
          image: '/meta-images/layer2s/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'L2ComparePage',
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
      key: ['layer2s', 'compare', 'projects'],
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
    buildCompareUrl(COMPARE_PAGE_PATH, initialState) === COMPARE_PAGE_PATH
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
      key: ['layer2s', 'compare', 'data', 'default'],
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
  const helpers = getSsrHelpers()
  await Promise.all(
    initialState.charts.map((chart) =>
      COMPARE_METRIC_DEFS[chart.metric].prefetch(
        helpers,
        defaultProjects,
        chart,
        initialChartRange,
      ),
    ),
  )

  return {
    initialChartRange,
    queryState: helpers.dehydrate(),
  }
}
