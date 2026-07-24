import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import {
  getScalingProjectEntry,
  SCALING_PROJECT_FACET_KEYS,
  SCALING_PROJECT_OPTIONAL_KEYS,
} from '~/server/features/scaling/project/getScalingProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const project = await ps.getProject({
    slug,
    select: ['display', 'statuses', ...SCALING_PROJECT_FACET_KEYS],
    optional: [...SCALING_PROJECT_OPTIONAL_KEYS],
  })
  if (!project) return undefined

  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
    getScalingProjectEntry(project, helpers),
  ])
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
