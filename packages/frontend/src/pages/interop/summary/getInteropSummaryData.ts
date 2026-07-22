import { chainToProjectId } from '@l2beat/config/build/global/chainMap'
import type { InMemoryCache } from '@l2beat/shared-pure'
import { ProjectId } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { RouterOutputs } from '~/trpc/React'
import { getSsrHelpers } from '~/trpc/server'
import { type Manifest, manifest } from '~/utils/Manifest'
import { MAX_SELECTED_CHAINS } from '../components/flows/consts'
import type { InteropQuery } from '../InteropRouter'
import { getInitialInteropSelection } from '../utils/getInitialInteropSelection'
import { mapInteropChainsToWithIcons } from '../utils/mapInteropChainsToWithIcons'
import type { InteropSelection } from '../utils/types'

export async function getInteropSummaryData(
  req: Request<unknown, unknown, unknown, InteropQuery>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const interopChains = getInteropChains()
  const interopChainsIds = interopChains.map((chain) => chain.id)

  const layer2sProjects = await ps.getProjects({
    select: ['scalingInfo'],
  })
  const layer2sProjectSlugById = new Map(
    layer2sProjects.map((p) => [p.id, p.slug]),
  )

  const interopChainsWithIcons = mapInteropChainsToWithIcons(
    manifest,
    interopChains,
  ).map((chain) => ({
    ...chain,
    href: getInteropChainHref(chain.id, layer2sProjectSlugById),
  }))

  const activeInteropChains = interopChainsWithIcons.filter(
    (chain) => !chain.isUpcoming,
  )

  const initialSelection = getInitialInteropSelection({
    query: req.query,
    interopChainsIds,
  })

  const queryState = await cache.get(
    {
      key: [
        'interop',
        'summary',
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
      }),
    },
    ssr: {
      page: 'InteropSummaryPage',
      props: {
        ...appLayoutProps,
        ...queryState,
        interopChains: activeInteropChainsSortedByVolume,
        defaultSelectedFlowChains,
        initialSelection,
      },
    },
  }
}

function getInteropChainHref(
  chainId: string,
  layer2sProjectSlugById: Map<ProjectId, string>,
): string | undefined {
  if (chainId === ProjectId.ETHEREUM) {
    return '/data-availability/projects/ethereum/ethereum'
  }
  const slug = layer2sProjectSlugById.get(chainToProjectId(chainId))
  return slug ? `/layer2s/projects/${slug}` : undefined
}

async function getCachedData(
  initialSelection: InteropSelection,
  initialFlowsChains: string[],
) {
  const helpers = getSsrHelpers()
  const [protocols] = await Promise.all([
    ps.getProjects({
      select: ['interopConfig'],
    }),
    initialSelection.from.length > 0 && initialSelection.to.length > 0
      ? helpers.queryClient.prefetchQuery(
          helpers.trpc.interop.dashboard.queryOptions({ ...initialSelection }),
        )
      : undefined,
  ])

  const shouldPrefetchFlows =
    initialSelection.from.length === 0 && initialSelection.to.length === 0

  let defaultFlowChainOrder = initialFlowsChains

  if (shouldPrefetchFlows) {
    const protocolIds = protocols.map((protocol) => protocol.id)
    // Determine the volume order across all chains on a throwaway client so the
    // all-chains query is not dehydrated (the client never requests it).
    const ordering = getSsrHelpers()
    const flowsData: RouterOutputs['interop']['flows'] =
      await ordering.queryClient.fetchQuery(
        ordering.trpc.interop.flows.queryOptions({
          chains: initialFlowsChains,
          protocolIds,
        }),
      )
    const chainsByVolume = flowsData.chainData
      .toSorted((a, b) => b.totalVolume - a.totalVolume)
      .map((chain) => chain.chainId)

    if (chainsByVolume.length > 0) {
      defaultFlowChainOrder = chainsByVolume
    }

    // The client's flows chart defaults to the top chains by volume, so
    // prefetch that exact query to hydrate it from cache.
    await helpers.queryClient.prefetchQuery(
      helpers.trpc.interop.flows.queryOptions({
        chains: defaultFlowChainOrder.slice(0, MAX_SELECTED_CHAINS),
        protocolIds,
      }),
    )
  }

  return {
    queryState: helpers.dehydrate(),
    protocols: protocols.map((protocol) => ({
      id: protocol.id,
      name: protocol.interopConfig.name ?? protocol.name,
      slug: protocol.slug,
      iconUrl: manifest.getUrl(`/icons/${protocol.slug}.png`),
    })),
    defaultFlowChainOrder,
  }
}
