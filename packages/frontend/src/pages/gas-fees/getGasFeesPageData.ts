import { assert, type InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import {
  FEE_SPLIT_NOTES,
  GAS_FEES_CHAINS,
  NO_PRIORITY_FEE_NOTES,
} from '~/server/features/gas-fees/chains'
import { getGasFeesTipping } from '~/server/features/gas-fees/getGasFeesTipping'
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
          'What it costs to get a transaction included on Ethereum and its Layer 2s, and what a tip buys on Ethereum.',
        url,
        openGraph: {
          image: '/meta-images/gas-fees/opengraph-image.png',
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
  // Opens on everything stored, so the upgrades are on the chart
  const initialRange = optionToRange('max')
  // The Ethereum vs L2s headline is about today's split, not the history
  const statsRange = optionToRange('1y')

  const [projects, tipping] = await Promise.all([
    ps.getProjects({
      ids: GAS_FEES_CHAINS.map((c) => ProjectId(c.id)),
      optional: [...PROJECT_PAGE_METADATA_FIELDS],
    }),
    getGasFeesTipping(),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.gasFees.chart.queryOptions({
        range: initialRange,
        metric: DEFAULT_GAS_FEES_METRIC,
      }),
    ),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.gasFees.summary.queryOptions({ range: statsRange }),
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
      feeSplitNotes: FEE_SPLIT_NOTES[chain.id] ?? {},
    }
  })

  return {
    chains,
    upgrades: getGasFeesUpgrades(),
    tipping,
    walletIcons: {
      Ambire: manifest.getUrl('/icons/ambire.png'),
      MetaMask: manifest.getUrl('/icons/metamask.png'),
      Rabby: manifest.getUrl('/icons/rabby.png'),
    },
    initialRange,
    statsRange,
    queryState: helpers.dehydrate(),
  }
}
