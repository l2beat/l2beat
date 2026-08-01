import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getInteropProtocolData } from '~/server/features/scaling/interop/getInteropProtocolData'
import { getInteropProtocolEntry } from '~/server/features/scaling/interop/protocol/getInteropProtocolEntry'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { mapInteropChainsToWithIcons } from '../utils/mapInteropChainsToWithIcons'

export async function getInteropProtocolPageData(
  req: Request<{ slug: string }, unknown, unknown, { update?: string }>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['interop', 'protocols', req.params.slug],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getCachedData(req.params.slug, manifest),
    ),
  ])

  if (!data) return undefined

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${data.project.name} - L2BEAT`,
        description: data.project.description,
        url: req.originalUrl,
        openGraph: {
          image: `/meta-images/interop/projects/${data.project.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'InteropProtocolPage',
      props: {
        ...appLayoutProps,
        projectEntry: data.projectEntry,
        protocolData: data.protocolData,
        apiSelection: data.apiSelection,
        selectedUpdateId: req.query.update,
      },
    },
  }
}

async function getCachedData(slug: string, manifest: Manifest) {
  const interopChains = getInteropChains()
  const liveChainIds = interopChains
    .filter((chain) => !chain.isUpcoming)
    .map((chain) => chain.id)
  const apiSelection = { from: liveChainIds, to: liveChainIds }

  const project = await ps.getProject({
    slug,
    select: ['interopConfig'],
    optional: ['statuses', 'display', 'discoveryInfo'],
  })
  if (!project) return undefined

  const interopChainsWithIcons = mapInteropChainsToWithIcons(
    manifest,
    interopChains.filter((chain) => !chain.isUpcoming),
  )

  const protocolData = await getInteropProtocolData({
    id: project.id,
    ...apiSelection,
  })

  const projectEntry = await getInteropProtocolEntry(
    project,
    apiSelection,
    interopChainsWithIcons,
    protocolData,
  )

  return {
    project: {
      name: project.name,
      slug: project.slug,
      description: project.interopConfig.description,
    },
    projectEntry,
    protocolData,
    apiSelection,
  }
}
