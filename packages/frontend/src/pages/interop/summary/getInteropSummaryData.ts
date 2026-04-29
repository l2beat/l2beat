import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import { type Manifest, manifest } from '~/utils/Manifest'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { MAX_SELECTED_CHAINS } from '../components/flows/consts'
import type { InteropQuery } from '../InteropRouter'
import { getInitialInteropSelection } from '../utils/getInitialInteropSelection'
import { toInteropApiSelection } from '../utils/toInteropApiSelection'
import type { InteropMode, InteropSelection } from '../utils/types'

interface GetInteropSummaryDataOptions {
  mode?: InteropMode
}

export async function getInteropSummaryData(
  req: Request<unknown, unknown, unknown, InteropQuery>,
  manifest: Manifest,
  cache: InMemoryCache,
  options?: GetInteropSummaryDataOptions,
): Promise<RenderData> {
  const mode = options?.mode ?? 'public'
  const appLayoutProps = await getAppLayoutProps()
  const interopChains = getInteropChains()
  const interopChainsIds = interopChains.map((chain) => chain.id)

  const interopChainsWithIcons: InteropChainWithIcon[] = interopChains.map(
    (chain) => ({
      ...chain,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    }),
  )

  const activeInteropChains = interopChainsWithIcons.filter(
    (chain) => !chain.isUpcoming,
  )

  const initialSelection = getInitialInteropSelection({
    query: req.query,
    interopChainsIds,
    mode,
  })

  const queryState = await cache.get(
    {
      key: [
        'interop',
        'summary',
        mode,
        'prefetch',
        initialSelection.from.join(','),
        initialSelection.to.join(','),
      ],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    async () =>
      getCachedData(
        initialSelection,
        mode,
        activeInteropChains.map((chain) => chain.id),
      ),
  )

  const activeInteropChainsById = new Map(
    activeInteropChains.map((chain) => [chain.id, chain]),
  )
  const activeInteropChainsSortedByVolume = queryState.defaultFlowChainOrder
    .map((chainId) => activeInteropChainsById.get(chainId))
    .filter((chain) => chain !== undefined)
  const defaultSelectedFlowChains = activeInteropChainsSortedByVolume
    .slice(0, MAX_SELECTED_CHAINS)
    .map((chain) => chain.id)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Interoperability - L2BEAT',
        description:
          'Compare interoperability protocols across the Ethereum ecosystem. Track bridge volumes, transfer times & sizes, and explore how Non-minting, Lock & Mint, and Burn & Mint mechanisms affect cross-chain risk.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/interop/summary/opengraph-image.png',
        },
        excludeFromSearchEngines: mode === 'internal',
      }),
    },
    ssr: {
      page: 'InteropSummaryPage',
      props: {
        ...appLayoutProps,
        mode,
        ...queryState,
        interopChains: activeInteropChainsSortedByVolume,
        defaultSelectedFlowChains,
        initialSelection,
      },
    },
  }
}

async function getCachedData(
  initialSelection: InteropSelection,
  mode: InteropMode,
  initialFlowsChains: string[],
) {
  const helpers = getSsrHelpers()
  const apiSelection = toInteropApiSelection(initialSelection, mode)
  const [protocols] = await Promise.all([
    ps.getProjects({
      select: ['interopConfig'],
    }),
    apiSelection.from.length > 0 && apiSelection.to.length > 0
      ? helpers.interop.dashboard.prefetch({ ...apiSelection })
      : undefined,
  ])

  const shouldPrefetchFlows =
    mode === 'public' &&
    apiSelection.from.length === 0 &&
    apiSelection.to.length === 0

  let defaultFlowChainOrder = initialFlowsChains

  if (shouldPrefetchFlows) {
    const flowsData = await helpers.interop.flows.fetch({
      chains: initialFlowsChains,
      protocolIds: protocols.map((protocol) => protocol.id),
    })
    const chainsByVolume = flowsData.chainData
      .toSorted((a, b) => b.totalVolume - a.totalVolume)
      .map((chain) => chain.chainId)

    if (chainsByVolume.length > 0) {
      defaultFlowChainOrder = chainsByVolume
    }
  }

  return {
    queryState: helpers.dehydrate(),
    protocols: protocols.map((protocol) => ({
      id: protocol.id,
      name: protocol.interopConfig.name ?? protocol.name,
      iconUrl: manifest.getUrl(`/icons/${protocol.slug}.png`),
    })),
    defaultFlowChainOrder,
  }
}
