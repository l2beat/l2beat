import { INTEROP_CHAINS } from '@l2beat/config'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getInteropSummaryData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const helpers = getSsrHelpers()
  const appLayoutProps = await getAppLayoutProps()
  const interopChainsIds = INTEROP_CHAINS.map((chain) => chain.id)
  const queryState = await cache.get(
    {
      key: ['interop', 'summary', 'prefetch'],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    async () => {
      await helpers.interop.dashboard.prefetch({
        from: interopChainsIds,
        to: interopChainsIds,
      })
      return helpers.dehydrate()
    },
  )

  const interopChainsWithIcons = INTEROP_CHAINS.map((chain) => ({
    ...chain,
    iconUrl: getProjectIcon(chain.iconSlug ?? chain.id),
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
      },
    },
  }
}
