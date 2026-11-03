import { assert, type InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import {
  GAS_FEES_CHAINS,
  NO_PRIORITY_FEE_NOTES,
} from '~/server/features/gas-fees/chains'
import { getGasFeesUpgrades } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import { generateAccessibleColors } from '~/utils/generateColors'
import type { Manifest } from '~/utils/Manifest'
import {
  getProjectUrl,
  PROJECT_PAGE_METADATA_FIELDS,
} from '~/utils/project/getProjectUrl'
import { optionToRange } from '~/utils/range/range'
import { DEFAULT_GAS_FEES_METRIC } from './components/metrics'
import type { GasFeesChain } from './components/types'

export async function getGasFeesPageData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      { key: ['gas-fees'], ttl: 5 * 60, staleWhileRevalidate: 25 * 60 },
      () => getCachedData(manifest),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Gas fees',
        description:
          'What it costs to get a transaction included on Ethereum and its Layer 2s, and how Ethereum upgrades brought fees down.',
        url,
        openGraph: {
          // TODO: generate a gas fees image once the page leaves prototype
          image: '/meta-images/home/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'GasFeesPage',
      props: {
        ...appLayoutProps,
        ...data,
      },
    },
  }
}

async function getCachedData(manifest: Manifest) {
  const helpers = getSsrHelpers()
  // Opens on the whole history: the point is how far fees have fallen
  const initialRange = optionToRange('max')

  const [projects] = await Promise.all([
    ps.getProjects({
      ids: GAS_FEES_CHAINS.map((c) => ProjectId(c.id)),
      optional: [...PROJECT_PAGE_METADATA_FIELDS],
    }),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.gasFees.chart.queryOptions({
        range: initialRange,
        metric: DEFAULT_GAS_FEES_METRIC,
      }),
    ),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.gasFees.summary.queryOptions({ range: initialRange }),
    ),
  ])

  // Ethereum keeps the site-wide Ethereum color, so it takes no palette slot
  const l2Colors = generateAccessibleColors(GAS_FEES_CHAINS.length - 1)
  const chains: GasFeesChain[] = GAS_FEES_CHAINS.map((chain, i) => {
    const project = projects.find((p) => p.id === chain.id)
    assert(project, `Project ${chain.id} not found`)
    return {
      id: chain.id,
      name: project.name,
      shortName: project.shortName,
      type: chain.type,
      href: getProjectUrl(project),
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      color:
        chain.id === 'ethereum'
          ? 'var(--chart-ethereum)'
          : (l2Colors[i - 1] ?? 'var(--secondary)'),
      noPriorityFeeNote: NO_PRIORITY_FEE_NOTES[chain.id],
    }
  })

  return {
    chains,
    upgrades: getGasFeesUpgrades(),
    initialRange,
    queryState: helpers.dehydrate(),
  }
}
