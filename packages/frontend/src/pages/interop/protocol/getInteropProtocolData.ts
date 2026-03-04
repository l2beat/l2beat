import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getInteropProtocolEntry } from '~/server/features/scaling/interop/protocol/getInteropProtocolEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getInteropProtocolData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const project = await ps.getProject({
    slug,
    select: ['interopConfig'],
    optional: ['statuses', 'display'],
  })
  if (!project) return undefined

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
          url,
          image: `/meta-images/scaling/projects/${project.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'InteropProtocolPage',
      props: {
        ...appLayoutProps,
        projectEntry,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
