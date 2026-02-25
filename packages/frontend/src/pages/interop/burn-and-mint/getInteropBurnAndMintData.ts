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
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import type { InteropQuery } from '../InteropRouter'
import { getInitialInteropSelection } from '../utils/getInitialInteropSelection'
import { toInteropApiSelection } from '../utils/toInteropApiSelection'
import type { InteropMode, InteropSelection } from '../utils/types'

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
    mode,
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
    async () => getCachedData(initialSelection, mode),
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
        interopChains: interopChainsWithIcons.filter(
          (chain) => !chain.isUpcoming,
        ),
        onboardingInteropChains: interopChainsWithIcons,
        initialSelection,
      },
    },
  }
}

async function getCachedData(
  initialSelection: InteropSelection,
  mode: InteropMode,
) {
  const helpers = getSsrHelpers()
  const apiSelection = toInteropApiSelection(initialSelection, mode)
  const [protocols] = await Promise.all([
    ps.getProjects({
      select: ['interopConfig'],
    }),
    apiSelection.from.length > 0 && apiSelection.to.length > 0
      ? helpers.interop.dashboard.prefetch({
          ...apiSelection,
          type: 'burnAndMint',
        })
      : undefined,
  ])

  return {
    queryState: helpers.dehydrate(),
    protocols: protocols.map(withProjectIcon),
  }
}
