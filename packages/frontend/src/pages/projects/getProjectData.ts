import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import {
  getProjectEntry,
  getUnifiedProject,
} from '~/server/features/projects/project/getProjectEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const project = await getUnifiedProject(slug)
  if (!project) return undefined

  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
    getProjectEntry(project, helpers),
  ])
  if (!projectEntry) return undefined

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${project.name} - L2BEAT`,
        description: getProjectMetadataDescription(project),
        url,
        openGraph: {
          image: `/meta-images/scaling/projects/${project.slug}/opengraph-image.png`,
        },
        // Dark launch: keep the unified page out of search engines until
        // parity is verified and the product flips happen.
        excludeFromSearchEngines: true,
      }),
    },
    ssr: {
      page: 'ScalingProjectPage',
      props: {
        ...appLayoutProps,
        projectEntry,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
