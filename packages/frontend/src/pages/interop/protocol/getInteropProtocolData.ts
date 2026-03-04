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
import type { InteropQuery } from '../InteropRouter'
import { getInitialInteropSelection } from '../utils/getInitialInteropSelection'

export async function getInteropProtocolData(
  req: Request<{ slug: string }, unknown, unknown, InteropQuery>,
  manifest: Manifest,
): Promise<RenderData | undefined> {
  const mode = 'public'
  const helpers = getSsrHelpers()
  const interopChains = getInteropChains()
  const interopChainsIds = interopChains.map((chain) => chain.id)
  const initialSelection = getInitialInteropSelection({
    query: req.query,
    interopChainsIds,
    mode,
  })

  const project = await ps.getProject({
    slug: req.params.slug,
    select: ['interopConfig'],
    optional: ['statuses', 'display'],
  })
  if (!project) return undefined

  const interopChainsWithIcons: InteropChainWithIcon[] = interopChains.map(
    (chain) => ({
      ...chain,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    }),
  )

  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
    getInteropProtocolEntry(project),
  ])
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${project.name} - L2BEAT`,
        // description: getProjectMetadataDescription(project),
        openGraph: {
          url: req.originalUrl,
          image: `/meta-images/scaling/projects/${project.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'InteropProtocolPage',
      props: {
        ...appLayoutProps,
        mode,
        projectEntry,
        queryState: helpers.dehydrate(),
        interopChains: interopChainsWithIcons.filter(
          (chain) => !chain.isUpcoming,
        ),
        initialSelection,
      },
    },
  }
}
