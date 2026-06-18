import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getIntentBridgeMetadata } from '~/server/features/scaling/interop/getIntentBridgesData'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { mapInteropChainsToWithIcons } from '../utils/mapInteropChainsToWithIcons'
import {
  INTENT_TRANSFER_SPEED_DEFAULT_FROM,
  INTENT_TRANSFER_SPEED_DEFAULT_TO,
} from './components/transfer-speed/consts'

export type InteropIntentBridge = Awaited<
  ReturnType<typeof getIntentBridgeMetadata>
>[number]

export async function getInteropIntentBridgesData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, intentBridges] = await Promise.all([
    getAppLayoutProps(),
    getIntentBridgeMetadata(),
  ])

  const interopChains = getInteropChains()
  const interopChainsWithIcons = mapInteropChainsToWithIcons(
    manifest,
    interopChains.filter((chain) => !chain.isUpcoming),
  )

  const initialChainIds = interopChainsWithIcons.map((chain) => chain.id)

  const { queryState } = await cache.get(
    {
      key: ['interop', 'intentBridges', 'prefetch', initialChainIds.join(',')],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    async () => getCachedData(initialChainIds),
  )

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Intent bridges - L2BEAT',
        description:
          'Overview of intent-based bridge protocols, including usage, transfer speed, supported routes, active tokens, and intent-specific execution properties.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/interop/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'InteropIntentBridgesPage',
      props: {
        ...appLayoutProps,
        intentBridges,
        interopChains: interopChainsWithIcons,
        queryState,
      },
    },
  }
}

async function getCachedData(initialChainIds: string[]) {
  const helpers = getSsrHelpers()
  if (initialChainIds.length > 0) {
    await Promise.all([
      helpers.queryClient.prefetchQuery(
        helpers.trpc.interop.intentBridges.queryOptions({
          from: initialChainIds,
          to: initialChainIds,
        }),
      ),
      helpers.queryClient.prefetchQuery(
        helpers.trpc.interop.intentBridges.queryOptions({
          from: [INTENT_TRANSFER_SPEED_DEFAULT_FROM],
          to: [INTENT_TRANSFER_SPEED_DEFAULT_TO],
        }),
      ),
    ])
  }
  return { queryState: helpers.dehydrate() }
}
