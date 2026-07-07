import type { InteropIntentAttribute } from '@l2beat/config'
import type { InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getIntentProjects } from '~/server/features/scaling/interop/utils/getIntentProjects'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { mapInteropChainsToWithIcons } from '../utils/mapInteropChainsToWithIcons'

export type InteropIntentBridge = {
  id: ProjectId
  name: string
  slug: string
  iconUrl: string
  description: string | undefined
  intentModel: InteropIntentAttribute
  userRecovery: InteropIntentAttribute
  solverAccess: InteropIntentAttribute
  settlement: InteropIntentAttribute
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
    await helpers.queryClient.prefetchQuery(
      helpers.trpc.interop.intentBridges.queryOptions({
        from: initialChainIds,
        to: initialChainIds,
      }),
    )
  }
  return { queryState: helpers.dehydrate() }
}

async function getIntentBridges(
  manifest: Manifest,
): Promise<InteropIntentBridge[]> {
  const projects = await ps.getProjects({ select: ['interopConfig'] })

  return getIntentProjects(projects).map((project) => {
    const intent = project.interopConfig.intent

    return {
      id: project.id,
      name: project.interopConfig.name ?? project.name,
      slug: project.slug,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      description: project.interopConfig.description,
      intentModel: intent?.intentModel ?? unknownAttribute,
      userRecovery: intent?.userRecovery ?? unknownAttribute,
      solverAccess: intent?.solverAccess ?? unknownAttribute,
      settlement: intent?.settlement ?? unknownAttribute,
    }
  })
}

const unknownAttribute = {
  value: 'Unknown',
  description: 'This protocol-specific detail has not been added yet.',
} satisfies InteropIntentAttribute
