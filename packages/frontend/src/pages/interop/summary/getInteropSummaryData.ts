import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import type { SelectedChains } from '~/server/features/scaling/interop/types'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { withProjectIcon } from '~/utils/withProjectIcon'
import type { SelectedChainsQuery } from '../InteropRouter'

export async function getInteropSummaryData(
  req: Request<unknown, unknown, unknown, SelectedChainsQuery>,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const interopChains = getInteropChains()
  const interopChainsIds = interopChains.map((chain) => chain.id)

  const initialSelectedChains: SelectedChains = [
    interopChainsIds.find((id) => id === req.query.selectedChains?.[0]) ??
      'ethereum',
    interopChainsIds.find((id) => id === req.query.selectedChains?.[1]) ??
      'arbitrum',
  ]

  const queryState = await cache.get(
    {
      key: ['interop', 'summary', 'prefetch', ...initialSelectedChains],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    async () => getCachedData(initialSelectedChains),
  )

  const interopChainsWithIcons = interopChains.map((chain) => ({
    ...chain,
    iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
  }))

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/interop/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'InteropSummaryPage',
      props: {
        ...appLayoutProps,
        ...queryState,
        interopChains: interopChainsWithIcons,
        initialSelectedChains,
      },
    },
  }
}

async function getCachedData(initialSelectedChains: SelectedChains) {
  const helpers = getSsrHelpers()
  const [protocols] = await Promise.all([
    ps.getProjects({
      select: ['interopConfig'],
    }),
    helpers.interop.dashboard.prefetch({
      selectedChains: initialSelectedChains,
    }),
  ])

  return {
    queryState: helpers.dehydrate(),
    protocols: protocols.map(withProjectIcon),
  }
}
