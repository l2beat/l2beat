import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { TOKEN_FRAMEWORKS } from '~/server/features/scaling/interop/utils/tokenFrameworksList'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import {
  TRANSFER_SPEED_DEFAULT_FROM,
  TRANSFER_SPEED_DEFAULT_TO,
} from '../components/transferSpeedDefaults'
import { mapInteropChainsToWithIcons } from '../utils/mapInteropChainsToWithIcons'

export type InteropTokenFramework = {
  id: string
  projectId: string
  label: string
  slug: string
  name: string
  iconUrl: string
  color: string
}

export async function getInteropTokenFrameworksData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, tokenFrameworks] = await Promise.all([
    getAppLayoutProps(),
    getTokenFrameworks(manifest),
  ])

  const interopChains = getInteropChains()
  const interopChainsWithIcons = mapInteropChainsToWithIcons(
    manifest,
    interopChains.filter((chain) => !chain.isUpcoming),
  )

  const initialChainIds = interopChainsWithIcons.map((chain) => chain.id)

  const { queryState } = await cache.get(
    {
      key: [
        'interop',
        'tokenFrameworks',
        'prefetch',
        initialChainIds.join(','),
      ],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    async () => getCachedData(initialChainIds),
  )

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Token frameworks - L2BEAT',
        description:
          'Overview of token frameworks used across interop protocols.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/interop/token-frameworks/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'InteropTokenFrameworksPage',
      props: {
        ...appLayoutProps,
        tokenFrameworks,
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
        helpers.trpc.interop.tokenFrameworks.queryOptions({
          from: initialChainIds,
          to: initialChainIds,
        }),
      ),
      // The token frameworks page fetches this exact pair on initial render.
      helpers.queryClient.prefetchQuery(
        helpers.trpc.interop.tokenFrameworks.queryOptions({
          from: [TRANSFER_SPEED_DEFAULT_FROM],
          to: [TRANSFER_SPEED_DEFAULT_TO],
        }),
      ),
    ])
  }
  return { queryState: helpers.dehydrate() }
}

async function getTokenFrameworks(
  manifest: Manifest,
): Promise<InteropTokenFramework[]> {
  const projects = await ps.getProjects({ select: ['interopConfig'] })
  const projectsById = new Map(projects.map((project) => [project.id, project]))

  return TOKEN_FRAMEWORKS.map((framework) => {
    const project = projectsById.get(framework.projectId)

    if (!project) {
      throw new Error(
        `Token framework project not found: ${framework.projectId}`,
      )
    }

    return {
      id: framework.id,
      projectId: framework.projectId,
      label: framework.label,
      slug: project.slug,
      name: project.interopConfig.name ?? project.name,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      color: framework.color,
    }
  })
}
