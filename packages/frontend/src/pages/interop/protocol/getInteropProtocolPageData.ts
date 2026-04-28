import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getInteropProtocolEntry } from '~/server/features/scaling/interop/protocol/getInteropProtocolEntry'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import type { InteropChainWithIcon } from '../components/chain-selector/types'

export async function getInteropProtocolPageData(
  req: Request<{ slug: string }, unknown, unknown, unknown>,
  manifest: Manifest,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const interopChains = getInteropChains()
  const liveChainIds = interopChains
    .filter((chain) => !chain.isUpcoming)
    .map((chain) => chain.id)
  const apiSelection = { from: liveChainIds, to: liveChainIds }

  const project = await ps.getProject({
    slug: req.params.slug,
    select: ['interopConfig'],
    optional: ['statuses', 'display'],
  })
  if (!project) return undefined

  const interopChainsWithIcons: InteropChainWithIcon[] = interopChains
    .filter((chain) => !chain.isUpcoming)
    .map((chain) => ({
      ...chain,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    }))

  const [appLayoutProps] = await Promise.all([
    getAppLayoutProps(),
    helpers.interop.protocol.fetch({
      id: project.id,
      ...apiSelection,
    }),
  ])
  const projectEntry = getInteropProtocolEntry(project)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${project.name} - L2BEAT`,
        description: project.interopConfig.description,
        url: req.originalUrl,
        openGraph: {
          image: `/meta-images/interop/projects/${project.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'InteropProtocolPage',
      props: {
        ...appLayoutProps,
        projectEntry,
        queryState: helpers.dehydrate(),
        interopChains: interopChainsWithIcons,
        apiSelection,
      },
    },
  }
}
