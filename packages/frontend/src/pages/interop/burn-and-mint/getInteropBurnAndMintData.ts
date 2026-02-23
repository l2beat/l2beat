import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { withProjectIcon } from '~/utils/withProjectIcon'
import type { InteropQuery } from '../InteropRouter'
import {
  getInitialInteropSelection,
  type InteropSelection,
} from '../utils/getInitialInteropSelection'

type InteropMode = 'public' | 'internal'

interface GetInteropBurnAndMintDataOptions {
  mode?: InteropMode
}

export async function getInteropBurnAndMintData(
  req: Request<unknown, unknown, unknown, InteropQuery>,
  manifest: Manifest,
  cache: ICache,
  options?: GetInteropBurnAndMintDataOptions,
): Promise<RenderData> {
  const mode = options?.mode ?? 'public'
  const appLayoutProps = await getAppLayoutProps()
  const interopChains = getInteropChains()
  const interopChainsIds = interopChains.map((chain) => chain.id)

  const initialSelection = getInitialInteropSelection({
    query: req.query,
    interopChainsIds,
    fallback: mode === 'internal' ? 'all' : 'empty',
  })

  const queryState = await cache.get(
    {
      key: [
        'interop',
        'burnAndMint',
        mode,
        'prefetch',
        initialSelection.from.join(','),
        initialSelection.to.join(','),
      ],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    async () => getCachedData(initialSelection),
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
        excludeFromSearchEngines: mode === 'internal',
      }),
    },
    ssr: {
      page: 'InteropBurnAndMintPage',
      props: {
        ...appLayoutProps,
        mode,
        ...queryState,
        interopChains: interopChainsWithIcons,
        initialSelection,
      },
    },
  }
}

async function getCachedData(initialSelection: InteropSelection) {
  const helpers = getSsrHelpers()
  const [protocols] = await Promise.all([
    ps.getProjects({
      select: ['interopConfig'],
    }),
    initialSelection.from.length > 0 && initialSelection.to.length > 0
      ? helpers.interop.dashboard.prefetch({
          ...initialSelection,
          type: 'burnAndMint',
        })
      : undefined,
  ])

  return {
    queryState: helpers.dehydrate(),
    protocols: protocols.map(withProjectIcon),
  }
}
