import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { withProjectIcon } from '~/utils/withProjectIcon'
import type { TransferType } from './components/InteropTransferTypePage'
import type { InteropQuery } from './InteropRouter'
import { TRANSFER_TYPE_DISPLAY } from './utils/display'
import { getInitialInteropSelection } from './utils/getInitialInteropSelection'
import { mapInteropChainsToWithIcons } from './utils/mapInteropChainsToWithIcons'
import type { InteropSelection } from './utils/types'

const TRANSFER_TYPE_PAGES = {
  lockAndMint: {
    page: 'InteropLockAndMintPage',
    image: '/meta-images/interop/lock-&-mint/opengraph-image.png',
  },
  burnAndMint: {
    page: 'InteropBurnAndMintPage',
    image: '/meta-images/interop/burn-&-mint/opengraph-image.png',
  },
  nonMinting: {
    page: 'InteropNonMintingPage',
    image: '/meta-images/interop/non-minting/opengraph-image.png',
  },
} as const

export async function getInteropTransferTypeData(
  type: TransferType,
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
        type,
        'prefetch',
        initialSelection.from.join(','),
        initialSelection.to.join(','),
      ],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    async () => getCachedData(type, initialSelection),
  )

  const interopChainsWithIcons = mapInteropChainsToWithIcons(
    manifest,
    interopChains,
  )

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: TRANSFER_TYPE_DISPLAY[type].label,
        title: 'Interoperability - L2BEAT',
        description:
          'Compare interoperability protocols across the Ethereum ecosystem. Track bridge volumes, transfer times & sizes, and explore how Non-minting, Lock & Mint, and Burn & Mint mechanisms affect cross-chain risk.',
        url: req.originalUrl,
        openGraph: {
          image: TRANSFER_TYPE_PAGES[type].image,
        },
      }),
    },
    ssr: {
      page: TRANSFER_TYPE_PAGES[type].page,
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

async function getCachedData(
  type: TransferType,
  initialSelection: InteropSelection,
) {
  const helpers = getSsrHelpers()
  const [protocols] = await Promise.all([
    ps.getProjects({
      select: ['interopConfig'],
    }),
    initialSelection.from.length > 0 && initialSelection.to.length > 0
      ? helpers.queryClient.prefetchQuery(
          helpers.trpc.interop.dashboard.queryOptions({
            ...initialSelection,
            type,
          }),
        )
      : undefined,
  ])

  return {
    queryState: helpers.dehydrate(),
    protocols: protocols.map(withProjectIcon),
  }
}
