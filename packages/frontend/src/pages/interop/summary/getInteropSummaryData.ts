import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import type { FromToQuery } from '../InteropRouter'

export async function getInteropSummaryData(
  req: Request<unknown, unknown, unknown, FromToQuery>,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const helpers = getSsrHelpers()
  const appLayoutProps = await getAppLayoutProps()
  const interopChains = getInteropChains()
  const interopChainsIds = interopChains.map((chain) => chain.id)

  const initialSelectedChains = {
    from: (
      req.query.from?.filter((id) => interopChainsIds.includes(id)) ??
      interopChainsIds
    ).sort(),
    to: (
      req.query.to?.filter((id) => interopChainsIds.includes(id)) ??
      interopChainsIds
    ).sort(),
  }
  const queryState = await cache.get(
    {
      key: [
        'interop',
        'summary',
        'prefetch',
        initialSelectedChains.from.join(','),
        initialSelectedChains.to.join(','),
      ],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    async () => {
      await helpers.interop.dashboard.prefetch({
        from: initialSelectedChains.from,
        to: initialSelectedChains.to,
      })
      return helpers.dehydrate()
    },
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
        queryState,
        interopChains: interopChainsWithIcons,
        initialSelectedChains,
      },
    },
  }
}
