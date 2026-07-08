import type { TableReadyValue } from '@l2beat/config'
import type { InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getIntentProjects } from '~/server/features/scaling/interop/utils/getIntentProjects'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { INTENT_BRIDGE_COLORS } from '~/server/features/scaling/interop/utils/intentBridgeColors'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { mapInteropChainsToWithIcons } from '../utils/mapInteropChainsToWithIcons'
import {
  INTENT_TRANSFER_SPEED_DEFAULT_FROM,
  INTENT_TRANSFER_SPEED_DEFAULT_TO,
} from './components/transfer-speed/consts'

export type InteropIntentBridge = {
  id: ProjectId
  name: string
  slug: string
  iconUrl: string
  description: string | undefined
  color: string
  intentModel: TableReadyValue
  userRecovery: TableReadyValue
  solverAccess: TableReadyValue
  settlement: TableReadyValue
}

export async function getInteropIntentBridgesData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, intentBridges] = await Promise.all([
    getAppLayoutProps(),
    getIntentBridges(manifest),
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
          'Overview of intent-based bridge protocols across the Ethereum ecosystem.',
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

async function getIntentBridges(
  manifest: Manifest,
): Promise<InteropIntentBridge[]> {
  const projects = await ps.getProjects({ select: ['interopConfig'] })

  return getIntentProjects(projects).map((project, index) => {
    const intent = project.interopConfig.intent

    return {
      id: project.id,
      name: project.interopConfig.name ?? project.name,
      slug: project.slug,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      description: project.interopConfig.description,
      color:
        INTENT_BRIDGE_COLORS[index % INTENT_BRIDGE_COLORS.length] ?? '#64748B',
      intentModel: intent.intentModel,
      userRecovery: intent.userRecovery,
      solverAccess: intent.solverAccess,
      settlement: intent.settlement,
    }
  })
}
