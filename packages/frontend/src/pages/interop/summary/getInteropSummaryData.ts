import type { InMemoryCache } from '@l2beat/shared-pure'
import { ProjectId } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
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

  const scalingProjects = await ps.getProjects({
    select: ['scalingInfo'],
  })
  const scalingProjectSlugById = new Map(
    scalingProjects.map((p) => [p.id, p.slug]),
  )

  const interopChainsWithIcons = mapInteropChainsToWithIcons(
    manifest,
    interopChains,
  ).map((chain) => ({
    ...chain,
    href: getInteropChainHref(chain.id, scalingProjectSlugById),
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
  scalingProjectSlugById: Map<ProjectId, string>,
): string | undefined {
  if (chainId === ProjectId.ETHEREUM) {
    return '/data-availability/projects/ethereum/ethereum'
  }
  const slug = scalingProjectSlugById.get(ProjectId(chainId))
  return slug ? `/scaling/projects/${slug}` : undefined
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
    const flowsData: RouterOutputs['interop']['flows'] =
      await helpers.queryClient.fetchQuery(
        helpers.trpc.interop.flows.queryOptions({
          chains: initialFlowsChains,
          protocolIds: protocols.map((protocol) => protocol.id),
        }),
      )
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
      slug: protocol.slug,
      iconUrl: manifest.getUrl(`/icons/${protocol.slug}.png`),
    })),
    defaultFlowChainOrder,
  }
}
