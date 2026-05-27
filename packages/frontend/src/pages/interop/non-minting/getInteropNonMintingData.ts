import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
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
import type { InteropSelection } from '../utils/types'

export async function getInteropNonMintingData(
  req: Request<unknown, unknown, unknown, InteropQuery>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const interopChains = getInteropChains()
  const interopChainsIds = interopChains.map((chain) => chain.id)

  const initialSelection = getInitialInteropSelection({
    query: req.query,
    interopChainsIds,
  })

  const queryState = await cache.get(
    {
      key: [
        'interop',
        'non-minting',
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
        title: 'Interoperability - L2BEAT',
        description:
          'Compare interoperability protocols across the Ethereum ecosystem. Track bridge volumes, transfer times & sizes, and explore how Non-minting, Lock & Mint, and Burn & Mint mechanisms affect cross-chain risk.',

        url: req.originalUrl,

        openGraph: {
          image: '/meta-images/interop/non-minting/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'InteropNonMintingPage',
      props: {
        ...appLayoutProps,
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
      ? helpers.interop.dashboard.prefetch({
          ...initialSelection,
          type: 'nonMinting',
        })
      : undefined,
  ])

  return {
    queryState: helpers.dehydrate(),
    protocols: protocols.map(withProjectIcon),
  }
}
