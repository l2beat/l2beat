import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import {
  DEFI_SUMMARY_CATEGORIES,
  DEFI_SUMMARY_PAGE_DESCRIPTION,
  DEFI_SUMMARY_TITLE,
  filterDefiSummaryProjects,
} from '~/server/features/defi/defiSummaryVisibility'
import { getDefiSummaryEntries } from '~/server/features/defi/getDefiSummaryEntries'
import { getDefiLiquidStakingCharts } from '~/server/features/defi/liquidStakingCharts/getDefiLiquidStakingCharts'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getDefiSummaryData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  const { appLayoutProps, entries, liquidStakingCharts, showAllProtocols } =
    await cache.get(
      {
        key: ['defi', 'summary', 'data'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getCachedData,
    )

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: DEFI_SUMMARY_TITLE,
        description: DEFI_SUMMARY_PAGE_DESCRIPTION,
        url,
        openGraph: {
          image: '/meta-images/defi/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'DefiSummaryPage',
      props: {
        ...appLayoutProps,
        entries,
        liquidStakingCharts,
        showAllProtocols,
        description: DEFI_SUMMARY_PAGE_DESCRIPTION,
      },
    },
  }
}

async function getCachedData() {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    ps
      .getProjects({
        where: ['defiInfo'],
        select: ['display', 'defiInfo', 'statuses'],
        optional: ['externalDependencies', 'tvsConfig'],
      })
      .then((projects) =>
        getDefiSummaryEntries(
          filterDefiSummaryProjects(projects, DEFI_SUMMARY_CATEGORIES),
        ),
      ),
  ])

  return {
    appLayoutProps,
    entries,
    liquidStakingCharts: getDefiLiquidStakingCharts(entries),
    showAllProtocols: DEFI_SUMMARY_CATEGORIES === undefined,
  }
}
