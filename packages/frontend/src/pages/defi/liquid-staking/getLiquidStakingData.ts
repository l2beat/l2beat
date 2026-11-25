import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { LIQUID_STAKING_DESCRIPTION } from '~/consts/summaryPageDescriptions'
import { loadLiquidStakingEntries } from '~/server/features/defi/liquid-staking/getLiquidStakingEntries'
import { getLiquidStakingTvlSummary } from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getItemListStructuredData } from '~/ssr/head/structured-data/getItemListStructuredData'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { type ChartRange, optionToRange } from '~/utils/range/range'

export async function getLiquidStakingData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  const { appLayoutProps, entries, tvlSummary, defaultChartRange, queryState } =
    await cache.get(
      {
        key: ['defi', 'liquid-staking', 'data'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getCachedData,
    )

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Liquid Staking',
        title: 'Ethereum Liquid Staking: Risks, Yield & Cost of Exit - ETHBEAT',
        description: LIQUID_STAKING_DESCRIPTION,
        url,
        openGraph: {
          image: '/meta-images/defi/liquid-staking/opengraph-image.png',
        },
        structuredData: (page) => [
          getItemListStructuredData(page, {
            name: 'Liquid staking protocols',
            items: entries.flatMap((entry) =>
              entry.href ? [{ name: entry.name, path: entry.href }] : [],
            ),
          }),
        ],
      }),
    },
    ssr: {
      page: 'LiquidStakingPage',
      props: {
        ...appLayoutProps,
        entries,
        tvlSummary,
        defaultChartRange,
        queryState,
      },
    },
  }
}

async function getCachedData() {
  const helpers = getSsrHelpers()
  const defaultChartRange = optionToRange('1y')
  // The summary's changes are yearly whatever range the chart opens on; while
  // that is 1y too, both read one query.
  const summaryRange = optionToRange('1y')
  const fetchTvlChart = (range: ChartRange) =>
    helpers.queryClient.fetchQuery(
      helpers.trpc.defi.liquidStakingTvlChart.queryOptions({ range }),
    )

  const [appLayoutProps, summaryTvlChart, { entries }] = await Promise.all([
    getAppLayoutProps(),
    fetchTvlChart(summaryRange),
    // The chart queries also fill the query cache, so the charts hydrate
    // without a request.
    loadLiquidStakingEntries(async () => {
      const [yieldChart, costOfExit] = await Promise.all([
        helpers.queryClient.fetchQuery(
          helpers.trpc.defi.liquidStakingYieldChart.queryOptions({
            range: defaultChartRange,
          }),
        ),
        helpers.queryClient.fetchQuery(
          helpers.trpc.defi.liquidStakingCostOfExitChart.queryOptions({
            range: defaultChartRange,
          }),
        ),
      ])
      return { yield: yieldChart, costOfExit }
    }),
    fetchTvlChart(defaultChartRange),
  ])

  return {
    appLayoutProps,
    entries,
    tvlSummary: getLiquidStakingTvlSummary(summaryTvlChart),
    defaultChartRange,
    queryState: helpers.dehydrate(),
  }
}
