import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import { type Manifest, manifest } from '~/utils/Manifest'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import type { InteropQuery } from '../InteropRouter'
import {
  getInitialInteropSelection,
  type InteropSelection,
} from '../utils/getInitialInteropSelection'

type InteropMode = 'public' | 'internal'

interface GetInteropSummaryDataOptions {
  mode?: InteropMode
}

export async function getInteropSummaryData(
  req: Request<unknown, unknown, unknown, InteropQuery>,
  manifest: Manifest,
  cache: ICache,
  options?: GetInteropSummaryDataOptions,
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
        'summary',
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

  const interopChainsWithIcons: InteropChainWithIcon[] = interopChains.map(
    (chain) => ({
      ...chain,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    }),
  )

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url: req.originalUrl,
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
        interopChains: interopChainsWithIcons.filter(
          (chain) => !chain.isUpcoming,
        ),
        onboardingInteropChains: interopChainsWithIcons,
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
      ? helpers.interop.dashboard.prefetch({ ...initialSelection })
      : undefined,
  ])

  return {
    queryState: helpers.dehydrate(),
    protocols: protocols.map((protocol) => ({
      name: protocol.interopConfig.name ?? protocol.name,
      iconUrl: manifest.getUrl(`/icons/${protocol.slug}.png`),
    })),
  }
}
