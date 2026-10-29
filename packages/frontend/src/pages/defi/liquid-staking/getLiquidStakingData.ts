import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { LIQUID_STAKING_DESCRIPTION } from '~/consts/summaryPageDescriptions'
import { getTotalValueLockedByProject } from '~/server/features/defi/getDefiTotalValueLocked'
import { getLiquidStakingEntries } from '~/server/features/defi/liquid-staking/getLiquidStakingEntries'
import { getLiquidStakingProjects } from '~/server/features/defi/liquid-staking/getLiquidStakingProjects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getItemListStructuredData } from '~/ssr/head/structured-data/getItemListStructuredData'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'

export async function getLiquidStakingData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  const {
    appLayoutProps,
    entries,
    chartProjects,
    defaultChartRange,
    queryState,
  } = await cache.get(
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
        title: 'Ethereum Liquid Staking: Risks, Yield & Cost of Exit - L2BEAT',
        description: LIQUID_STAKING_DESCRIPTION,
        url,
        openGraph: {
          image: '/meta-images/defi/liquid-staking/opengraph-image.png',
        },
        structuredData: (page) => [
          getItemListStructuredData(page, {
            name: 'Liquid staking protocols',
            items: entries.map((entry) => ({
              name: entry.name,
              path: entry.href,
            })),
          }),
        ],
      }),
    },
    ssr: {
      page: 'LiquidStakingPage',
      props: {
        ...appLayoutProps,
        entries,
        chartProjects,
        defaultChartRange,
        queryState,
      },
    },
  }
}

async function getCachedData() {
  const helpers = getSsrHelpers()
  const defaultChartRange = optionToRange('1y')

  const projectsQuery = getLiquidStakingProjects()
  const [appLayoutProps, projects, tvlByProject, yieldChart, costOfExit] =
    await Promise.all([
      getAppLayoutProps(),
      projectsQuery,
      projectsQuery.then(getTotalValueLockedByProject),
      // The chart queries also fill the query cache, so the charts hydrate
      // without a request.
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
  const entries = getLiquidStakingEntries(projects, tvlByProject, {
    yield: yieldChart,
    costOfExit,
  })

  return {
    appLayoutProps,
    entries,
    chartProjects: entries.map((entry) => ({
      id: entry.id,
      name: entry.shortName ?? entry.name,
      icon: entry.icon,
    })),
    defaultChartRange,
    queryState: helpers.dehydrate(),
  }
}
