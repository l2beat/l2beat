import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import type { FirstSecondQuery } from '../InteropRouter'

export async function getInteropBurnAndMintData(
  req: Request<unknown, unknown, unknown, FirstSecondQuery>,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const helpers = getSsrHelpers()
  const appLayoutProps = await getAppLayoutProps()
  const interopChains = getInteropChains()
  const initialSelectedChains = {
    first: req.query.first,
    second: req.query.second,
  }
  const queryState = await cache.get(
    {
      key: [
        'interop',
        'burnAndMint',
        'prefetch',
        initialSelectedChains.first,
        initialSelectedChains.second,
      ],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    async () => {
      await helpers.interop.dashboard.prefetch({
        first: initialSelectedChains.first,
        second: initialSelectedChains.second,
        type: 'burnAndMint',
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
          image: '/meta-images/interop/burn-&-mint/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'InteropBurnAndMintPage',
      props: {
        ...appLayoutProps,
        queryState,
        interopChains: interopChainsWithIcons,
        initialSelectedChains,
      },
    },
  }
}
