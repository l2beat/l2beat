import { INTEROP_CHAINS } from '@l2beat/config'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import type { FromToQuery } from '../InteropRouter'

export async function getInteropLockAndMintData(
  req: Request<unknown, unknown, unknown, FromToQuery>,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const helpers = getSsrHelpers()
  const appLayoutProps = await getAppLayoutProps()
  const interopChainsIds = INTEROP_CHAINS.map((chain) => chain.id)
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
        'lock-and-mint',
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
        type: 'lockAndMint',
      })
      return helpers.dehydrate()
    },
  )

  const interopChainsWithIcons = INTEROP_CHAINS.map((chain) => ({
    ...chain,
    iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
  }))

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/interop/lock-&-mint/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'InteropLockAndMintPage',
      props: {
        ...appLayoutProps,
        queryState,
        interopChains: interopChainsWithIcons,
        initialSelectedChains,
      },
    },
  }
}
