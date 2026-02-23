import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import type { SelectedChainsIds } from '~/server/features/scaling/interop/types'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { withProjectIcon } from '~/utils/withProjectIcon'
import type { InternalFromToQuery, SelectedChainsQuery } from '../InteropRouter'
import { getInitialDirectionalSelectedChains } from '../utils/getInitialDirectionalSelectedChains'

type InteropMode = 'public' | 'internal'

interface GetInteropLockAndMintDataOptions {
  mode?: InteropMode
}

export async function getInteropLockAndMintData(
  req: Request<
    unknown,
    unknown,
    unknown,
    SelectedChainsQuery & InternalFromToQuery
  >,
  manifest: Manifest,
  cache: ICache,
  options?: GetInteropLockAndMintDataOptions,
): Promise<RenderData> {
  const mode = options?.mode ?? 'public'
  const appLayoutProps = await getAppLayoutProps()
  const interopChains = getInteropChains()
  const interopChainsIds = interopChains.map((chain) => chain.id)

  const initialSelectedChains: SelectedChainsIds = [
    interopChainsIds.find((id) => id === req.query.selectedChains?.[0]) ?? null,
    interopChainsIds.find((id) => id === req.query.selectedChains?.[1]) ?? null,
  ]
  const initialDirectionalSelectedChains = getInitialDirectionalSelectedChains(
    req.query,
    interopChainsIds,
  )

  const queryState = await cache.get(
    {
      key:
        mode === 'internal'
          ? [
              'interop',
              'lock-and-mint',
              'internal',
              'prefetch',
              initialDirectionalSelectedChains.from.join(','),
              initialDirectionalSelectedChains.to.join(','),
            ]
          : ['interop', 'lock-and-mint', 'prefetch', ...initialSelectedChains],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    async () =>
      getCachedData(
        mode,
        initialSelectedChains,
        initialDirectionalSelectedChains,
      ),
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
          image: '/meta-images/interop/lock-&-mint/opengraph-image.png',
        },
        excludeFromSearchEngines: mode === 'internal',
      }),
    },
    ssr: {
      page: 'InteropLockAndMintPage',
      props: {
        ...appLayoutProps,
        mode,
        ...queryState,
        interopChains: interopChainsWithIcons,
        initialSelectedChains,
        initialDirectionalSelectedChains:
          mode === 'internal' ? initialDirectionalSelectedChains : undefined,
      },
    },
  }
}

async function getCachedData(
  mode: InteropMode,
  initialSelectedChains: SelectedChainsIds,
  initialDirectionalSelectedChains: { from: string[]; to: string[] },
) {
  const helpers = getSsrHelpers()
  const [protocols] = await Promise.all([
    ps.getProjects({
      select: ['interopConfig'],
    }),
    mode === 'internal'
      ? helpers.interop.dashboard.prefetch({
          from: initialDirectionalSelectedChains.from,
          to: initialDirectionalSelectedChains.to,
          type: 'lockAndMint',
        })
      : initialSelectedChains[0] && initialSelectedChains[1]
        ? helpers.interop.dashboard.prefetch({
            selectedChainsIds: initialSelectedChains,
            type: 'lockAndMint',
          })
        : undefined,
  ])

  return {
    queryState: helpers.dehydrate(),
    protocols: protocols.map(withProjectIcon),
  }
}
