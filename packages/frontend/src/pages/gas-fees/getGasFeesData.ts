import { ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getGasFeesStats } from '~/server/features/gas-fees/daily/getGasFeesStats'
import { getGasFeesChains } from '~/server/features/gas-fees/getGasFeesChains'
import { getGasFeesUpgrades } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { getGasFeesTipping } from '~/server/features/gas-fees/tipping/getGasFeesTipping'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'
import { DEFAULT_METRIC } from './utils/metricLabels'
import { DEFAULT_CHART_RANGE, DEFAULT_TABLE_RANGE } from './utils/ranges'

export async function getGasFeesData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const helpers = getSsrHelpers()
  // Picked here, so the first render on the client starts from the same ranges
  const chartRange = optionToRange(DEFAULT_CHART_RANGE)
  const tableRange = optionToRange(DEFAULT_TABLE_RANGE)
  const [appLayoutProps, chains, ethereum, tipping, stats] = await Promise.all([
    getAppLayoutProps(),
    getGasFeesChains(),
    ps.getProject({ id: ProjectId.ETHEREUM, optional: ['milestones'] }),
    getGasFeesTipping(),
    getGasFeesStats(),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.gasFees.chart.queryOptions({
        range: chartRange,
        metric: DEFAULT_METRIC,
      }),
    ),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.gasFees.summary.queryOptions({ range: tableRange }),
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
        openGraph: { image: '/meta-images/gas-fees/opengraph-image.png' },
      }),
    },
    ssr: {
      page: 'GasFeesPage',
      props: {
        ...appLayoutProps,
        chains,
        upgrades: getGasFeesUpgrades(ethereum?.milestones ?? []),
        tipping,
        stats,
        walletIcons: {
          Ambire: manifest.getUrl('/icons/ambire.png'),
          MetaMask: manifest.getUrl('/icons/metamask.png'),
          Rabby: manifest.getUrl('/icons/rabby.png'),
        },
        chartRange,
        tableRange,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
